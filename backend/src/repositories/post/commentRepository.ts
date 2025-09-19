import prisma from "../../prisma/prismaClient";
import {
  CreateCommentRepoDTO,
  GetCommentRepoDTO,
  GetCommentServiceDTO,
} from "../../types/comment";

export class CommentRepository {
  async countComment(author_id: number , parent_id?: number) {
    return await prisma.comment.count({
      where: { author_id , parent_id : parent_id ?? null },
    });
  }
  async findComments(data: GetCommentRepoDTO) {
    const { author_id, post_id, parent_id , skip, take } = data;
    return await prisma.comment.findMany({
      where: { author_id, post_id , parent_id : parent_id ?? null },
      select: {
        id: true,
        content: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            likes: true,
            replies: true,
          },
        },
        likes: {
          select: {
            id: true,
            author_id: true,
            author: {
              select: {
                id: true,
                username: true,
                display_name: true,
                avatar_url: true,
              },
            },
          },
        },
      },

      orderBy: { created_at: "desc" },
      skip,
      take,
    });
  }

  async createComment(data: CreateCommentRepoDTO) {
    const { author_id, post_id, parent_id , content } = data;
    return await prisma.comment.create({
      data: {
        author_id: author_id,
        post_id: post_id,
        parent_id : parent_id ?? null,
        content: content,
      },
      select: {
        id: true,
        author_id: true,
        content: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
}
