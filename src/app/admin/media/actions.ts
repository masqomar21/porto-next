'use server';

import connectDB from '@/lib/mongodb';
import MediaAsset from '@/models/MediaAsset';
import { revalidatePath } from 'next/cache';

export async function addMediaAsset(filename: string, url: string, size: number = 0, mimeType: string = 'image/jpeg') {
  try {
    await connectDB();
    const key = `assets/${Date.now()}-${filename.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const asset = await MediaAsset.create({
      filename,
      url,
      key,
      size,
      mimeType,
    });
    revalidatePath('/admin/media');
    revalidatePath('/admin');
    return { success: true, asset: JSON.parse(JSON.stringify(asset)) };
  } catch (error) {
    console.error('Failed to add media asset:', error);
    return { success: false, error: 'Failed to add asset' };
  }
}

export async function deleteMediaAsset(id: string) {
  try {
    await connectDB();
    await MediaAsset.findByIdAndDelete(id);
    revalidatePath('/admin/media');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete media asset:', error);
    return { success: false, error: 'Failed to delete asset' };
  }
}
