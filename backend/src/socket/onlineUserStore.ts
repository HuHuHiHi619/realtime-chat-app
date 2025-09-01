import { OnlineUser } from "../types/ีuserStatus";

export class OnlineUserStore {
    private onlineUsers = new Map<number , OnlineUser>()
    private socketIdMap = new Map<string , number>()

    add(user : OnlineUser) {
        this.onlineUsers.set(user.user_id , user)
        this.socketIdMap.set(user.socketId , user.user_id)
    }

    remove(socketId : string) : OnlineUser | undefined{
        const userId = this.socketIdMap.get(socketId)
        if(userId) {
            const user = this.onlineUsers.get(userId)
            this.onlineUsers.delete(userId)
            this.socketIdMap.delete(socketId)
            return user
        }
        return undefined
    }

    list(){
        return Array.from(this.onlineUsers.values())
    }

    has(userId: number) {
        return this.onlineUsers.has(userId);
    }
}