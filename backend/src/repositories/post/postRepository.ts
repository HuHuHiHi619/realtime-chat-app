import {
  CreatePostRepoDTO,
  GetPostRepoDTO,
  GetSinglePostServiceDTO,
} from "../../types/post";
import prisma from "../../prisma/prismaClient";

export class PostRepository {
  async countPost(author_id: number) {
    return await prisma.post.count({
      where: { author_id },
    });
  }

  async findSinglePost(data: GetSinglePostServiceDTO) {
    const { author_id, post_id } = data;
    const post = await prisma.post.findUnique({
      where: { id: post_id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            display_name: true,
            avatar_url: true,
          },
        },
        medias: true,
        likes: {
          include: {
            author: { select: { id: true, username: true } },
          },
        },
        comments: {
          include: {
            author: { select: { id: true, username: true, avatar_url: true } },
            likes: {
              include: { author: { select: { id: true, username: true } } },
            },
            replies: {
              include: {
                author: {
                  select: { id: true, username: true, avatar_url: true },
                },
                likes: {
                  include: { author: { select: { id: true, username: true } } },
                },
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return post;
  }

  async findPosts(data: GetPostRepoDTO) {
    const { author_id, take, skip } = data;
    return await prisma.post.findMany({
      where: { author_id },
      select: {
        id: true,
        content: true,
        author: {
          select: {
            id: true,
            username: true,
            display_name: true,
            avatar_url: true,
          },
        },
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            likes: true,
            comments: true,
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
              }
            }
          },
        },
      },
      orderBy: { created_at: "desc" },
      take,
      skip,
    });
}

  async findDeletePost(data: any) {
    const { post_id, author_id } = data;
    return await prisma.post.findUnique({ where: { id: post_id, author_id } });
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

  async deletePost(post_id: number) {
    return await prisma.post.delete({
      where: { id: post_id },
    });
  }
}
