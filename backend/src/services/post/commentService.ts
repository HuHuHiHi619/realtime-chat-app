import { CommentRepository } from "../../repositories/post/commentRepository";
import {
  CreateCommentServiceDTO,
  GetCommentServiceDTO,
} from "../../types/comment";

export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async getComments(data: GetCommentServiceDTO) {
    const { author_id, post_id, page, limit, comment_id } = data;
    const parent_id = comment_id ?? null;
    const totalItems = await this.commentRepository.countComment(author_id , parent_id);
    const skip = (page - 1) * limit;
    const hasMore = page * limit < totalItems;

    const items = await this.commentRepository.findComments({
      author_id,
      post_id,
      parent_id,
      skip,
      take: limit,
    });
    if (parent_id) {
      // เป็น replies
      return {
        pagination: {
          page,
          limit,
          totalReplies: totalItems,
          hasMore,
        },
        replies: items, // ✅ key ชัดเจน
      };
    } else {
      // เป็น comment หลัก
      return {
        pagination: {
          page,
          limit,
          totalComments: totalItems,
          hasMore,
        },
        comments: items, // ✅ key ชัดเจน
      };
    }
  }

  async createComment(data: CreateCommentServiceDTO) {
    return await this.commentRepository.createComment(data);
  }
}
