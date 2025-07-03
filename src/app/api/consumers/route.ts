import { NextRequest, NextResponse } from 'next/server';

// Environment variables
const API_BASE_URL = 'https://dev.zuplo.com/v1';
const API_KEY = process.env.ZUPLO_API_KEY || process.env.NEXT_PUBLIC_ZUPLO_API_KEY || '';
const DEFAULT_ACCOUNT = process.env.NEXT_PUBLIC_ZUPLO_ACCOUNT || 'bronze_environmental_wren';
const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_ZUPLO_BUCKET || 'zprj-3eldpquvji1nnfahppzlbnwi-working-copy';

export async function GET() {
  try {
    // This runs on the server side, so CORS is not an issue
    const url = `${API_BASE_URL}/accounts/${DEFAULT_ACCOUNT}/key-buckets/${DEFAULT_BUCKET}/consumers?limit=1000&offset=0`;
    
    console.log('API Route: Fetching from URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      // Important: Disable caching for this request
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.error('API Route: Error response status:', response.status);
      return NextResponse.json(
        { error: `Failed to fetch consumers: ${response.statusText}` },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('API Route: Successfully fetched consumers');
    
    // Log the structure of the response data for debugging
    console.log('API Route: Response data structure:', JSON.stringify({
      hasData: !!data.data,
      dataIsArray: Array.isArray(data.data),
      dataLength: data.data?.length || 0,
      firstItem: data.data?.[0] ? JSON.stringify(data.data[0]) : 'No items'
    }, null, 2));
    
    // Log the first few items for inspection
    if (data.data && Array.isArray(data.data) && data.data.length > 0) {
      console.log('API Route: First consumer:', JSON.stringify(data.data[0], null, 2));
    }
    
    // Return the data as-is to the client
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route: Error fetching consumers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consumers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const requestBody = await request.json();
    console.log('API Route: Creating consumer with data:', JSON.stringify(requestBody, null, 2));
    
    // Get the API key from environment variables
    const apiKey = process.env.ZUPLO_API_KEY || process.env.NEXT_PUBLIC_ZUPLO_API_KEY;
    if (!apiKey) {
      console.error('API Route: Missing API key');
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }
    
    // Construct the URL for the Zuplo API endpoint - always create with API key and specify no expiration
    const apiUrl = `${API_BASE_URL}/accounts/${DEFAULT_ACCOUNT}/key-buckets/${DEFAULT_BUCKET}/consumers?with-api-key=true&no-key-expiration=true`;
    console.log('API Route: Sending POST request to URL:', apiUrl);
    
    // Format the request body to match exactly what the API expects
    // The API requires a name field that matches the pattern ^[a-z0-9-_:]+$
    const formattedBody = {
      name: requestBody.name,
      managers: requestBody.managers || [],
      description: requestBody.description || '',
      tags: requestBody.tags || {},
      // We're not setting apiKeys explicitly anymore since we're using the with-api-key=true parameter
      // The Zuplo API will handle key generation for us
      metadata: {
        limits: {
          tokens: Number(requestBody.metadata?.limits?.tokens) || 100,
          requests: Number(requestBody.metadata?.limits?.requests) || 10,
          timeWindowMinutes: Number(requestBody.metadata?.limits?.timeWindowMinutes) || 1
        }
      }
    };
    
    // Ensure the name matches the required pattern ^[a-z0-9-_:]+$
    if (formattedBody.name && !/^[a-z0-9-_:]+$/.test(formattedBody.name)) {
      formattedBody.name = formattedBody.name.replace(/[^a-z0-9-_:]/gi, '-').toLowerCase();
    }
    
    console.log('API Route: Formatted request body:', JSON.stringify(formattedBody, null, 2));
    
    // Send the POST request to the Zuplo API with explicit Content-Type header
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formattedBody),
      cache: 'no-store'
    });
    
    console.log('API Route: Response status:', response.status);
    
    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Route: Error response:', errorText);
      return NextResponse.json(
        { error: `Failed to create consumer: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    // Parse and return the response data
    const data = await response.json();
    console.log('API Route: Successfully created consumer');
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route: Error creating consumer:', error);
    return NextResponse.json(
      { error: 'Failed to create consumer', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
