import type { Request, Response } from "express";
import { emitVoteUpdate } from "../../../shared/socket";
import { getVoteCount, hasUserVoted, toggleUserVote } from "./vote.service";

export const toggleVote = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { itemId } = req.params;
  const userId = (req as any).user.id;

  const result = await toggleUserVote(userId, itemId);

  // Emit real-time update
  emitVoteUpdate("vote_updated", {
    itemId,
    userId,
    action: result.action,
    voteCount: result.voteCount,
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: {
      action: result.action,
      voteCount: result.voteCount,
      hasVoted: result.action === "added",
    },
    message:
      result.action === "added"
        ? "Vote added successfully"
        : "Vote removed successfully",
  });
};

export const getVoteStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { itemId } = req.params;
  const userId = (req as any).user.id;

  const hasVoted = await hasUserVoted(userId, itemId);
  const voteCount = await getVoteCount(itemId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { hasVoted, voteCount },
    message: "Vote status retrieved successfully",
  });
};

export const getItemVotes = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { itemId } = req.params;

  const voteCount = await getVoteCount(itemId);

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: { voteCount },
    message: "Vote count retrieved successfully",
  });
};
