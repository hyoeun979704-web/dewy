/**
 * hooks/useCoupleDiary.ts
 * ERD: diaries (diary_id, user_id, title, content, diary_date, mood)
 *      images (ref_type='DIARY', ref_id=diary_id)  -- 사진 저장
 *
 * NOTE: ERD에 couple_links 테이블이 없으므로, 다이어리는 단순히
 *       현재 사용자 기준으로 조회/작성합니다.
 *       커플 연결 기능은 ERD 확장 후 추가 필요 (TODO: 명세 필요).
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Diary, ImageRecord } from "@/types/database";

export interface DiaryEntry extends Diary {
  images: ImageRecord[];
  is_mine: boolean;
}

export const useCoupleDiary = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    if (!user) { setIsLoading(false); return; }
    try {
      const userId = Number(user.id);
      const { data, error } = await supabase
        .from("diaries")
        .select("*")
        .eq("user_id", userId)
        .order("diary_date", { ascending: false });
      if (error) throw error;

      // 각 다이어리의 이미지 로드
      const diaryIds = (data || []).map((d: any) => d.diary_id);
      let imagesMap: Record<number, ImageRecord[]> = {};
      if (diaryIds.length > 0) {
        const { data: imgs } = await supabase
          .from("images")
          .select("*")
          .eq("ref_type", "DIARY" as any)
          .in("ref_id", diaryIds)
          .order("sort_order", { ascending: true });
        (imgs || []).forEach((img: any) => {
          if (!imagesMap[img.ref_id]) imagesMap[img.ref_id] = [];
          imagesMap[img.ref_id].push(img as ImageRecord);
        });
      }

      const enriched: DiaryEntry[] = (data || []).map((d: any) => ({
        ...d,
        images: imagesMap[d.diary_id] || [],
        is_mine: d.user_id === userId,
      }));
      setEntries(enriched);
    } catch (error) { console.error("Error fetching diary:", error); }
    finally { setIsLoading(false); }
  }, [user]);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  const createEntry = async (title: string, content: string, diaryDate: string, mood?: string): Promise<boolean> => {
    if (!user) { toast.error("로그인이 필요합니다"); return false; }
    try {
      const { error } = await supabase.from("diaries").insert({
        user_id: Number(user.id), title, content, diary_date: diaryDate, mood: mood || null,
      });
      if (error) throw error;
      toast.success("일기가 저장되었습니다 📝");
      await fetchEntries();
      return true;
    } catch (error) { console.error(error); toast.error("일기 저장에 실패했습니다"); return false; }
  };

  const deleteEntry = async (diaryId: number): Promise<boolean> => {
    if (!user) return false;
    try {
      await supabase.from("diaries").delete().eq("diary_id", diaryId).eq("user_id", Number(user.id));
      setEntries((prev) => prev.filter((e) => e.diary_id !== diaryId));
      toast.success("일기가 삭제되었습니다");
      return true;
    } catch (error) { console.error(error); toast.error("삭제에 실패했습니다"); return false; }
  };

  return { entries, isLoading, createEntry, deleteEntry, refetch: fetchEntries };
};
