/**
 * hooks/useInfluencers.ts
 *
 * TODO: ERD에 influencers 테이블이 없습니다.
 *       Contents 테이블을 활용하거나, 별도 테이블 추가가 필요합니다.
 *       현재는 contents 테이블(type 필터)로 대체합니다.
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Content } from "@/types/database";

export interface Influencer {
  id: number;
  name: string;
  handle: string;
  platform: string;
  profile_image_url: string | null;
  cover_image_url: string | null;
  bio: string | null;
  follower_count: number;
  category: string;
  tags: string[];
  external_url: string | null;
  is_featured: boolean;
}

export interface InfluencerContent extends Content {}

const categoryLabels: Record<string, string> = {
  all: "전체", wedding_planner: "웨딩플래너", dress: "드레스", makeup: "메이크업",
  photo: "촬영", honeymoon: "허니문", interior: "인테리어", general: "기타",
};

export const useCategoryLabels = () => categoryLabels;

export const useInfluencers = (_category?: string) => {
  const [influencers] = useState<Influencer[]>([]);
  const [featured] = useState<Influencer[]>([]);
  const [isLoading] = useState(false);
  // TODO: influencers 테이블 추가 후 구현
  return { influencers, featured, isLoading };
};

export const useInfluencerDetail = (_id: string | undefined) => {
  const [influencer] = useState<Influencer | null>(null);
  const [contents, setContents] = useState<InfluencerContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Contents 테이블에서 관련 콘텐츠 로드
    const fetch = async () => {
      try {
        const { data } = await supabase.from("contents").select("*").order("view_count", { ascending: false }).limit(10);
        setContents((data || []) as InfluencerContent[]);
      } catch (error) { console.error(error); }
      finally { setIsLoading(false); }
    };
    fetch();
  }, []);

  return { influencer, contents, isLoading };
};
