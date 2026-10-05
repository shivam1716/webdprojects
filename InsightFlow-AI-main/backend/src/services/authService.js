import { supabase } from '../config/supabase.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SALT_ROUNDS = 10

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
}

export const registerUser = async (name, email, password) => {
  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    throw new Error('User with this email already exists')
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  // Insert new user
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password_hash: passwordHash }])
    .select('id, name, email, avatar_url, created_at')
    .single()

  if (error) {
    throw new Error(`Failed to create user: ${error.message}`)
  }

  const token = generateToken(data.id)
  return { user: data, token }
}

export const loginUser = async (email, password) => {
  // Fetch user by email
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, password_hash, avatar_url, created_at')
    .eq('email', email)
    .single()

  if (error || !user) {
    throw new Error('Invalid email or password')
  }

  // Compare password hash
  const isValid = await bcrypt.compare(password, user.password_hash)

  if (!isValid) {
    throw new Error('Invalid email or password')
  }

  // Remove hash before returning
  const { password_hash, ...userWithoutHash } = user
  
  const token = generateToken(user.id)
  return { user: userWithoutHash, token }
}

export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, avatar_url, created_at')
    .eq('id', id)
    .single()

  if (error || !data) {
    throw new Error('User not found')
  }

  return data
}

export const updateUser = async (id, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select('id, name, email, avatar_url, created_at')
    .single()

  if (error || !data) {
    throw new Error('Failed to update user')
  }

  return data
}
