import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient, StorageSharedKeyCredential } from '@azure/storage-blob';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const blobUrl = searchParams.get('blob');
        
        if (!blobUrl) throw new Error('No blob URL provided');

        const cacheKey = `audio-${encodeURIComponent(blobUrl)}`;
        
        // Aggressive caching
        const ifNoneMatch = request.headers.get('if-none-match');
        if (ifNoneMatch === cacheKey) {
            return new NextResponse(null, { 
                status: 304,
                headers: {
                    'Cache-Control': 'public, max-age=31536000, immutable',
                    'ETag': cacheKey
                }
            });
        }

        // Parse the blob URL
        const url = new URL(blobUrl);
        const pathParts = url.pathname.split('/');
        const containerName = pathParts[1];
        const blobName = pathParts.slice(2).join('/');

        const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
        const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;

        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${accountName}.blob.core.windows.net`,
            sharedKeyCredential
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);

        // Download entire file at once
        const downloadResponse = await blobClient.downloadToBuffer();
        
        return new NextResponse(downloadResponse, {
            headers: {
                'Content-Type': 'audio/wav',
                'Content-Length': downloadResponse.length.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
                'ETag': cacheKey,
                'Expires': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString(),
                'Last-Modified': new Date().toUTCString(),
                'Cross-Origin-Resource-Policy': 'cross-origin'
            },
        });

    } catch (error) {
        console.error('Proxy error:', error);
        return new NextResponse(
            JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), 
            { status: 500 }
        );
    }
} 