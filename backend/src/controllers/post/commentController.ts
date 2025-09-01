import { NextFunction, Request, Response } from "express";
import { CommentService } from "../../services/post/commentService";


export class CommentController {
    constructor(private commentService : CommentService) {}
    
    public async getComments(req : Request , res : Response , next : NextFunction) {
        try{
            const { page , limit } = req.validatedQuery
            const input = {
                author_id : req.user.id,
                post_id : req.validatedParams.post_id,
                page ,
                limit
            }
            const comments = await this.commentService.getComments(input)
            return res.status(200).json(comments)
        }catch(error){next(error)}
    }
    public async createComment(req: Request , res: Response , next: NextFunction) {
        try{
            const input = {
                ...req.validatedBody,
                author_id : req.user.id,
                post_id : req.validatedParams.post_id
            }
            const comment = await this.commentService.createComment(input)
            return res.status(201).json(comment)
        }catch(error){next(error)}
    }
    public updateComment() {}
    public deleteComment() {}
}