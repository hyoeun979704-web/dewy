/**
 * hooks/useDefaultRegion.ts
 * ERD: users.region_code
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useDefaultRegion = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["default-region", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("users")
        .select("region_code")
        .eq("user_id", Number(user.id))
        .maybeSingle();
      if (error) throw error;
      return data?.region_code || null;
    },
    enabled: !!user,
  });
};
