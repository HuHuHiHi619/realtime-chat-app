import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();
const prisma = new PrismaClient();

if (!process.env.ACCESS_TOKEN_SECRET) {
  console.error("Environment variable ACCESS_TOKEN_SECRET is not set.");
  process.exit(1);
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  console.error("Environment variable REFRESH_TOKEN_SECRET is not set.");
  process.exit(1);
}

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret : string = process.env.REFRESH_TOKEN_SECRET;

const registerSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const validateData = registerSchema.safeParse(req.body);
    if (!validateData.success) {
      const tree = z.treeifyError(validateData.error);
      const pretty = z.prettifyError(validateData.error);
      return res.status(400).json({
        message: "Invalid data",
        tree_error: tree,
        pretty_error: pretty,
      });
    }
    const { email, username, password } = validateData.data;
    if (!email || !username || !password) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await argon2.hash(password);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validateData = loginSchema.safeParse(req.body);
    if (!validateData.success) {
      const tree = z.treeifyError(validateData.error);
      const pretty = z.prettifyError(validateData.error);
      return res.status(400).json({
        message: "Invalid data",
        tree_error: tree,
        pretty_error: pretty,
      });
    }
    const { email, password } = validateData.data;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const comparedPassword = await argon2.verify(
      existingUser.password,
      password
    );
    if (!comparedPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const { password: _, ...userWithoutPassword } = existingUser;

    const payload = { user_id: userWithoutPassword.id };

    const accessToken = jwt.sign(payload, accessTokenSecret, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, refreshTokenSecret, {
      expiresIn: "7d",
    });

    res.cookie("/", accessToken ,{
      httpOnly : false,
      sameSite: "none",
      secure: false,
      maxAge: 15 * 60 * 1000
    })
    res.cookie("/", refreshToken ,{
      httpOnly : false,
      sameSite: "none",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: "User logged in successfully",
      user: userWithoutPassword,
      token: {
        accessToken,
        refreshToken,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
