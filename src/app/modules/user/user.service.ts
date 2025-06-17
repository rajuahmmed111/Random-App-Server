import type { User } from "@prisma/client"
import prisma from "../../db/prisma"
import { CreateUserData, UpdateUserData } from "./user.interface"

export const findUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  })
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
  })
}

export const findUserByUsername = async (username: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { username },
  })
}

export const createUser = async (data: CreateUserData): Promise<User> => {
  return await prisma.user.create({
    data,
  })
}

export const updateUser = async (id: string, data: UpdateUserData): Promise<User | null> => {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    })
  } catch (error) {
    return null
  }
}

export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({
    where: { id },
  })
}
