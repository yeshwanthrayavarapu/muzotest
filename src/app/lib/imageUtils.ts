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
export async function getRandomImageUrl(prompt: string, api = IMAGE_APIS.UNSPLASH): Promise<string> {
  // Extract keywords from prompt (simple version)
  const keywords = extractKeywords(prompt);
  const searchTerm = keywords.join(',');

  try {
    switch (api) {
      case IMAGE_APIS.UNSPLASH:
        // Using Unsplash Source service (no API key required)
        return `https://source.unsplash.com/random/800x800/?${encodeURIComponent(searchTerm)}`;
      
      case IMAGE_APIS.PICSUM:
        // Lorem Picsum doesn't support search terms, but provides random images
        const randomId = Math.floor(Math.random() * 1000);
        return `https://picsum.photos/seed/${randomId}/800/800`;
      
      case IMAGE_APIS.LOREM_FLICKR:
        // LoremFlickr supports keywords
        return `https://loremflickr.com/800/800/${encodeURIComponent(searchTerm)}`;
        
      default:
        return `https://source.unsplash.com/random/800x800/?${encodeURIComponent('music')}`;
    }
  } catch (error) {
    console.error('Error fetching random image:', error);
    // Fallback to a default music-related image
    return 'https://source.unsplash.com/random/800x800/?music';
  }
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
