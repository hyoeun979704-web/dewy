/**
 * hooks/useVenueDetails.ts
 *
 * 웨딩홀 상세: 홀 정보 + 하이라이트(장점 카드)
 * ERD: hall_rooms (FK→wedding_halls), vendor_highlights (FK→vendors)
 */

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { HallRoom, VendorHighlight } from "@/types/database";

export type VenueHall = HallRoom;
export type VenueSpecialPoint = VendorHighlight;

export const useVenueHalls = (vendorId: number | string | undefined) => {
  const id =
    typeof vendorId === "string" ? parseInt(vendorId, 10) : vendorId;

  return useQuery({
    queryKey: ["hall_rooms", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hall_rooms")
        .select("*")
        .eq("hall_id", id!)
        .order("room_id", { ascending: true });

      if (error) throw error;
      return (data ?? []) as HallRoom[];
    },
    enabled: !!id,
  });
};

export const useVenueSpecialPoints = (vendorId: number | string | undefined) => {
  const id =
    typeof vendorId === "string" ? parseInt(vendorId, 10) : vendorId;

  return useQuery({
    queryKey: ["vendor_highlights", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendor_highlights")
        .select("*")
        .eq("vendor_id", id!)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return (data ?? []) as VendorHighlight[];
    },
    enabled: !!id,
  });
};
