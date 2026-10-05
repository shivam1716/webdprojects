import { loginUser, registerUser, getUserById, updateUser } from '../services/authService.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' })
    }
    const { user, token } = await loginUser(email, password)
    res.json({ success: true, message: 'Login successful', user, token })
  } catch (error) {
    next(error)
  }
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' })
    }
    const { user, token } = await registerUser(name, email, password)
    res.status(201).json({ success: true, message: 'Registration successful', user, token })
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id)
    res.json({ success: true, user })
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar_url } = req.body
    const updates = {}
    if (name !== undefined) updates.name = name
    if (avatar_url !== undefined) updates.avatar_url = avatar_url

    const user = await updateUser(req.user.id, updates)
    res.json({ success: true, message: 'Profile updated', user })
  } catch (error) {
    next(error)
  }
}
