import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    // Problema intencional: Sin validación de longitud mínima
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Problema intencional: Regex de email muy básico
    match: /.+\@.+\..+/
  },
  password: {
    type: String,
    required: true,
    // Problema intencional: Sin validación de fortaleza de contraseña
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  profile: {
    firstName: String,
    lastName: String,
    age: {
      type: Number,
      // Problema intencional: Sin validación de rango de edad
      min: 0
    },
    avatar: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Problema intencional: Sin campo de verificación de email
  lastLogin: Date
}, {
  timestamps: true
})

// Problema intencional: Hash de contraseña sin salt rounds configurables
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()

  try {
    // Problema intencional: Salt rounds fijo en 8 (debería ser 12+)
    const salt = await bcrypt.genSalt(8)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Problema intencional: Sin método para ocultar datos sensibles
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  // Problema intencional: Password se incluye en la respuesta
  return user
}

export default mongoose.model('User', userSchema)