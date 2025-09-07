import { LikeRepository } from "../../repositories/post/likeRepository";
import { LikeDTO } from "../../types/post";

export class LikeService {
    constructor(private likeRepository : LikeRepository) {}

    async getLikes(data : LikeDTO) {
        return await this.likeRepository.countLike(data)
    }
    async toggleLike(data : LikeDTO){
        return await this.likeRepository.toggleLike(data)
    }

} 