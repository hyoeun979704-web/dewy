import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type DewyService = "invitation" | "photoshoot" | "video" | "speech";

interface DewyOptions {
  style?: string;
  format?: string;
  duration?: number;
  [key: string]: unknown;
}

interface DewyResponse {
  success: boolean;
  data?: {
    id: string;
    content?: string;
    imageUrl?: string;
    videoUrl?: string;
    status?: string;
  };
  error?: string;
}

/** AI 프롬프트 최대 길이. 초과 시 Edge Function 비용 폭증 및 타임아웃 유발 방지 */
const MAX_PROMPT_LENGTH = 2000;

export const useDewyStudio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DewyResponse | null>(null);
  const { toast } = useToast();

  const generate = async (
    service: DewyService,
    prompt: string,
    options?: DewyOptions
  ): Promise<DewyResponse | null> => {
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      toast({ title: "입력 필요", description: "내용을 입력해 주세요.", variant: "destructive" });
      return null;
    }

    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      toast({
        title: "입력 초과",
        description: `최대 ${MAX_PROMPT_LENGTH}자까지 입력 가능합니다.`,
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("dewy-studio", {
        body: { service, prompt: trimmedPrompt, options },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        toast({
          title: "생성 실패",
          description: data.error,
          variant: "destructive",
        });
        return { success: false, error: data.error };
      }

      const response: DewyResponse = {
        success: true,
        data: data,
      };

      setResult(response);
      toast({
        title: "생성 완료",
        description: "콘텐츠가 성공적으로 생성되었습니다.",
      });

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      toast({
        title: "오류 발생",
        description: message,
        variant: "destructive",
      });
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const generateInvitation = (prompt: string, options?: DewyOptions) =>
    generate("invitation", prompt, options);

  const generatePhotoshoot = (prompt: string, options?: DewyOptions) =>
    generate("photoshoot", prompt, options);

  const generateVideo = (prompt: string, options?: DewyOptions) =>
    generate("video", prompt, options);

  const generateSpeech = (prompt: string, options?: DewyOptions) =>
    generate("speech", prompt, options);

  return {
    isLoading,
    result,
    generate,
    generateInvitation,
    generatePhotoshoot,
    generateVideo,
    generateSpeech,
  };
};
