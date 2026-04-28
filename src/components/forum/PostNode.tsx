"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MemberImage } from "@/components/MemberImage";
import { MessageCircle, Flag, ChevronDown, ChevronRight } from "lucide-react";
import VoteButton from "./VoteButton";
import ReplyComposer from "./ReplyComposer";
import ReportModal from "./ReportModal";
import { useForumVotesForPost } from "@/hooks/forum/useForumVotes";

export interface ForumPost {
  id: string;
  thread_id: string;
  author_id: string;
  parent_post_id: string | null;
  content: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  deleted_by: string | null;
  depth: number;
  reply_count: number;
  like_count: number;
  dislike_count: number;
  profiles?: {
    id: string;
    username: string;
    nickname: string | null;
    avatar_url: string | null;
    role: string;
  };
  myVote?: 1 | -1 | null;
  replies?: ForumPost[];
}

interface PostNodeProps {
  post: ForumPost;
  depth: number;
  threadId: string;
  isLocked: boolean;
  currentUserId: string | null;
  currentUserRole: string | null;
  onReply?: () => void;
  isFirst?: boolean;
}

export default function PostNode({
  post,
  depth,
  threadId,
  isLocked,
  currentUserId,
  currentUserRole,
  onReply,
  isFirst = false,
}: PostNodeProps) {
  const [showReplyComposer, setShowReplyComposer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const isOwner = currentUserId === post.author_id;
  const isAdmin = currentUserRole === "admin" || currentUserRole === "manager";
  const isDeleted = !!post.deleted_at;

  const votes = useForumVotesForPost(post.id, {
    myVote: post.myVote ?? null,
    likeCount: post.like_count,
    dislikeCount: post.dislike_count,
  });

  const replies = post.replies || [];
  const hasReplies = replies.length > 0;

  // Indentation visuelle (responsive)
  const indentClass =
    depth === 0
      ? ""
      : depth === 1
      ? "ml-4 md:ml-10 pl-4 md:pl-6 border-l-2 border-or-ancestral/15"
      : "ml-3 md:ml-6 pl-3 md:pl-5 border-l border-or-ancestral/10";

  // Avatar size
  const avatarSize =
    depth === 0
      ? "w-12 h-12"
      : depth === 1
      ? "w-10 h-10"
      : "w-8 h-8";

  const cardClass = isFirst
    ? "border-or-ancestral/40 bg-or-ancestral/[0.04]"
    : isDeleted
    ? "border-white/5 bg-white/[0.01] opacity-60"
    : "border-white/10 bg-white/[0.03] hover:border-or-ancestral/30";

  const displayName =
    post.profiles?.nickname || post.profiles?.username || "Villageois Anonyme";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={indentClass}
    >
      <div
        className={`relative rounded-2xl border ${cardClass} backdrop-blur-md p-4 md:p-5 mb-3 transition-all`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`${avatarSize} rounded-full overflow-hidden border border-or-ancestral/30 shrink-0`}
          >
            <MemberImage profile={post.profiles || {}} priority={false} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-ivoire-ancien font-medium text-sm">
                {displayName}
              </h4>
              {["admin", "manager"].includes(post.profiles?.role || "") && (
                <span className="text-[9px] uppercase tracking-widest bg-or-ancestral/20 text-or-ancestral px-1.5 py-0.5 rounded-full">
                  {post.profiles?.role}
                </span>
              )}
              {isFirst && (
                <span className="text-[9px] uppercase tracking-widest bg-or-ancestral/15 text-or-ancestral px-1.5 py-0.5 rounded-full">
                  Auteur du sujet
                </span>
              )}
              {post.edited_at && (
                <span className="text-[10px] text-ivoire-ancien/30 italic">
                  modifié
                </span>
              )}
            </div>
            <span className="text-[11px] text-ivoire-ancien/40">
              {new Date(post.created_at).toLocaleString("fr-FR", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          {/* Collapse toggle when replies present */}
          {hasReplies && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="p-1 rounded-full hover:bg-white/5 text-ivoire-ancien/40"
              title={collapsed ? "Déplier" : "Replier"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Body */}
        {isDeleted ? (
          <p className="text-sm text-ivoire-ancien/40 italic px-1">
            [Message supprimé{" "}
            {post.deleted_by === post.author_id
              ? "par l'auteur"
              : "par un modérateur"}
            ]
          </p>
        ) : (
          <div className="prose prose-invert prose-p:text-ivoire-ancien/85 prose-p:leading-relaxed prose-p:my-2 prose-headings:text-ivoire-ancien prose-a:text-or-ancestral prose-strong:text-or-ancestral prose-code:text-or-ancestral max-w-none text-[15px]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                img: ({ ...props }) => (
                  // GIFs et images intégrées
                  <img
                    {...props}
                    className="rounded-xl max-h-72 w-auto inline-block"
                    loading="lazy"
                    alt={props.alt || "image"}
                  />
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        )}

        {/* Actions */}
        {!isDeleted && (
          <div className="flex items-center gap-1 mt-3 pt-2 border-t border-white/5">
            <VoteButton
              type="like"
              active={votes.myVote === 1}
              count={votes.likeCount}
              onToggle={votes.toggleLike}
              disabled={!currentUserId}
            />
            <VoteButton
              type="dislike"
              active={votes.myVote === -1}
              count={votes.dislikeCount}
              onToggle={votes.toggleDislike}
              privateCount
              canSeeCount={isOwner || isAdmin}
              disabled={!currentUserId}
            />
            {!isLocked && currentUserId && depth < 3 && (
              <button
                onClick={() => setShowReplyComposer((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-ivoire-ancien/40 hover:text-or-ancestral transition-colors text-xs"
                title="Répondre"
              >
                <MessageCircle className="w-4 h-4" />
                Répondre
              </button>
            )}
            {currentUserId && !isOwner && (
              <button
                onClick={() => setReportOpen(true)}
                className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-ivoire-ancien/30 hover:text-amber-400 transition-colors text-xs"
                title="Signaler"
              >
                <Flag className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Reply composer inline */}
        <AnimatePresence>
          {showReplyComposer && currentUserId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 overflow-hidden"
            >
              <ReplyComposer
                threadId={threadId}
                parentPostId={post.id}
                authorId={currentUserId}
                onSubmitted={() => {
                  setShowReplyComposer(false);
                  onReply?.();
                }}
                onCancel={() => setShowReplyComposer(false)}
                autoFocus
                compact
              />
            </motion.div>
          )}
        </AnimatePresence>

        <ReportModal
          open={reportOpen}
          postId={post.id}
          onClose={() => setReportOpen(false)}
        />
      </div>

      {/* Replies récursives */}
      {hasReplies && !collapsed && (
        <div className="space-y-2 mb-3">
          {replies.map((reply) => (
            <PostNode
              key={reply.id}
              post={reply}
              depth={depth + 1}
              threadId={threadId}
              isLocked={isLocked}
              currentUserId={currentUserId}
              currentUserRole={currentUserRole}
              onReply={onReply}
            />
          ))}
        </div>
      )}

      {hasReplies && collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="ml-4 md:ml-10 text-xs text-or-ancestral/70 hover:text-or-ancestral transition-colors mb-3"
        >
          ▸ Voir {replies.length} réponse{replies.length > 1 ? "s" : ""}
        </button>
      )}
    </motion.div>
  );
}
