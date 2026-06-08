'use server';

import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createSession, deleteSession } from '@/lib/session';

export async function login(
  state: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return { error: 'Invalid email or password.' };
    }

    await createSession(user._id.toString(), user.email);
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }

  redirect('/admin');
}

export async function logout() {
  await deleteSession();
  redirect('/admin/login');
}

export async function changePassword(
  state: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match.' };
  }

  if (newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters.' };
  }

  try {
    await connectDB();
    const user = await User.findOne({});
    if (!user) return { error: 'User not found.' };

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) return { error: 'Current password is incorrect.' };

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    return { success: true };
  } catch {
    return { error: 'Failed to update password.' };
  }
}
