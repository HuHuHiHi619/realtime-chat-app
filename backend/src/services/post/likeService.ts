import { LikeRepository } from "../../repositories/post/likeRepository";
import { LikeDTO } from "../../types/post";

export class LikeService {
    constructor(private likeRepository : LikeRepository) {}

    async getLikes(data : LikeDTO) {
        return await this.likeRepository.countLike(data)
    }
    async createLike(data : LikeDTO){
        return await this.likeRepository.createLike(data)
    }
    async deleteLike(data : LikeDTO){
        return await this.likeRepository.deleteLike(data)
    }
} 