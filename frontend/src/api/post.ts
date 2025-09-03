import { paginatedPostSchema } from "@shared/schema/post/post.schema";
import { apiClient } from "../helper/apiClient"

import type { CreatePostReq } from "@/types/postStoreType";

const baseUrl = "http://localhost:5000/api";
export const postApi = {
    clientGetPosts : (signal : AbortSignal) => {
        return apiClient({
            method : 'GET',
            url : `${baseUrl}/posts`,
            schema : (data) => paginatedPostSchema.parse(data),
            signal : signal
        })
    },
    clientCreatePost : (data : CreatePostReq, signal : AbortSignal) => {
        return apiClient({
            method : 'POST',
            url : `${baseUrl}/posts`,
            body : data,
            schema :(data) => data,
            signal : signal
        })
    }, 
    clientDeletePost : ( signal : AbortSignal) => {
        return apiClient({
            method : 'DELETE',
            url : `${baseUrl}/posts`,
            schema :(data) => data,
            signal : signal
        })
    }, 
}