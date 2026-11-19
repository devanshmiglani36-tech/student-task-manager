import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const preferencesSchema = new mongoose.Schema(
  {
    notifications: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: true },
    theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    passwordHash: { type: String, required: true, select: false },
    university: {
      type: String,
      trim: true,
      default: 'Stanford University',
      maxlength: 120,
    },
    major: {
      type: String,
      trim: true,
      default: 'B.S. Computer Science',
      maxlength: 120,
    },
    year: { type: String, trim: true, default: 'Junior', maxlength: 40 },
    statusBanner: {
      type: String,
      trim: true,
      default: 'Locked in for Finals Week',
      maxlength: 120,
    },
    gpaGoal: { type: String, default: '4.00', maxlength: 10 },
    gpaCurrent: { type: String, default: '3.92', maxlength: 10 },
    gpaProgress: { type: Number, default: 98, min: 0, max: 100 },
    honorsCount: { type: Number, default: 3, min: 0, max: 20 },
    streakDays: { type: Number, default: 1, min: 0 },
    bestStreakDays: { type: Number, default: 1, min: 0 },
    historicalCompleted: { type: Number, default: 0, min: 0 },
    preferences: { type: preferencesSchema, default: () => ({}) },
  },
  { timestamps: true },
);

userSchema.methods.comparePassword = function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    university: this.university,
    major: this.major,
    year: this.year,
    statusBanner: this.statusBanner,
    gpaGoal: this.gpaGoal,
    gpaCurrent: this.gpaCurrent,
    gpaProgress: this.gpaProgress,
    honorsCount: this.honorsCount,
    streakDays: this.streakDays,
    bestStreakDays: this.bestStreakDays,
    historicalCompleted: this.historicalCompleted,
    preferences: {
      notifications: this.preferences?.notifications ?? true,
      weeklyDigest: this.preferences?.weeklyDigest ?? true,
      theme: this.preferences?.theme ?? 'dark',
    },
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);
