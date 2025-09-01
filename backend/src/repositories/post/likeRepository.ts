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

  async createLike(data: LikeDTO) {
    const { author_id, post_id, comment_id } = data;
    return await prisma.like.create({
      data: {
        author_id: author_id,
        post_id: post_id,
        comment_id: comment_id,
      },
      select: {
        id: true,
        author_id: true,
        created_at: true,
        updated_at: true,
      },
    });
  }

  async deleteLike(data: LikeDTO) {
    const { author_id, post_id, comment_id } = data;
    if (post_id) {
      return await prisma.like.delete({
        where: {
          author_id_post_id: {
            author_id: author_id,
            post_id: post_id,
          },
        },
      });
    }

    if (comment_id) {
      return await prisma.like.delete({
        where: {
          author_id_comment_id: {
            author_id: author_id,
            comment_id: comment_id,
          },
        },
      });
    }
  }
}
