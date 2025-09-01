import { CommentRepository } from "../../repositories/post/commentRepository";
import { CreateCommentServiceDTO, GetCommentServiceDTO } from "../../types/comment";



export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async getComments(data: GetCommentServiceDTO) {
    const { author_id, post_id, page, limit } = data;
    const totalComments = await this.commentRepository.countComment(author_id);
    const skip = (page - 1) * limit;
    const hasMore = page * limit < totalComments;

    const comments = await this.commentRepository.findComments({
      author_id,
      post_id,
      skip,
      take : limit
    });
    return {
      pagination: {
        page,
        limit,
        totalComments: totalComments,
        hasMore,
      },
      comments,
    };
  }

  async createComment(data: CreateCommentServiceDTO) {
    return await this.commentRepository.createComment(data);
  }
}
