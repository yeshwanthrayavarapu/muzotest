/**
 * Utility functions for handling images
 */

// List of image APIs we can use
const IMAGE_APIS = {
  UNSPLASH: 'unsplash',
  PICSUM: 'picsum',
  LOREM_FLICKR: 'loremflickr'
};

/**
 * Get a random image URL based on search terms
 */
export async function getRandomImageUrl(prompt: string): Promise<string> {
  // Simplified to use Picsum directly since it works reliably
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/seed/${randomId}/800/800`;
}

/**
 * Extract relevant keywords from the prompt
 */
function extractKeywords(prompt: string): string[] {
  // Remove common words and extract potential keywords
  const words = prompt.toLowerCase().split(/\s+/);
  
  // Remove common words, short words, and keep only relevant terms
  const commonWords = ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'with', 
                      'by', 'about', 'like', 'of', 'and', 'or', 'but', 'is', 
                      'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 
                      'had', 'do', 'does', 'did', 'will', 'would', 'should', 'can', 
                      'could', 'may', 'might', 'must', 'shall'];
  
  // Filter out common words and short words
  const keywords = words.filter(word => 
    word.length > 3 && !commonWords.includes(word)
  );
  
  // Add music-related terms to ensure we get relevant images
  const musicTerms = ['music', 'album', 'audio', 'sound'];
  
  // Take up to 3 keywords from the prompt and add a music term
  const selectedKeywords = keywords.slice(0, 3);
  
  // Always include at least one music-related term
  if (!selectedKeywords.some(word => musicTerms.includes(word))) {
    selectedKeywords.push(musicTerms[Math.floor(Math.random() * musicTerms.length)]);
  }
  
  return selectedKeywords;
}
