import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['todo', 'in_progress', 'review', 'done'],
        message: '{VALUE} is not a valid status',
      },
      default: 'todo',
    },
    priority: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high', 'critical'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'medium',
    },
    tags: {
      type: [String],
      default: [],
    },
    dueDate: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save Mongoose middleware (Day 4 learning: Schema Middleware & Normalization)
TaskSchema.pre('save', function (next) {
  if (this.tags && Array.isArray(this.tags)) {
    this.tags = this.tags.map((t) => t.trim().toLowerCase()).filter(Boolean);
  }
  next();
});

// Compile model or retrieve existing to avoid Mongoose OverwriteModelError in Next.js
export const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

// In-Memory fallback store with seeded initial data for resilient offline execution
let inMemoryTasks = [
  {
    _id: 'task-1',
    title: 'Master React Virtual DOM & Reconciliation',
    description: 'Understand fiber tree diffing, reconciliation algorithm, and batched rendering cycles.',
    status: 'done',
    priority: 'high',
    tags: ['react', 'virtual-dom', 'core'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    order: 0,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'task-2',
    title: 'Implement Immutable State History',
    description: 'Build pure state time-travel snapshots using array spread operators and immutable updates.',
    status: 'done',
    priority: 'high',
    tags: ['react', 'immutability', 'state'],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    order: 1,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    _id: 'task-3',
    title: 'Create Custom Hooks Suite (useTasks & useToggle)',
    description: 'Extract business logic and side effects into clean, reusable custom hooks with AbortController.',
    status: 'in_progress',
    priority: 'critical',
    tags: ['hooks', 'async', 'abort-controller'],
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    order: 0,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'task-4',
    title: 'Design MongoDB BSON Schemas & Aggregations',
    description: 'Define Mongoose schema validation rules and implement $group & $match pipelines for analytics.',
    status: 'in_progress',
    priority: 'medium',
    tags: ['mongodb', 'mongoose', 'aggregation'],
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString(),
    order: 1,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'task-5',
    title: 'Construct Next.js App Router API Handlers',
    description: 'Build REST endpoints for tasks and analytics with global Mongoose connection caching.',
    status: 'todo',
    priority: 'high',
    tags: ['nextjs', 'api-routes', 'fullstack'],
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    order: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'task-6',
    title: 'Prepare Week 4 React Native Foundations',
    description: 'Explore cross-platform mobile architecture, View/Text components, and React Navigation.',
    status: 'todo',
    priority: 'low',
    tags: ['react-native', 'mobile', 'roadmap'],
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const fallbackStore = {
  getAll: (filter = {}) => {
    let results = [...inMemoryTasks];
    if (filter.status && filter.status !== 'all') {
      results = results.filter((t) => t.status === filter.status);
    }
    if (filter.priority && filter.priority !== 'all') {
      results = results.filter((t) => t.priority === filter.priority);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return results.sort((a, b) => a.order - b.order || new Date(b.createdAt) - new Date(a.createdAt));
  },
  create: (data) => {
    const newTask = {
      _id: 'task-' + (Date.now() + Math.floor(Math.random() * 1000)),
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      tags: Array.isArray(data.tags) ? data.tags.map((t) => t.trim().toLowerCase()).filter(Boolean) : [],
      dueDate: data.dueDate || null,
      order: inMemoryTasks.filter((t) => t.status === (data.status || 'todo')).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryTasks.unshift(newTask);
    return newTask;
  },
  update: (id, updates) => {
    const idx = inMemoryTasks.findIndex((t) => t._id === id);
    if (idx === -1) return null;
    inMemoryTasks[idx] = {
      ...inMemoryTasks[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryTasks[idx];
  },
  delete: (id) => {
    const idx = inMemoryTasks.findIndex((t) => t._id === id);
    if (idx === -1) return false;
    inMemoryTasks.splice(idx, 1);
    return true;
  },
  getAnalytics: () => {
    const total = inMemoryTasks.length;
    const byStatus = {
      todo: inMemoryTasks.filter((t) => t.status === 'todo').length,
      in_progress: inMemoryTasks.filter((t) => t.status === 'in_progress').length,
      review: inMemoryTasks.filter((t) => t.status === 'review').length,
      done: inMemoryTasks.filter((t) => t.status === 'done').length,
    };
    const byPriority = {
      low: inMemoryTasks.filter((t) => t.priority === 'low').length,
      medium: inMemoryTasks.filter((t) => t.priority === 'medium').length,
      high: inMemoryTasks.filter((t) => t.priority === 'high').length,
      critical: inMemoryTasks.filter((t) => t.priority === 'critical').length,
    };
    const completionRate = total > 0 ? Math.round((byStatus.done / total) * 100) : 0;
    return {
      total,
      byStatus,
      byPriority,
      completionRate,
      storageEngine: 'Mongoose / Hybrid Reactive Store',
    };
  },
};
