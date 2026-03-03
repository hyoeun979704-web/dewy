/**
 * hooks/useBudget.ts
 *
 * 예산 관리.
 * ERD: users.total_budget + user_budgets (카테고리별 target/spent)
 *
 * 이전: budget_settings (별도 테이블) + budget_items (상세 지출 항목)
 * 이후: users.total_budget + user_budgets (카테고리 단위)
 *
 * NOTE: ERD의 user_budgets는 카테고리 단위 집계(target/spent)만 있고,
 *       개별 지출 항목(budget_items)은 ERD에 없음.
 *       기존 budget_items 기능은 user_budgets.spent_amount 에 합산하는 방식으로 대체.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { regionalAverages, type BudgetCategory } from "@/data/budgetData";
import type { UserBudget, User } from "@/types/database";

export interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  categoryTotals: Record<string, { target: number; spent: number }>;
}

export function useBudget() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 사용자 정보 (total_budget, region_code)
  const userQuery = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("users")
        .select("user_id, total_budget, region_code")
        .eq("user_id", Number(user.id))
        .maybeSingle();
      if (error) throw error;
      return data as Pick<User, "user_id" | "total_budget" | "region_code"> | null;
    },
    enabled: !!user,
  });

  // 카테고리별 예산 목록
  const budgetsQuery = useQuery({
    queryKey: ["user-budgets", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_budgets")
        .select("*")
        .eq("user_id", Number(user.id));
      if (error) throw error;
      return (data || []) as UserBudget[];
    },
    enabled: !!user,
  });

  const budgets = budgetsQuery.data || [];
  const totalBudget = userQuery.data?.total_budget || 0;

  const summary: BudgetSummary = {
    totalBudget,
    totalSpent: budgets.reduce((s, b) => s + b.spent_amount, 0),
    remaining:
      totalBudget - budgets.reduce((s, b) => s + b.spent_amount, 0),
    categoryTotals: budgets.reduce(
      (acc, b) => {
        acc[b.category] = {
          target: b.target_amount,
          spent: b.spent_amount,
        };
        return acc;
      },
      {} as Record<string, { target: number; spent: number }>
    ),
  };

  const regionKey = userQuery.data?.region_code || "SEL";
  // region_code → regionalAverages 키 매핑
  const regionMap: Record<string, string> = {
    SEL: "seoul",
    GGI: "gyeonggi",
    ICN: "incheon",
    BSN: "busan",
    DGU: "daegu",
    DJN: "daejeon",
    GJU: "gwangju",
    ULS: "ulsan",
    SJG: "sejong",
  };
  const effectiveRegion = regionMap[regionKey] || "seoul";
  const regionalAverage = regionalAverages[effectiveRegion] || regionalAverages.seoul;

  // 총 예산 업데이트
  const updateTotalBudget = useMutation({
    mutationFn: async (newTotal: number) => {
      if (!user) throw new Error("로그인이 필요합니다");
      const { error } = await supabase
        .from("users")
        .update({ total_budget: newTotal })
        .eq("user_id", Number(user.id));
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
  });

  // 카테고리 예산 저장/수정
  const saveCategoryBudget = useMutation({
    mutationFn: async (budget: Partial<UserBudget> & { category: string }) => {
      if (!user) throw new Error("로그인이 필요합니다");

      const existing = budgets.find((b) => b.category === budget.category);

      if (existing) {
        const { error } = await supabase
          .from("user_budgets")
          .update({
            target_amount: budget.target_amount ?? existing.target_amount,
            spent_amount: budget.spent_amount ?? existing.spent_amount,
          })
          .eq("budget_id", existing.budget_id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_budgets").insert({
          user_id: Number(user.id),
          category: budget.category,
          target_amount: budget.target_amount ?? 0,
          spent_amount: budget.spent_amount ?? 0,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-budgets"] });
    },
  });

  return {
    budgets,
    summary,
    regionalAverage,
    isLoading: userQuery.isLoading || budgetsQuery.isLoading,
    updateTotalBudget,
    saveCategoryBudget,
  };
}
