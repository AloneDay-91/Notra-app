'use server'

import { signIn, signOut } from '@/auth'
import {prisma} from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { AuthError } from 'next-auth'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    // Automatically sign in the user after they sign up
    await signIn('credentials', { email, password, redirectTo: '/dashboard' })
  } catch (error) {
    // Check if it's a Prisma error for unique constraint violation (email already exists)
    if ((error as { code?: string }).code === 'P2002') {
      return { error: 'An account with this email already exists.' }
    }
    return { error: 'Something went wrong.' }
  }
}

export async function signInAction(formData: FormData) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid email or password.' }
        default:
          return { error: 'Something went wrong.' }
      }
    }
    throw error
  }
}

export async function signOutAction() {
  await signOut()
}
