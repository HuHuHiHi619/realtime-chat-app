import { apiClient } from "@/helper/apiClient"

const baseUrl = "http://localhost:5000/api";

export const likeApi = {
    clientCreateLike : (post_id : number , signal : AbortSignal) => {
        return apiClient({
            method : 'POST',
            url : `${baseUrl}/posts/${post_id}/likes`,
            schema :(data) => data,
            signal : signal
        })
    },
    clientDeleteLike : (post_id : number , signal : AbortSignal) => {
        return apiClient({
            method : 'DELETE',
            url : `${baseUrl}/posts/${post_id}/likes`,
            schema :(data) => data,
            signal : signal
        })
    }
}