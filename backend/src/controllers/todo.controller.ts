import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

export const CreateTodo = async (req: Request, res: Response): Promise<any> => {
    try {
        
    } catch (error) {
        return res.status(500).json({
            message: "error while creating the todo",
            error
        })
    }
}