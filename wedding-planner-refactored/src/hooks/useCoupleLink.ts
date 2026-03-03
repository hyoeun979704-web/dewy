/**
 * hooks/useCoupleLink.ts
 *
 * TODO: ERD에 couple_links 테이블이 없습니다.
 *       커플 연결 기능을 위해 별도 테이블 추가가 필요합니다.
 *       현재는 기존 인터페이스를 유지하되, 실제 DB 호출은 비활성화합니다.
 */
import { useState } from "react";
import { toast } from "sonner";

interface CoupleLink {
  id: string;
  user_id: string;
  partner_user_id: string | null;
  invite_code: string;
  status: "pending" | "linked" | "unlinked";
  linked_at: string | null;
}

interface PartnerProfile {
  display_name: string | null;
  email: string | null;
}

export const useCoupleLink = () => {
  const [coupleLink] = useState<CoupleLink | null>(null);
  const [partnerProfile] = useState<PartnerProfile | null>(null);
  const [isLoading] = useState(false);

  const generateInviteCode = async (): Promise<string | null> => {
    // TODO: couple_links 테이블 추가 후 구현
    toast.info("커플 연결 기능은 준비 중입니다");
    return null;
  };

  const linkWithCode = async (_code: string): Promise<boolean> => {
    toast.info("커플 연결 기능은 준비 중입니다");
    return false;
  };

  const unlinkCouple = async (): Promise<boolean> => {
    return false;
  };

  const isLinked = coupleLink?.status === "linked";

  return {
    coupleLink,
    partnerProfile,
    isLinked,
    isLoading,
    generateInviteCode,
    linkWithCode,
    unlinkCouple,
    refetch: async () => {},
  };
};
