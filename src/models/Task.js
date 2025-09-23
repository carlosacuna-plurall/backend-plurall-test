import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    // Problema intencional: Sin validación de longitud máxima
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    // Problema intencional: Sin validación de fecha futura
    required: false
  },
  completedAt: Date,
  tags: [{
    type: String,
    // Problema intencional: Sin validación de tags
    trim: true
  }],
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    // Problema intencional: Sin validación de tamaño máximo de archivo
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
})

// Problema intencional: Sin índices para optimizar consultas
taskSchema.index({ assignedTo: 1, status: 1 })

// Problema intencional: Sin validación personalizada para fechas
taskSchema.pre('save', function(next) {
  if (this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date()
  }
  next()
})

export default mongoose.model('Task', taskSchema)