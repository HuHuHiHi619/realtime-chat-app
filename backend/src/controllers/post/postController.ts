import { Request, Response, NextFunction } from "express";
import { PostService } from "../../services/post/postService";


export class PostController {
  constructor(private postService: PostService) {}

  public async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
 
      const { page , limit } = req.validatedQuery
      const inputData  = {
        author_id : req.user.id,
        page,
        limit
      }

      const posts = await this.postService.getPosts(inputData)

      return res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }

  public async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const input = {
        ...req.validatedBody,
        author_id: req.user.id,
      };
      const post = await this.postService.createPost(input);

      return res.status(201).json({ post });
    } catch (error) {
      next(error);
    }
  }
}
