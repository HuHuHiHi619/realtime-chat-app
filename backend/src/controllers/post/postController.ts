import { Request, Response, NextFunction } from "express";
import { PostService } from "../../services/post/postService";



export class PostController {
  constructor(private postService: PostService) {}

  public async getSinglePost(req: Request , res : Response , next : NextFunction){
    try{
      const user_id = req.user.id;
      const input = {
        author_id : user_id,
        post_id : req.validatedParams.post_id
      }
      const post = await this.postService.getSinglePost(input)
      return res.status(200).json(post)
    }catch(error){next(error)}
  }

  public async getPosts(req: Request, res: Response, next: NextFunction) {
    try {
 
      const { page , limit } = req.validatedQuery
      const user_id = req.user.id;
      const inputData  = {
        author_id : user_id,
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
      const user_id = req.user.id;
      const input = {
        ...req.validatedBody,
        author_id: user_id,
      };
      const post = await this.postService.createPost(input);

      return res.status(201).json({ post });
    } catch (error) {
      next(error);
    }
  }

  public async deletePost(req : Request , res : Response , next : NextFunction){
    try {
      const user_id = req.user.id;
      const input = {
       post_id : req.validatedParams.post_id, 
       author_id : user_id
      }
      await this.postService.deletePost(input);

      return res.status(201).json({ message : "Post deleted successfully"});
    } catch (error) {
      next(error);
    }
  }
}
