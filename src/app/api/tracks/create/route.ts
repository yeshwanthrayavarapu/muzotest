import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/dbClient';
import * as sql from 'mssql';
import { getRandomImageUrl } from '@/app/lib/imageUtils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth/authOptions';

const AZURE_ENDPOINT = process.env.AZURE_ENDPOINT ;
const AZURE_API_KEY = process.env.AZURE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from email
    const userResult = await executeQuery(
      "SELECT id FROM Users WHERE email = @param0",
      [session.user.email]
    );

    if (!userResult?.[0]?.id) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = userResult[0].id;
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate cover URL before Azure API call
    const coverUrl = await getRandomImageUrl(prompt);

    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
      throw new Error('Azure configuration is missing');
    }

    // Call Azure Inference API
    const azureResponse = await fetch(AZURE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AZURE_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    console.log('Azure response:', azureResponse);

    if (!azureResponse.ok) {
      throw new Error('Failed to generate audio');
    }

    // HACK: The API returns a stringified JSON response with escaped quotes.
    //       Parse it twice to get the JSON object.
    const json = JSON.parse(await azureResponse.json());
    const { audio_url, audio_base64 } = json;

    const id = crypto.randomUUID();
    const title = prompt.substring(0, 50);
    const createdAt = new Date().toISOString();
    const genre = generateGenre(prompt);
    const artist = "AI Music";
    const duration = "15";

    const playUrl = `data:audio/wav;base64,${audio_base64}`;

    return NextResponse.json({
      id,
      title,
      description : prompt,
      genre,
      duration,
      artist,
      coverUrl,
      audioUrl: audio_url,
      playUrl: playUrl,
      prompt,
      createdAt,
      userId,
    });

  } catch (error) {
    console.error('Error creating track:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create track' },
      { status: 500 }
    );
  }
}

/**
 * Generate a music genre based on the prompt
 */
function generateGenre(prompt: string): string {
  const genreKeywords: Record<string, string[]> = {
    'pop': ['pop', 'catchy', 'mainstream', 'radio', 'hook', 'chorus'],
    'rock': ['rock', 'guitar', 'band', 'drums', 'electric', 'heavy'],
    'hip hop': ['rap', 'beat', 'flow', 'rhyme', 'hip hop', 'trap'],
    'electronic': ['electronic', 'edm', 'beat', 'synth', 'bass', 'drop', 'techno'],
    'jazz': ['jazz', 'saxophone', 'trumpet', 'smooth', 'improvisation', 'bebop'],
    'classical': ['classical', 'orchestra', 'symphony', 'piano', 'violin', 'concerto'],
    'r&b': ['r&b', 'soul', 'rhythm', 'blues', 'groove', 'smooth'],
    'country': ['country', 'guitar', 'western', 'folk', 'acoustic', 'rural'],
    'ambient': ['ambient', 'atmospheric', 'calm', 'peaceful', 'meditation', 'relax'],
    'indie': ['indie', 'alternative', 'underground', 'diy']
  };

  const promptLower = prompt.toLowerCase();

  // Check if any genre keywords are in the prompt
  for (const [genre, keywords] of Object.entries(genreKeywords)) {
    if (keywords.some(keyword => promptLower.includes(keyword))) {
      return genre;
    }
  }

  // Default to a random genre if no keywords match
  const genres = Object.keys(genreKeywords);
  return genres[Math.floor(Math.random() * genres.length)];
}
