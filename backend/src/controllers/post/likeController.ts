import { Request, NextFunction, Response } from "express";
import { LikeService } from "../../services/post/likeService";

export class LikeController {
    constructor(private likeService : LikeService) {}

    private async handleLikeAction(req : Request , res : Response , next : NextFunction ,action: 'get' | 'create' ) {
        try{
            const { post_id , comment_id } = req.validatedParams
            const user_id = req.user.id;
            const input = {
                author_id : user_id,
                post_id,
                comment_id
            }

            let result 
            if(action === 'get') result = await this.likeService.getLikes(input)
            else if(action === 'create') result = await this.likeService.toggleLike(input)
            else return res.status(400).json({ message : 'Invalid action' })

            return res.status(200).json(result)
        }catch(error){
            next(error)
        }
    }

   public getPostLikes(req: Request, res: Response, next: NextFunction) {
        return this.handleLikeAction(req, res, next, 'get');
    }

    public getCommentLikes(req: Request, res: Response, next: NextFunction) {
        return this.handleLikeAction(req, res, next, 'get');
    }

    public likePost(req: Request, res: Response, next: NextFunction) {
        return this.handleLikeAction(req, res, next, 'create');
    }

    public likeComment(req: Request, res: Response, next: NextFunction) {
        return this.handleLikeAction(req, res, next, 'create');
    }
}