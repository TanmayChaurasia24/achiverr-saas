import { Prisma, PrismaClient } from "@prisma/client";
import { error } from "console";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const saveProfile = async (req: Request, res: Response): Promise<any> => {
  const { id, email, phone, user_metadata } = req.body.user;

  try {
    const fullName = user_metadata.full_name;
    const avatarUrl = user_metadata.avatar_url;

    if (!fullName) {
      return res.status(500).json({
        message: "full name is missing",
        error: error,
      });
    }

    const user = await prisma.user.upsert({
      where: { id },
      update: { updatedAt: new Date() },
      create: {
        id,
        fullName,
        email,
        avatarUrl,
        phone
      },
    });

    return res.status(201).json({
      message: "Profile saved successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while saving the profile",
      error,
    });
  }
};
