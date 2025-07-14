import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { z } from 'zod'

const prisma = new PrismaClient();

const registerSchema = z.object({
    email : z.string(),
    username: z.string(),
    password: z.string().min(6 , 'Password must be at least 6 characters')
})

const loginSchema = z.object({
    email : z.string(),
    password: z.string()
})

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const  validateData = registerSchema.safeParse(req.body)
    if(!validateData.success) {
        const tree = z.treeifyError(validateData.error);
        const pretty = z.prettifyError(validateData.error)
        return res.status(400).json({
            message : "Invalid data",
            tree_error : tree,
            pretty_error : pretty
        })
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

export const login = async (
    req: Request,
    res: Response
) => {
  try {
    const validateData = loginSchema.safeParse(req.body)
    if(!validateData.success) {
        const tree = z.treeifyError(validateData.error);
        const pretty = z.prettifyError(validateData.error)
        return res.status(400).json({
            message: "Invalid data",
            tree_error : tree,
            pretty_error : pretty
        })
    }
    const { email, password } = validateData.data;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const comparedPassword = await argon2.verify(
      existingUser.password,
      password
    );
    if(!comparedPassword){
        return res.status(400).json({ message: "Invalid password" });
    }

    const { password: _, ...userWithoutPassword } = existingUser;

    res.status(200).json({
        message: "User logged in successfully",
        user: userWithoutPassword
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


