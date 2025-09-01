import { LoginInput, RegisterInput } from "../types/auth"
import { AuthRepository } from "../repositories/AuthRepository"
import argon2 from "argon2"
import  jwt  from "jsonwebtoken"
import dotenv from "dotenv"
import { ApiError } from "../utils/apiError"

dotenv.config();

if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error("Environment variable ACCESS_TOKEN_SECRET is not set.");
    process.exit(1);
}
if (!process.env.REFRESH_TOKEN_SECRET) {
    console.error("Environment variable REFRESH_TOKEN_SECRET is not set.");
    process.exit(1);
}
const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET;


export class AuthService {
    constructor(private authRepository : AuthRepository){}

    async registerUser(data : RegisterInput){
        const existingUser = await this.authRepository.checkExistingUser(data.email)

        if (existingUser) {
            throw ApiError.unauthorized("User already exists")
        }

        const hashedPassword = await argon2.hash(data.password)

        const user = await this.authRepository.registerUser({...data , password : hashedPassword})

        const { password : _ , ...newUser } = user

        return newUser
    }

    async loginUser(data : LoginInput){
        const existingUser = await this.authRepository.checkExistingUser(data.email)
        
        if (!existingUser) {
            throw ApiError.unauthorized("User not found")
        }

        const isMatch = await argon2.verify(existingUser.password, data.password);

        if (!isMatch) {
            throw ApiError.unauthorized("Invalid email or password")
        }

        const { password : _ , ...user } = existingUser

        const payload  = { user_id : user.id }
        const accessToken = jwt.sign(payload , accessTokenSecret , { expiresIn : "15m" })
        const refreshToken = jwt.sign(payload , refreshTokenSecret , { expiresIn : "7d" })

        return {user , accessToken , refreshToken }
    }
}