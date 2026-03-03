/**
 * lib/vendorQueries.ts
 *
 * 공통 Vendor 조회 함수들.
 * ERD의 Vendors 슈퍼타입 테이블을 category_type 으로 필터링하여
 * 각 카테고리 페이지(웨딩홀, 스튜디오, 한복, 예복, 허니문, 식당 …)에 공통 제공.
 */

import { supabase } from "@/integrations/supabase/client";
import type {
  Vendor,
  VendorCategoryType,
  VendorHighlight,
  ImageRecord,
  Review,
} from "@/types/database";

// ─── 업체 목록 조회 (페이지네이션) ──────────────────

export interface FetchVendorsParams {
  categoryType: VendorCategoryType;
  page?: number;
  pageSize?: number;
  region?: string | null;
  minRating?: number | null;
  keyword?: string | null;
}

export interface FetchVendorsResult {
  data: Vendor[];
  nextPage: number | undefined;
  totalCount: number;
}

export async function fetchVendorsByCategory({
  categoryType,
  page = 0,
  pageSize = 10,
  region,
  minRating,
  keyword,
}: FetchVendorsParams): Promise<FetchVendorsResult> {
  let query = supabase
    .from("vendors")
    .select("*", { count: "exact" })
    .eq("category_type", categoryType);

  // 지역 필터
  if (region) {
    query = query.ilike("region", `%${region}%`);
  }

  // 최소 평점 필터
  if (minRating) {
    query = query.gte("avg_rating", minRating);
  }

  // 키워드 검색
  if (keyword) {
    query = query.or(
      `name.ilike.%${keyword}%,keywords.ilike.%${keyword}%,address.ilike.%${keyword}%`
    );
  }

  // 정렬: 평점 높은 순
  query = query
    .order("avg_rating", { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: (data ?? []) as Vendor[],
    nextPage: data && data.length === pageSize ? page + 1 : undefined,
    totalCount: count ?? 0,
  };
}

// ─── 업체 단건 조회 ─────────────────────────────────

export async function fetchVendorById(vendorId: number): Promise<Vendor | null> {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("vendor_id", vendorId)
    .maybeSingle();

  if (error) throw error;
  return data as Vendor | null;
}

// ─── 업체 하이라이트 (장점 카드) ────────────────────

export async function fetchVendorHighlights(
  vendorId: number
): Promise<VendorHighlight[]> {
  const { data, error } = await supabase
    .from("vendor_highlights")
    .select("*")
    .eq("vendor_id", vendorId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as VendorHighlight[];
}

// ─── 업체 이미지 ────────────────────────────────────

export async function fetchImages(
  refType: string,
  refId: number
): Promise<ImageRecord[]> {
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("ref_type", refType)
    .eq("ref_id", refId)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ImageRecord[];
}

// ─── 업체/상품 리뷰 ────────────────────────────────

export async function fetchReviews(
  targetType: string,
  targetId: number
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Review[];
}

// ─── 추천 업체 (상위 N건) ───────────────────────────

export async function fetchTopVendors(
  categoryType: VendorCategoryType,
  limit: number = 6
): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("category_type", categoryType)
    .order("avg_rating", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Vendor[];
}
