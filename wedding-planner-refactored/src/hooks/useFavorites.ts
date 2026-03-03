/**
 * hooks/useFavorites.ts
 *
 * 찜/좋아요 기능.
 * ERD: user_actions (복합 PK: user_id, target_type, target_id)
 * target_type: 'VENDOR'|'PRODUCT'|'POST'|'EVENT'|'SHOPPING'
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { UserAction, UserActionTargetType } from "@/types/database";

// 이전 ItemType → ERD의 UserActionTargetType 매핑
export type ItemType =
  | "venue"
  | "studio"
  | "honeymoon"
  | "honeymoon_gift"
  | "appliance"
  | "suit"
  | "hanbok"
  | "invitation_venues"
  | "community_post"
  | "deal"
  | "product"
  | "influencer";

/** 프론트엔드 ItemType → ERD target_type 변환 */
function toTargetType(itemType: ItemType): UserActionTargetType {
  switch (itemType) {
    case "venue":
    case "studio":
    case "honeymoon":
    case "suit":
    case "hanbok":
    case "invitation_venues":
    case "influencer":
      return "VENDOR";
    case "community_post":
      return "POST";
    case "deal":
      return "EVENT";
    case "honeymoon_gift":
    case "appliance":
      return "SHOPPING";
    case "product":
      return "PRODUCT";
    default:
      return "VENDOR";
  }
}

export const useFavorites = () => {
  const { user, dbUserId } = useAuth();
  const queryClient = useQueryClient();

  // user_actions에서 현재 유저의 모든 찜 목록 조회
  const { data: favorites = [], isLoading } = useQuery<UserAction[]>({
    queryKey: ["user_actions", dbUserId],
    queryFn: async (): Promise<UserAction[]> => {
      if (!dbUserId) return [];

      const { data, error } = await supabase
        .from("user_actions")
        .select("*")
        .eq("user_id", dbUserId);

      if (error) throw error;
      return (data || []) as UserAction[];
    },
    enabled: !!dbUserId,
  });

  const addFavorite = useMutation({
    mutationFn: async ({
      itemId,
      itemType,
    }: {
      itemId: number | string;
      itemType: ItemType;
    }) => {
      if (!dbUserId) throw new Error("로그인이 필요합니다");

      const targetId = typeof itemId === "string" ? parseInt(itemId, 10) : itemId;
      const targetType = toTargetType(itemType);

      const { error } = await supabase.from("user_actions").insert({
        user_id: dbUserId,
        target_type: targetType,
        target_id: targetId,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_actions", dbUserId] });
      toast.success("찜 목록에 추가되었습니다");
    },
    onError: (error) => {
      toast.error("찜하기에 실패했습니다");
      console.error(error);
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async ({
      itemId,
      itemType,
    }: {
      itemId: number | string;
      itemType: ItemType;
    }) => {
      if (!dbUserId) throw new Error("로그인이 필요합니다");

      const targetId = typeof itemId === "string" ? parseInt(itemId, 10) : itemId;
      const targetType = toTargetType(itemType);

      const { error } = await supabase
        .from("user_actions")
        .delete()
        .eq("user_id", dbUserId)
        .eq("target_type", targetType)
        .eq("target_id", targetId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_actions", dbUserId] });
      toast.success("찜 목록에서 제거되었습니다");
    },
    onError: (error) => {
      toast.error("찜 해제에 실패했습니다");
      console.error(error);
    },
  });

  const isFavorite = (itemId: number | string, itemType: ItemType): boolean => {
    const targetId = typeof itemId === "string" ? parseInt(itemId, 10) : itemId;
    const targetType = toTargetType(itemType);
    return favorites.some(
      (fav) => fav.target_id === targetId && fav.target_type === targetType
    );
  };

  const toggleFavorite = async (itemId: number | string, itemType: ItemType) => {
    if (isFavorite(itemId, itemType)) {
      await removeFavorite.mutateAsync({ itemId, itemType });
    } else {
      await addFavorite.mutateAsync({ itemId, itemType });
    }
  };

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    isToggling: addFavorite.isPending || removeFavorite.isPending,
  };
};
