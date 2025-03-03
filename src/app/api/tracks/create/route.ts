import { NextRequest, NextResponse } from 'next/server';

const AZURE_ENDPOINT = 'https://muzo-ydwzt.australiaeast.inference.ml.azure.com/score';
const AZURE_API_KEY = 'YOUR_AZURE_API_KEY'; // Replace with your actual API key

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
        'Authorization': `Bearer ${AZURE_API_KEY}`, // Add your API key
      },
      body: JSON.stringify({ prompt }),
    });

    if (!azureResponse.ok) {
      throw new Error('Failed to generate audio from Azure');
    }

    const { audio_url, audio_base64 } = await azureResponse.json();

    return NextResponse.json({
      id: crypto.randomUUID(),
      prompt,
      audio_url,       // Azure Blob URL
      audio_base64,    // Base64 Encoded Audio
      createdAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error creating track:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create track' },
      { status: 500 }
    );
  }
}