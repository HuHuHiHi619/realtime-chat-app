import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/authService";
import { jwt } from "zod";


export class AuthController {
  constructor(private authService : AuthService) {}

  public async register(req: Request, res: Response , next : NextFunction) {
    try {
      const user = await this.authService.registerUser(req.validatedBody);
      return res.status(200).json(
        user,
      );
    } catch (error) {
      next(error)
    }
  }

  public async login(req: Request, res: Response , next : NextFunction) {
    try {
      const loginResult = await this.authService.loginUser(req.validatedBody);

      const { accessToken, refreshToken , user } = loginResult;

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
     
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  public async logout(req: Request, res: Response , next : NextFunction) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 15 * 60 * 1000,
      }),
        res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      return res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
      console.error("logout error :",error)
      next(error)
    }
  }

  public async refreshCookies(req : Request , res : Response , next : NextFunction) {
    try{
      const refreshToken = req.cookies.refreshToken
      if(!refreshToken) return res.status(401).json({error : 'No refresh token'})
      
      const refreshResult = await this.authService.refreshAccessToken(refreshToken)
      const { accessToken , user_id } = refreshResult
      
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 15 * 60 * 1000,
      });
      return res.status(200).json(user_id)

    }catch(error){
      console.error("refresh cookies error :",error)
      next(error)
    }
  }
}
