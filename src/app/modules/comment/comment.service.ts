import type { Comment } from "@prisma/client";
import prisma from "../../db/prisma";
import {
  CreateCommentData,
  UpdateCommentData,
} from "../comment/comment.interface";
import { createCommentNotification } from "../notification/notification.service";

export const getCommentsByItemId = async (itemId: string) => {
  return await prisma.comment.findMany({
    where: {
      itemId,
      parentId: null, // Only get top-level comments
    },
    include: {
      user: {
        select: { id: true, username: true, avatar: true },
      },
      replies: {
        include: {
          user: {
            select: { id: true, username: true, avatar: true },
          },
          replies: {
            include: {
              user: {
                select: { id: true, username: true, avatar: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getCommentCountByItemId = async (
  itemId: string
): Promise<number> => {
  return await prisma.comment.count({
    where: { itemId },
  });
};

//  Just create comment, handle notifications in controller
export const createNewComment = async (data: CreateCommentData): Promise<Comment> => {
  return await prisma.comment.create({
    data,
    include: {
      user: {
        select: { id: true, username: true, avatar: true },
      },
    },
  })
}

export const updateCommentById = async (
  id: string,
  data: UpdateCommentData
): Promise<Comment | null> => {
  try {
    return await prisma.comment.update({
      where: { id },
      data,
      include: {
        user: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });
  } catch (error) {
    return null;
  }
};

export const deleteCommentById = async (id: string): Promise<void> => {
  await prisma.comment.delete({
    where: { id },
  });
};

export const getCommentById = async (id: string): Promise<Comment | null> => {
  return await prisma.comment.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, username: true, avatar: true },
      },
    },
  });
};
