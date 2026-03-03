/**
 * hooks/useSubscription.ts
 * TODO: ERD에 subscriptions 테이블이 없습니다. 별도 테이블 추가 필요.
 */
import { useAuth } from "@/contexts/AuthContext";

export interface SubscriptionInfo {
  plan: "free" | "premium";
  isActive: boolean;
  expiresAt: string | null;
}

export const useSubscription = (): SubscriptionInfo & { isLoading: boolean } => {
  const { user } = useAuth();
  return { plan: "free", isActive: false, expiresAt: null, isLoading: false };
};
