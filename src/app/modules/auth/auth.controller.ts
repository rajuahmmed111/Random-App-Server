import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import { generateToken } from "./auth.service"
import { createUser, findUserByEmail, findUserByUsername } from "../user/user.service"
import { AppError } from "../../../error/AppError"

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, username, password } = req.body

  // Check if user already exists
  const existingUser = await findUserByEmail(email)
  if (existingUser) {
    throw new AppError("User already exists with this email", 400)
  }

  const existingUsername = await findUserByUsername(username)
  if (existingUsername) {
    throw new AppError("Username already taken", 400)
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Create user - matching frontend UserType interface
  const user = await createUser({
    email,
    username,
    password: hashedPassword,
  })

  // Generate token
  const token = generateToken(user.id)

  console.log(`New user registered: ${user.email}`)

  // Response matching frontend expectations
  res.status(201).json({
    success: true,
    statusCode: 201,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    message: "User registered successfully",
    token,
  })
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  // Find user
  const user = await findUserByEmail(email)
  if (!user) {
    throw new AppError("Invalid credentials", 401)
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new AppError("Invalid credentials", 401)
  }

  // Generate token
  const token = generateToken(user.id)

  console.log(`User logged in: ${user.email}`)

  // Response matching frontend expectations
  res.status(200).json({
    success: true,
    statusCode: 200,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    message: "Login successful",
    token,
  })
}

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const user = (req as any).user

  res.status(200).json({
    success: true,
    statusCode: 200,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    message: "Profile retrieved successfully",
  })
}
