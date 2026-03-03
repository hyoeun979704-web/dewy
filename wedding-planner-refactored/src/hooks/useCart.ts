/**
 * hooks/useCart.ts
 * ERD: cart (cart_id, user_id, product_type, product_id, option_id, quantity)
 *      shopping_products (조인하여 상품 정보 표시)
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { CartItem as CartRow, ShoppingProduct } from "@/types/database";

export interface CartItemWithProduct extends CartRow {
  product?: ShoppingProduct | null;
}

export const useCart = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user) { setItems([]); setIsLoading(false); return; }
    try {
      const userId = Number(user.id);
      const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      const cartRows = (data || []) as CartRow[];

      // 각 cart item의 product 정보 조회
      const productIds = cartRows.filter(c => c.product_type === 'SHOPPING').map(c => c.product_id);
      let productMap: Record<number, ShoppingProduct> = {};
      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from("shopping_products")
          .select("*")
          .in("shopping_product_id", productIds);
        (products || []).forEach((p: any) => { productMap[p.shopping_product_id] = p as ShoppingProduct; });
      }

      setItems(cartRows.map(c => ({ ...c, product: productMap[c.product_id] || null })));
    } catch (error) { console.error("Error fetching cart:", error); }
    finally { setIsLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId: number, productType: string = 'SHOPPING', quantity = 1): Promise<boolean> => {
    if (!user) { toast.error("로그인이 필요합니다"); return false; }
    try {
      const userId = Number(user.id);
      const existing = items.find(i => i.product_id === productId && i.product_type === productType);
      if (existing) {
        await supabase.from("cart").update({ quantity: existing.quantity + quantity }).eq("cart_id", existing.cart_id);
      } else {
        await supabase.from("cart").insert({ user_id: userId, product_type: productType, product_id: productId, quantity });
      }
      toast.success("장바구니에 담았어요 🛒");
      await fetchCart();
      return true;
    } catch (error) { console.error(error); toast.error("장바구니 추가에 실패했습니다"); return false; }
  };

  const updateQuantity = async (cartId: number, quantity: number) => {
    if (quantity < 1) return removeItem(cartId);
    try {
      await supabase.from("cart").update({ quantity }).eq("cart_id", cartId);
      setItems(prev => prev.map(i => i.cart_id === cartId ? { ...i, quantity } : i));
    } catch (error) { console.error(error); }
  };

  const removeItem = async (cartId: number) => {
    try {
      await supabase.from("cart").delete().eq("cart_id", cartId);
      setItems(prev => prev.filter(i => i.cart_id !== cartId));
      toast.success("삭제되었습니다");
    } catch (error) { console.error(error); }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      await supabase.from("cart").delete().eq("user_id", Number(user.id));
      setItems([]);
    } catch (error) { console.error(error); }
  };

  const totalAmount = items.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items, isLoading, itemCount, totalAmount, addToCart, updateQuantity, removeItem, clearCart, refetch: fetchCart };
};
