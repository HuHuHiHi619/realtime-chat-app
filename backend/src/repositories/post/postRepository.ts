import { CreatePostRepoDTO, GetPostRepoDTO } from "../../types/post";
import prisma from "../../prisma/prismaClient";

export class PostRepository {
  async countPost(author_id: number) {
    return await prisma.post.count({
      where: { author_id },
    });
  }

  async findPosts(data: GetPostRepoDTO) {
    const { author_id, take, skip } = data;
    return await prisma.post.findMany({
      where: { author_id },
      select: {
        id: true,
        content: true,
        author_id: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: { created_at: "asc" },
      take,
      skip,
    });
  }

  async createPost({ author_id, content }: CreatePostRepoDTO) {
    return await prisma.post.create({
      data: {
        author_id,
        content,
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
