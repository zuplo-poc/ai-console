import { NextRequest, NextResponse } from 'next/server';

// Environment variables
const API_BASE_URL = 'https://dev.zuplo.com/v1';
const DEFAULT_ACCOUNT = process.env.ZUPLO_ACCOUNT || 'bronze_environmental_wren';
const DEFAULT_BUCKET = process.env.ZUPLO_BUCKET || 'zprj-3eldpquvji1nnfahppzlbnwi-working-copy';

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Get the consumer ID from the URL params - use context.params to avoid NextJS error
    const consumerId = context.params.id;
    
    // Parse the request body
    const requestBody = await request.json();
    console.log(`API Route: Updating consumer ${consumerId} with data:`, JSON.stringify(requestBody, null, 2));
    
    // Get the API key from environment variables
    const apiKey = process.env.ZUPLO_API_KEY;
    if (!apiKey) {
      console.error('API Route: Missing API key');
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }
    
    // Construct the URL for the Zuplo API endpoint
    // Use the name from the form as the path parameter
    const consumerPathParam = requestBody.name || consumerId;
    const url = `${API_BASE_URL}/accounts/${DEFAULT_ACCOUNT}/key-buckets/${DEFAULT_BUCKET}/consumers/${consumerPathParam}`;
    console.log('API Route: Sending PATCH request to URL:', url);
    
    // Format the request body to match exactly what the API expects
    // The API requires a name field that matches the pattern ^[a-z0-9-_:]+$
    const formattedBody = {
      // Use the same name as the path parameter
      name: consumerPathParam,
      // Only include the metadata.limits object with numeric values
      metadata: {
        limits: {
          tokens: Number(requestBody.metadata?.limits?.tokens),
          requests: Number(requestBody.metadata?.limits?.requests),
          timeWindowMinutes: Number(requestBody.metadata?.limits?.timeWindowMinutes)
        },
        model: requestBody.metadata?.model || "gpt-4o"
      }
    };
    
    // Ensure the name matches the required pattern ^[a-z0-9-_:]+$
    if (formattedBody.name && !/^[a-z0-9-_:]+$/.test(formattedBody.name)) {
      formattedBody.name = formattedBody.name.replace(/[^a-z0-9-_:]/gi, '-').toLowerCase();
    }
    
    console.log('API Route: Formatted request body:', JSON.stringify(formattedBody, null, 2));
    
    // Send the PATCH request to the Zuplo API with explicit Content-Type header
    const response = await fetch(url, {
      method: 'PATCH',
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
        { error: `Failed to update consumer: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    // Parse and return the response data
    const data = await response.json();
    console.log('API Route: Successfully updated consumer');
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route: Error updating consumer:', error);
    return NextResponse.json(
      { error: 'Failed to update consumer', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Get the consumer ID from the URL params - use context.params to avoid NextJS error
    const consumerId = context.params.id;
    console.log(`API Route: Deleting consumer ${consumerId}`);
    
    // Get the API key from environment variables
    const apiKey = process.env.ZUPLO_API_KEY;
    if (!apiKey) {
      console.error('API Route: Missing API key');
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }
    
    // For DELETE requests, we need to use the consumer name as the final path parameter
    // The ID in the route is actually the consumer name from the UI
    const consumerName = consumerId; // Using the ID from route params as the name
    
    // Construct the URL for the Zuplo API endpoint using the name
    const url = `${API_BASE_URL}/accounts/${DEFAULT_ACCOUNT}/key-buckets/${DEFAULT_BUCKET}/consumers/${consumerName}`;
    console.log('API Route: Sending DELETE request to URL:', url);
    
    // Send the DELETE request to the Zuplo API
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      cache: 'no-store'
    });
    
    console.log('API Route: Response status:', response.status);
    
    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Route: Error response:', errorText);
      return NextResponse.json(
        { error: `Failed to delete consumer: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }
    
    // Return success response
    console.log('API Route: Successfully deleted consumer');
    return NextResponse.json({ success: true, message: `Consumer ${consumerId} deleted successfully` });
  } catch (error) {
    console.error('API Route: Error deleting consumer:', error);
    return NextResponse.json(
      { error: 'Failed to delete consumer', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
