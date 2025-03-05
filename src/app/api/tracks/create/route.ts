import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/app/lib/db';
import * as sql from 'mssql';
import { getRandomImageUrl } from '@/app/lib/imageUtils';

const AZURE_ENDPOINT = 'https://muzo-ydwzt.australiaeast.inference.ml.azure.com/score';
const AZURE_API_KEY = process.env.AZURE_API_KEY || 'h1GlRJnmVXtHtYk2EpDy2tKpnpSaeuMZX1SjRhA1E9NFINdzY8EQJQQJ99BBAAAAAAAAAAAAINFRAZMLduZN';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
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

    // Generate a random cover image based on the prompt
    const coverUrl = await getRandomImageUrl(prompt);

    const id = crypto.randomUUID();
    const title = prompt.substring(0, 50); // Use first 50 chars of prompt as title
    const createdAt = new Date().toISOString();

    // Generate a genre based on the prompt
    const genre = generateGenre(prompt);

    // Placeholder values for additional track metadata
    const artist = "AI Music"; // Default artist name
    const duration = "3:30"; // Placeholder duration

    // Store track in database with cover image URL
    await executeQuery(`
      INSERT INTO Tracks (id, title, description, genre, duration, artist, coverUrl, audioUrl, prompt, createdAt) 
      VALUES (@id, @title, @desc, @genre, @duration, @artist, @coverUrl, @audioUrl, @prompt, @createdAt)
    `, [
      { name: 'id', value: id, type: sql.VarChar(255) },
      { name: 'title', value: title, type: sql.VarChar(255) },
      { name: 'desc', value: prompt, type: sql.VarChar(500) },
      { name: 'genre', value: genre, type: sql.VarChar(50) },
      { name: 'duration', value: duration, type: sql.VarChar(10) },
      { name: 'artist', value: artist, type: sql.VarChar(100) },
      { name: 'coverUrl', value: coverUrl, type: sql.VarChar(255) },
      { name: 'audioUrl', value: audio_url, type: sql.VarChar(255) },
      { name: 'prompt', value: prompt, type: sql.VarChar(500) },
      { name: 'createdAt', value: createdAt, type: sql.DateTime() }
    ]);

    const audioUrl = `data:audio/wav;base64,${audio_base64}`;

    return NextResponse.json({
      id,
      title,
      description: prompt,
      genre,
      duration,
      plays: 0,
      likes: 0,
      artist,
      coverUrl,
      audioUrl,
      prompt,
      createdAt,
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
