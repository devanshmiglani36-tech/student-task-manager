import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { signAccessToken } from '../utils/jwt.js';

const MAJOR_LABELS = {
  cs: 'B.S. Computer Science',
  bio: 'B.S. Biology & Life Sciences',
  bus: 'B.A. Business & Economics',
  eng: 'B.S. Mechanical Engineering',
  psych: 'B.A. Psychology',
  design: 'B.A. Digital Media & Design',
};

export async function register(req, res, next) {
  try {
    const { name, email, major, university, password } = req.validatedBody;
    const normalizedEmail = email.toLowerCase();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res
        .status(409)
        .json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const resolvedMajor = MAJOR_LABELS[major] || major;

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      major: resolvedMajor,
      university: university || 'Stanford University',
    });

    const token = signAccessToken(user._id);
    return res.status(201).json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password, rememberMe } = req.validatedBody;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail }).select(
      '+passwordHash',
    );
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signAccessToken(user._id, rememberMe ? '30d' : undefined);
    return res.status(200).json({
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    return next(err);
  }
}

export async function getMe(req, res) {
  return res.status(200).json({
    user: req.user.toPublicJSON(),
  });
}

export async function updateMe(req, res, next) {
  try {
    const updates = req.validatedBody;
    const user = req.user;

    const scalarFields = [
      'name',
      'university',
      'major',
      'year',
      'statusBanner',
      'gpaGoal',
      'gpaCurrent',
      'gpaProgress',
      'honorsCount',
    ];

    for (const field of scalarFields) {
      if (updates[field] !== undefined) {
        user[field] = updates[field];
      }
    }

    if (updates.preferences) {
      user.preferences = {
        notifications:
          updates.preferences.notifications ?? user.preferences.notifications,
        weeklyDigest:
          updates.preferences.weeklyDigest ?? user.preferences.weeklyDigest,
        theme: updates.preferences.theme ?? user.preferences.theme,
      };
    }

    await user.save();
    return res.status(200).json({
      user: user.toPublicJSON(),
    });
  } catch (err) {
    return next(err);
  }
}
