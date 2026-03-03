/**
 * hooks/useCommentLikes.ts
 * TODO: ERD에 community_comments / comment_likes 테이블이 없습니다.
 */
import { useState } from "react";
import { toast } from "sonner";

export const useCommentLikes = () => {
  const [likedComments] = useState<Set<string>>(new Set());
  const toggleLike = async (_commentId: string) => {
    toast.info("댓글 좋아요 기능은 준비 중입니다");
  };
  const isLiked = (_commentId: string) => false;
  const getLikeCount = (_commentId: string) => 0;
  return { likedComments, toggleLike, isLiked, getLikeCount };
};
