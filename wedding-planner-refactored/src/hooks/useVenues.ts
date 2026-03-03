/**
 * hooks/useVenues.ts
 *
 * 웨딩홀 목록/단건 조회.
 * ERD: vendors (category_type='웨딩홀') + wedding_halls (1:1 확장)
 */

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useFilterStore, FilterState } from "@/stores/useFilterStore";
import type { Vendor } from "@/types/database";

const VENUES_PER_PAGE = 10;

/** 이전 Venue 인터페이스 → Vendor 기반으로 재정의 */
export type Venue = Vendor;

interface FetchVenuesParams {
  pageParam: number;
  filters: FilterState;
}

const fetchVenues = async ({ pageParam = 0, filters }: FetchVenuesParams) => {
  const from = pageParam * VENUES_PER_PAGE;
  const to = from + VENUES_PER_PAGE - 1;

  let query = supabase
    .from("vendors")
    .select("*", { count: "exact" })
    .eq("category_type", "웨딩홀");

  if (filters.region) {
    query = query.ilike("region", `%${filters.region}%`);
  }

  if (filters.minRating) {
    query = query.gte("avg_rating", filters.minRating);
  }

  // keywords 필드에서 필터 (기존 hall_types, meal_options, event_options 대체)
  if (filters.hallTypes && filters.hallTypes.length > 0) {
    // keywords 컬럼에서 키워드 검색으로 대체
    const keywordFilter = filters.hallTypes.map((t) => `keywords.ilike.%${t}%`).join(",");
    query = query.or(keywordFilter);
  }

  const { data, error, count } = await query
    .order("avg_rating", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    venues: (data ?? []) as Venue[],
    nextPage: to < (count ?? 0) - 1 ? pageParam + 1 : undefined,
    totalCount: count ?? 0,
  };
};

export const useVenues = () => {
  const {
    region,
    maxPrice,
    maxGuarantee,
    minRating,
    hallTypes,
    mealOptions,
    eventOptions,
  } = useFilterStore();

  const filters: FilterState = {
    region,
    maxPrice,
    maxGuarantee,
    minRating,
    hallTypes,
    mealOptions,
    eventOptions,
  };

  return useInfiniteQuery({
    queryKey: ["venues", filters],
    queryFn: ({ pageParam }) => fetchVenues({ pageParam, filters }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};

export const useVenue = (vendorId: number | string) => {
  const id = typeof vendorId === "string" ? parseInt(vendorId, 10) : vendorId;

  return useQuery({
    queryKey: ["venue", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("vendor_id", id)
        .eq("category_type", "웨딩홀")
        .maybeSingle();

      if (error) throw error;
      return data as Venue | null;
    },
    enabled: !!id && !isNaN(id),
  });
};
