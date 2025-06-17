import type { Request, Response } from "express";
import { AppError } from "../../../error/AppError";
import { emitCommentUpdate, emitNotification } from "../../../shared/socket";
import {
  createNewComment,
  deleteCommentById,
  getCommentById,
  getCommentsByItemId,
  updateCommentById,
} from "./comment.service";
import { createCommentNotification, createNotification } from "../notification/notification.service";

export const getComments = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { itemId } = req.params;

  const comments = await getCommentsByItemId(itemId);

  // Transform comments to match frontend Comment interface
  const transformComments = (comments: any[]): any[] => {
    return comments.map((comment) => ({
      id: comment.id,
      userId: comment.userId,
      username: comment.user.username,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      replies: comment.replies ? transformComments(comment.replies) : [],
    }));
  };

  const transformedComments = transformComments(comments);

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { comments: transformedComments },
    message: "Comments retrieved successfully",
  });
};

export const createComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { itemId } = req.params;
  const { content, parentId } = req.body;
  const userId = (req as any).user.id;
  const username = (req as any).user.username;

  console.log("🔥 Creating comment:", {
    itemId,
    content,
    parentId,
    userId,
    username,
  });

  const comment = await createNewComment({
    content,
    userId,
    itemId,
    parentId: parentId || null,
  });

  console.log("✅ Comment created:", comment.id);

  // Transform to match frontend expectations
  const transformedComment = {
    id: comment.id,
    userId: comment.userId,
    username: username,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    replies: [],
  };

  // Emit real-time comment update
  emitCommentUpdate("comment_created", {
    itemId,
    comment: transformedComment,
  });

  // Create and emit notification properly
  try {
    let notificationReceiverId = null;

    if (parentId) {
      // This is a reply - notify the parent comment author
      console.log("🔔 Creating reply notification for parent:", parentId);

      const parentComment = await getCommentById(parentId);
      if (parentComment && parentComment.userId !== userId) {
        notificationReceiverId = parentComment.userId;
        console.log("📧 Reply notification receiver:", notificationReceiverId);

        // Create notification
        const notification = await createNotification({
          type: "COMMENT_REPLY",
          title: "New reply to your comment",
          message: `${username} replied to your comment: "${content.slice(
            0,
            50
          )}${content.length > 50 ? "..." : ""}"`,
          senderId: userId,
          receiverId: parentComment.userId,
          itemId,
          commentId: comment.id,
          metadata: {
            commentContent: content.slice(0, 100),
            parentCommentContent: parentComment.content.slice(0, 100),
          },
        });

        console.log("✅ Reply notification created:", notification.id);

        // Emit real-time notification
        emitNotification(parentComment.userId, {
          id: notification.id,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          createdAt: notification.createdAt.toISOString(),
          sender: { id: userId, username },
          item: { id: itemId },
          comment: { id: comment.id, content: comment.content },
        });

        console.log(
          "📡 Reply notification emitted to user:",
          parentComment.userId
        );
      }
    } else {
      // This is a new comment - we could notify item followers here
      // For now, let's skip this since we don't have item ownership tracking
      console.log("💬 New comment created (no notification for now)");
    }
  } catch (error) {
    console.error("❌ Failed to create/emit notification:", error);
  }

  res.status(201).json({
    success: true,
    statusCode: 201,
    data: { comment: transformedComment },
    message: "Comment created successfully",
  });
};

export const updateComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = (req as any).user.id;
  const username = (req as any).user.username;

  // Check if comment exists and belongs to user
  const existingComment = await getCommentById(id);
  if (!existingComment) {
    throw new AppError("Comment not found", 404);
  }

  if (existingComment.userId !== userId) {
    throw new AppError("Unauthorized to update this comment", 403);
  }

  const comment = await updateCommentById(id, { content });

  const transformedComment = {
    id: comment!.id,
    userId: comment!.userId,
    username: username,
    content: comment!.content,
    createdAt: comment!.createdAt.toISOString(),
    replies: [],
  };

  // Emit real-time update
  emitCommentUpdate("comment_updated", {
    itemId: existingComment.itemId,
    comment: transformedComment,
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { comment: transformedComment },
    message: "Comment updated successfully",
  });
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  // Check if comment exists and belongs to user
  const existingComment = await getCommentById(id);
  if (!existingComment) {
    throw new AppError("Comment not found", 404);
  }

  if (existingComment.userId !== userId) {
    throw new AppError("Unauthorized to delete this comment", 403);
  }

  await deleteCommentById(id);

  // Emit real-time update
  emitCommentUpdate("comment_deleted", {
    itemId: existingComment.itemId,
    commentId: id,
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: null,
    message: "Comment deleted successfully",
  });
};
