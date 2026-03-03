/**
 * hooks/useRecommendedItems.ts
 * ERD: vendors 테이블에서 카테고리별 상위 아이템 추천
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { CategoryTab } from "@/components/home/CategoryTabBar";
import type { VendorCategoryType } from "@/types/database";

export interface RecommendedItem {
  id: number;
  name: string;
  location: string;
  priceRange: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
}

interface TabConfig {
  categoryType: VendorCategoryType;
  listPath: string;
  detailPath: string;
  title: string;
}

const tabConfigMap: Record<CategoryTab, TabConfig> = {
  home: { categoryType: "스튜디오", listPath: "/studios", detailPath: "/studio", title: "인기 스드메 추천" },
  events: { categoryType: "허니문", listPath: "/honeymoon", detailPath: "/honeymoon", title: "인기 허니문 추천" },
  shopping: { categoryType: "예물", listPath: "/honeymoon-gifts", detailPath: "/honeymoon-gifts", title: "인기 예물 추천" },
  info: { categoryType: "예복", listPath: "/suit", detailPath: "/suit", title: "인기 예복 추천" },
};

export const getTabConfig = (tab: CategoryTab) => tabConfigMap[tab];

export const useRecommendedItems = (activeTab: CategoryTab) => {
  const config = tabConfigMap[activeTab];

  return useQuery({
    queryKey: ["recommended", activeTab],
    queryFn: async (): Promise<RecommendedItem[]> => {
      const { data, error } = await supabase
        .from("vendors")
        // 필요한 컬럼만 지정 — select("*") 대비 전송 데이터 축소
        .select("vendor_id, name, region, address, avg_rating, review_count, thumbnail_url")
        .eq("category_type", config.categoryType)
        .order("avg_rating", { ascending: false })
        .limit(6);

      if (error) throw error;
      if (!data) return [];

      return (data as any[]).map((item) => ({
        id: item.vendor_id,
        name: item.name,
        location: item.region || item.address || "",
        priceRange: "가격 문의",
        rating: parseFloat(item.avg_rating) || 4.0,
        reviewCount: item.review_count || 0,
        imageUrl: item.thumbnail_url || "/placeholder.svg",
      }));
    },
    // 추천 목록은 자주 바뀌지 않으므로 30분 캐시 — 탭 전환마다 재조회 방지
    staleTime: 1000 * 60 * 30,
  });
};
