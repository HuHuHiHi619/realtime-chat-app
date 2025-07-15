import { Request , Response , NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request { 
    user_id : number,
    username? : string,
    email : string
}

export const verifyToken = (req : AuthRequest , res : Response , next: NextFunction ) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message : "Authorization not found"});
    }
    
}