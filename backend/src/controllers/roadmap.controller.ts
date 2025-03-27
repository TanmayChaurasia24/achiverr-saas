import { PrismaClient } from "@prisma/client";
import { Request,Response } from "express";

const prisma = new PrismaClient();

export const createRoadmap = async(req: Request, res: Response): Promise<any> => {
    try {
        const {goalId} = req.params
        const {day,description} = req.body;

        if(!goalId || !day || !description) {
            return res.status(400).json({message: "Please fill all fields."});
        }

        const roadmap = await prisma.roadmapItem.create({
            data: {
                goalId,
                day,
                description
            }
        })

        if(!roadmap) {
            return res.status(400).json({message: "Failed to create roadmap item."});
        }

        return res.status(201).json({
            message: "roadmap created",
            roadmap
        })
    } catch (error) {
        return res.status(500).json({
            message: "error while creating roadmap",
            error: error
        })
    }
}