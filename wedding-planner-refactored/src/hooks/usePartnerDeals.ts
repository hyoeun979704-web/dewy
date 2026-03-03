/**
 * hooks/usePartnerDeals.ts
 * ERD: events (이벤트/혜택)
 *      user_actions (target_type='EVENT') → 혜택 수령 기록
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Event } from "@/types/database";

export interface PartnerDeal extends Event {
  is_claimed?: boolean;
}

const categoryLabels: Record<string, string> = {
  all: "전체", venue: "웨딩홀", studio: "스튜디오", dress: "드레스",
  makeup: "메이크업", honeymoon: "허니문", gift: "예물", interior: "혼수/인테리어", general: "기타",
};

export const useDealCategoryLabels = () => categoryLabels;

export const usePartnerDeals = (category?: string) => {
  const { user, dbUserId } = useAuth();
  const [deals, setDeals] = useState<PartnerDeal[]>([]);
  const [featured, setFeatured] = useState<PartnerDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    try {
      let query = supabase.from("events").select("*").eq("status", "진행중").order("view_count", { ascending: false });
      if (category && category !== "all") {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) throw error;

      let claimedIds = new Set<number>();
      if (dbUserId) {
        const { data: claims } = await supabase
          .from("user_actions")
          .select("target_id")
          .eq("user_id", dbUserId)
          .eq("target_type", "EVENT");
        claimedIds = new Set((claims || []).map((c: any) => c.target_id));
      }

      const enriched = (data || []).map((d: any) => ({
        ...d,
        is_claimed: claimedIds.has(d.event_id),
      })) as PartnerDeal[];

      setDeals(enriched);
      // featured = view_count 상위
      setFeatured(enriched.slice(0, 3));
    } catch (error) { console.error("Error fetching deals:", error); }
    finally { setIsLoading(false); }
  }, [category, dbUserId]);

  useEffect(() => { fetchDeals(); }, [fetchDeals]);

  const claimDeal = async (eventId: number): Promise<boolean> => {
    if (!dbUserId) { toast.error("로그인이 필요합니다"); return false; }
    try {
      const { error } = await supabase.from("user_actions").insert({
        user_id: dbUserId, target_type: "EVENT", target_id: eventId,
      });
      if (error) {
        if (error.code === "23505") { toast.info("이미 받은 혜택이에요"); return false; }
        throw error;
      }
      setDeals(prev => prev.map(d => d.event_id === eventId ? { ...d, is_claimed: true } : d));
      toast.success("혜택을 받았어요! 🎉");
      return true;
    } catch (error) { console.error(error); toast.error("혜택 받기에 실패했습니다"); return false; }
  };

  return { deals, featured, isLoading, claimDeal, refetch: fetchDeals };
};

export const usePartnerDealDetail = (id: number | string | undefined) => {
  const { dbUserId } = useAuth();
  const [deal, setDeal] = useState<PartnerDeal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const eventId = typeof id === "string" ? parseInt(id, 10) : id;

  useEffect(() => {
    if (!eventId) return;
    const fetchDeal = async () => {
      try {
        const { data, error } = await supabase.from("events").select("*").eq("event_id", eventId).single();
        if (error) throw error;
        let isClaimed = false;
        if (dbUserId) {
          const { data: claim } = await supabase.from("user_actions").select("target_id").eq("user_id", dbUserId).eq("target_type", "EVENT").eq("target_id", eventId).maybeSingle();
          isClaimed = !!claim;
        }
        setDeal({ ...data, is_claimed: isClaimed } as PartnerDeal);
      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
    };
    fetchDeal();
  }, [eventId, dbUserId]);

  return { deal, isLoading };
};
