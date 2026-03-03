/**
 * hooks/useCategoryData.ts
 *
 * 범용 카테고리(업체) 목록 조회 훅.
 * 이전: 각 카테고리마다 별도 Supabase 테이블(venues, studios, honeymoon …)을 직접 조회
 * 이후: 통합 vendors 테이블을 category_type 으로 필터링
 */

import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchVendorsByCategory } from "@/lib/vendorQueries";
import type { Vendor, VendorCategoryType } from "@/types/database";
import { useCategoryFilterStore } from "@/stores/useCategoryFilterStore";
import type { CategoryType } from "@/stores/useCategoryFilterStore";

// 기존 CategoryType → ERD의 VendorCategoryType 매핑
const categoryTypeMap: Record<CategoryType, VendorCategoryType> = {
  venues: "웨딩홀",
  studios: "스튜디오",
  honeymoon: "허니문",
  honeymoon_gifts: "예물",   // 혼수 선물류는 예물 벤더로 매핑 (TODO: 명세 필요 - shopping_products 와 분리할 수 있음)
  appliances: "예물",        // TODO: 가전은 ERD에 별도 vendors 카테고리 없음. shopping_products 사용 검토
  suits: "예복",
  hanbok: "한복",
  invitation_venues: "식당",
};

/** 기존 CategoryItem 인터페이스를 Vendor 기반으로 재정의 */
export type CategoryItem = Vendor;

const PAGE_SIZE = 10;

export function useCategoryData(category: CategoryType) {
  const region = useCategoryFilterStore((s) => s.region);
  const minRating = useCategoryFilterStore((s) => s.minRating);
  const filterOptions1 = useCategoryFilterStore((s) => s.filterOptions1);

  const vendorCategory = categoryTypeMap[category];

  return useInfiniteQuery({
    queryKey: [
      "vendors",
      category,
      vendorCategory,
      region,
      minRating,
      filterOptions1,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      // honeymoon_gifts / appliances 는 shopping_products 테이블을 사용해야 할 수 있음
      // 우선은 vendors 테이블에서 category_type 으로 조회
      const result = await fetchVendorsByCategory({
        categoryType: vendorCategory,
        page: pageParam,
        pageSize: PAGE_SIZE,
        region,
        minRating,
        keyword: filterOptions1.length > 0 ? filterOptions1[0] : null,
      });

      return {
        data: result.data,
        nextPage: result.nextPage,
        totalCount: result.totalCount,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
}

export { categoryTypeMap };
