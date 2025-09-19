import prisma from "../../prisma/prismaClient";
import { LikeDTO } from "../../types/post";

export class LikeRepository {
  async countLike(data: LikeDTO) {
    const { author_id, post_id, comment_id } = data;

    const likes = await prisma.like.findMany({
      where: {
        author_id: author_id,
        post_id: post_id,
        comment_id: comment_id,
      },
      select: {
        author: {
          select: {
            username: true,
          },
        },
      },
    });

    return {
      count: likes.length,
      likes,
    };
  }

  async toggleLike(data: LikeDTO) {
    const { author_id, post_id, comment_id } = data;

    let condition;
    let createData;

    if (post_id) {
      condition = { author_id, post_id };
      createData = { author_id, post_id };
    } else if (comment_id) {
      condition = { author_id, comment_id };
      createData = { author_id, comment_id };
    } else {
      throw new Error("Either post_id or comment_id must be provided");
    }

    const existingLike = await prisma.like.findFirst({
      where: condition,
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      const likeData = await this.countLike(data);
      return { isLiked: false, likesCount: likeData.count , likes : likeData.likes};
    } else {
      await prisma.like.create({ data: createData });
      const likeData = await this.countLike(data);
      return { isLiked: true, likesCount: likeData.count , likes : likeData.likes };
    }
  }
}
