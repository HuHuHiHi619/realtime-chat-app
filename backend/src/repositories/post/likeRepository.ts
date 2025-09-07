import prisma from "../../prisma/prismaClient";
import { LikeDTO } from "../../types/post";

export class LikeRepository {
  async countLike(data: LikeDTO) {
    const { author_id, post_id, comment_id } = data;

    return await prisma.like.count({
      where: {
        author_id: author_id,
        post_id: post_id,
        comment_id: comment_id,
      },
    });
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
      return { isLiked: false, likesCount: await this.countLike(data) };
    } else {
      await prisma.like.create({ data: createData });
      return { isLiked: true, likesCount: await this.countLike(data) };
    }
  }
}
