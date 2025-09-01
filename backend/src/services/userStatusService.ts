import { UserStatusRepo } from "../repositories/UserStatusRepository";
import { OnlineUserStore } from "../socket/onlineUserStore";

export class UserStatusService {
    constructor(
        private store : OnlineUserStore,
        private repo : UserStatusRepo
    ) {}

    async getConversationStatus(user_ids : number[]) {
        const onlineUsers = this.store.list().filter(user => user_ids.includes(user.user_id));
        const onlineIds = onlineUsers.map(user => user.user_id);
        const offlineIds = user_ids.filter(id => !onlineIds.includes(id))
        const offlineUsers = await this.repo.getUsersInfo(offlineIds)

        return {
            online : onlineUsers.map(user => ({
                userId : user.user_id,
                username : user.username,
                lastSeen : user.lastSeen
            })),
            offline : offlineUsers.map(user => ({
                userId : user.id,
                username : user.username,
                lastSeen : user.last_active_at ?? undefined
            }))

        }
    }
}
