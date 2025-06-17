import prisma from "../../db/prisma"

export const toggleUserVote = async (userId: string, itemId: string   ) => {
  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
  })

  if (existingVote) {
    // Remove vote
    await prisma.vote.delete({
      where: { id: existingVote.id },
    })

    const voteCount = await getVoteCount(itemId)
    return {
      action: "removed",
      voteCount,
    }
  } else {
    // Add vote
    await prisma.vote.create({
      data: {
        userId,
        itemId,
      },
    })

    const voteCount = await getVoteCount(itemId)
    return {
      action: "added",
      voteCount,
    }
  }
}

export const hasUserVoted = async (userId: string, itemId: string): Promise<boolean> => {
  const vote = await prisma.vote.findUnique({
    where: {
      userId_itemId: {
        userId,
        itemId,
      },
    },
  })     

  return !!vote
}

export const getVoteCount = async (itemId: string): Promise<number> => {
  return await prisma.vote.count({
    where: { itemId },
  })
}

export const getUserVotes = async (userId: string) => {
  return await prisma.vote.findMany({
    where: { userId },
    include: {
      item: {
        select: {
          id: true,
          title: true,
          status: true,
        },
      },
    },
  })
}
