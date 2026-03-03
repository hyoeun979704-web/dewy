/**
 * hooks/useDefaultRegion.ts
 * ERD: users.region_code
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useDefaultRegion = () => {
  const { dbUserId } = useAuth();

  return useQuery({
    queryKey: ["default-region", dbUserId],
    queryFn: async () => {
      if (!dbUserId) return null;
      const { data, error } = await supabase
        .from("users")
        .select("region_code")
        .eq("user_id", dbUserId)
        .maybeSingle();
      if (error) throw error;
      return data?.region_code || null;
    },
    enabled: !!dbUserId,
    // region_code는 거의 변하지 않으므로 10분 캐시
    staleTime: 1000 * 60 * 10,
  });
};
