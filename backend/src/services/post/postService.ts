import { CreatePostServiceDTO, GetPostsServiceDTO, GetSinglePostServiceDTO } from "../../types/post"
import { PostRepository } from "../../repositories/post/postRepository"

export class PostService {
    constructor(
        private postRepository : PostRepository
    ) {}

    async getSinglePost(data : GetSinglePostServiceDTO ){
        return this.postRepository.findSinglePost(data)
    }

    async getPosts(data : GetPostsServiceDTO ) {
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

    async deletePost(postData: any){
        const existingPost = await this.postRepository.findDeletePost(postData)
        if(!existingPost) throw new Error('Post not found')
        
        return this.postRepository.deletePost(existingPost.id)
    }
}