import prisma from "../prisma/prismaClient";

export class UserStatusRepo {
    
    async getUsersInfo(user_ids : number[]) {
        return await prisma.user.findMany({
            where : { id : { in : user_ids } },
            select : {
                id : true,
                username : true,
                last_active_at : true
            }
 
        })
    }
  
}