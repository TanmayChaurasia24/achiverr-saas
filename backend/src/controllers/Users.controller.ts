import { Prisma, PrismaClient } from "@prisma/client";
import { error } from "console";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const saveProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  console.log("req.body: ", req.body);
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

    const existingUser = await prisma.user.findFirst({
      where: { id, email },
    });

    if (existingUser) {
      const user = await prisma.user.update({
        where: { id },
        data: { updatedAt: new Date() },
      });
      return res.status(200).json({
        message: "User already exists",
        user: existingUser,
        userUpdated: user,
      });
    }

    const newUser = await prisma.user.create({
      data: {
        id,
        fullName,
        email,
        avatarUrl,
        phone,
      },
    });

    return res.status(201).json({
      message: "Profile saved successfully",
      user: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while saving the profile",
      error,
    });
  }
};
