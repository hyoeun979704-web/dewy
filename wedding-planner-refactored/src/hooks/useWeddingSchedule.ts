/**
 * hooks/useWeddingSchedule.ts
 * ERD: schedules + users.wedding_date
 */
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Schedule } from "@/types/database";

export type ScheduleItem = Schedule;

interface WeddingSettings {
  wedding_date: string | null;
  name: string | null;
  region_code: string | null;
}

export const useWeddingSchedule = () => {
  const { user } = useAuth();
  const [weddingSettings, setWeddingSettings] = useState<WeddingSettings>({ wedding_date: null, name: null, region_code: null });
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) { setIsLoading(false); return; }
    try {
      const userId = Number(user.id);
      const [userRes, itemsRes] = await Promise.all([
        supabase.from("users").select("wedding_date, name, region_code").eq("user_id", userId).maybeSingle(),
        supabase.from("schedules").select("*").eq("user_id", userId).order("scheduled_date", { ascending: true }),
      ]);
      if (userRes.data) setWeddingSettings({ wedding_date: userRes.data.wedding_date, name: userRes.data.name, region_code: userRes.data.region_code });
      if (itemsRes.data) setScheduleItems(itemsRes.data as ScheduleItem[]);
    } catch (error) { console.error("Error fetching wedding schedule:", error); }
    finally { setIsLoading(false); }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveWeddingDate = async (date: string) => {
    if (!user) { toast.error("로그인이 필요합니다"); return false; }
    try {
      const { error } = await supabase.from("users").update({ wedding_date: date }).eq("user_id", Number(user.id));
      if (error) throw error;
      setWeddingSettings((prev) => ({ ...prev, wedding_date: date }));
      toast.success("결혼식 날짜가 저장되었습니다");
      return true;
    } catch (error) { console.error(error); toast.error("저장에 실패했습니다"); return false; }
  };

  const addScheduleItem = async (title: string, scheduledDate: string, category = "기타") => {
    if (!user) { toast.error("로그인이 필요합니다"); return false; }
    try {
      const { data, error } = await supabase.from("schedules").insert({ user_id: Number(user.id), title, scheduled_date: scheduledDate, category, status: "예정" }).select("*").single();
      if (error) throw error;
      setScheduleItems((prev) => [...prev, data as ScheduleItem].sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()));
      toast.success("일정이 추가되었습니다");
      return true;
    } catch (error) { console.error(error); toast.error("일정 추가에 실패했습니다"); return false; }
  };

  const toggleItemCompletion = async (scheduleId: number) => {
    const item = scheduleItems.find((i) => i.schedule_id === scheduleId);
    if (!item) return;
    const newStatus = item.status === "완료" ? "예정" : "완료";
    try {
      await supabase.from("schedules").update({ status: newStatus }).eq("schedule_id", scheduleId);
      setScheduleItems((prev) => prev.map((i) => i.schedule_id === scheduleId ? { ...i, status: newStatus } : i));
    } catch (error) { console.error(error); toast.error("업데이트에 실패했습니다"); }
  };

  const deleteScheduleItem = async (scheduleId: number) => {
    try {
      await supabase.from("schedules").delete().eq("schedule_id", scheduleId);
      setScheduleItems((prev) => prev.filter((i) => i.schedule_id !== scheduleId));
      toast.success("일정이 삭제되었습니다");
    } catch (error) { console.error(error); toast.error("삭제에 실패했습니다"); }
  };

  const updateItemNotes = async (scheduleId: number, memo: string) => {
    try {
      await supabase.from("schedules").update({ memo }).eq("schedule_id", scheduleId);
      setScheduleItems((prev) => prev.map((i) => i.schedule_id === scheduleId ? { ...i, memo } : i));
      toast.success("메모가 저장되었습니다");
    } catch (error) { console.error(error); toast.error("메모 저장에 실패했습니다"); }
  };

  const updateScheduleItem = async (scheduleId: number, updates: { title?: string; scheduled_date?: string; category?: string }) => {
    try {
      const { error } = await supabase.from("schedules").update(updates).eq("schedule_id", scheduleId);
      if (error) throw error;
      setScheduleItems((prev) => prev.map((i) => i.schedule_id === scheduleId ? { ...i, ...updates } : i).sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()));
      toast.success("일정이 수정되었습니다");
      return true;
    } catch (error) { console.error(error); toast.error("수정에 실패했습니다"); return false; }
  };

  return { weddingSettings, scheduleItems, isLoading, saveWeddingDate, addScheduleItem, toggleItemCompletion, deleteScheduleItem, updateItemNotes, updateScheduleItem };
};
