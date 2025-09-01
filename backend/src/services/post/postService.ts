import { CreatePostServiceDTO, GetPostServiceDTO } from "../../types/post"
import { PostRepository } from "../../repositories/post/postRepository"

export class PostService {
    constructor(
        private postRepository : PostRepository
    ) {}

    async getPosts(data : GetPostServiceDTO ) {
        const { author_id , page , limit } = data
        const totalPost = await this.postRepository.countPost(author_id)
        const skip = (page - 1) * limit;
        const hasMore = page * limit < totalPost
     
        const posts = await this.postRepository.findPosts({author_id , skip , take :limit})

        return {
            pagination : {
                page , 
                limit : limit,
                total : totalPost,
                hasMore,
            },
            posts
        }
    }

    async createPost(postData : CreatePostServiceDTO){
        return this.postRepository.createPost(postData)
    }
}