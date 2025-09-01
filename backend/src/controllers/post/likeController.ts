import { Request, NextFunction, Response } from "express";
import { LikeService } from "../../services/post/likeService";

export class LikeController {
    constructor(private likeService : LikeService) {}

    public async getPostLikes(req : Request , res : Response , next : NextFunction) {
        try{
            const input = {
                author_id : req.user.id,
                post_id : req.validatedParams.post_id
            }
            const likes = await this.likeService.getLikes(input)
            return res.status(200).json(likes)
        }catch(error){next(error)}
    }
    
    public async getCommentLikes(req : Request , res : Response , next : NextFunction) {
        try{
            const input = {
                author_id : req.user.id,
                comment_id : req.validatedParams
            }
            const likes = await this.likeService.getLikes(input)
            return res.status(200).json(likes)
        }catch(error){next(error)}
    }

    public async likePost(req : Request , res: Response , next : NextFunction) {
        try{
            const input = {
                author_id : req.user.id,
                post_id : req.validatedParams.post_id
            }
            const like = await this.likeService.createLike(input)
            return res.status(200).json(like)
        }catch(error){next(error)}
    }

    public async unlikePost(req : Request , res: Response , next : NextFunction) {
        try{
            const input = {
                author_id : req.user.id,
                post_id : req.validatedParams
            }
            const like = await this.likeService.deleteLike(input)
            return res.status(200).json(like)
        }catch(error){next(error)}
    }
    
     public async likeComment(req : Request , res: Response , next : NextFunction) {
        try{
            const input = {
                author_id : req.user.id,
                comment_id : req.validatedParams.comment_id
            }
            const like = await this.likeService.createLike(input)
            return res.status(200).json(like)
        }catch(error){next(error)}
    }
    
     public async unlikeComment(req : Request , res: Response , next : NextFunction) {
        try{
            const input = {
                author_id : req.user.id,
                comment_id : req.validatedParams
            }
            const like = await this.likeService.deleteLike(input)
            return res.status(200).json(like)
        }catch(error){next(error)}
    }
    
}