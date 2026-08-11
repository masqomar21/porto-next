'use server';

import connectDB from '@/lib/mongodb';
import InboxMessage from '@/models/InboxMessage';
import { revalidatePath } from 'next/cache';

export async function toggleReadStatus(id: string, currentRead: boolean) {
  try {
    await connectDB();
    await InboxMessage.findByIdAndUpdate(id, { read: !currentRead });
    revalidatePath('/admin/inbox');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle read status:', error);
    return { success: false, error: 'Failed to update message status' };
  }
}

export async function deleteInboxMessage(id: string) {
  try {
    await connectDB();
    await InboxMessage.findByIdAndDelete(id);
    revalidatePath('/admin/inbox');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete inbox message:', error);
    return { success: false, error: 'Failed to delete message' };
  }
}
