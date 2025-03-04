'use server';

import { getRandomImageUrl } from '@/app/lib/imageUtils';

/**
 * Generate a cover image based on a prompt
 */
export async function generateCoverImage(prompt: string) {
  try {
    const coverUrl = await getRandomImageUrl(prompt);
    return { success: true, coverUrl };
  } catch (error) {
    console.error('Error generating cover image:', error);
    return { success: false, error: 'Failed to generate cover image' };
  }
}

/**
 * Regenerate a cover image for a specific track
 */
export async function regenerateTrackCover(trackId: string) {
  try {
    const response = await fetch(`/api/tracks/${trackId}/cover`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to regenerate cover');
    }

    const data = await response.json();
    return { success: true, coverUrl: data.coverUrl };
  } catch (error) {
    console.error('Error regenerating cover:', error);
    return { success: false, error: 'Failed to regenerate cover image' };
  }
}
