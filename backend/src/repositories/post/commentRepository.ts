import prisma from "../../prisma/prismaClient";
import { CreateCommentRepoDTO, GetCommentRepoDTO, GetCommentServiceDTO } from "../../types/comment";


export class CommentRepository {
    async countComment(author_id : number){
        return await prisma.comment.count({
            where : { author_id }
        })
    }
    async findComments(data : GetCommentRepoDTO){
        const { author_id , post_id , skip , take} = data
        return await prisma.comment.findMany({
            where : { author_id , post_id },
            select : {
                id : true,
                content : true ,
                created_at : true ,
                updated_at : true
            },
            orderBy : { created_at :"desc" },
            skip,
            take 

        })
    }
    async createComment(data : CreateCommentRepoDTO){
        const { author_id , post_id , content } = data
        return await prisma.comment.create({
            data : {
                author_id : author_id,
                post_id : post_id,
                content : content
            },
            select : {
                id : true,
                author_id : true ,
                content : true,
                created_at: true,
                updated_at : true
            }
        })
    }
}