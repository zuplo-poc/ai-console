import { NextRequest, NextResponse } from 'next/server';
import { OpenMeter } from '@openmeter/sdk';

// Environment variables
const OPENMETER_API_KEY = process.env.OPENMETER_API_KEY;
const OPENMETER_BASE_URL = 'https://openmeter.cloud';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const subject = url.searchParams.get('subject');
    
    // Validate required parameters
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject parameter is required' },
        { status: 400 }
      );
    }

    console.log(`API Route: Querying model usage for subject '${subject}'`);
    
    // Set fixed time range for the query (as specified in the requirements)
    const from = '2025-06-04T07:00:00.000Z';
    const to = '2025-07-04T07:00:00.000Z';
    const windowSize = 'DAY';
    const windowTimeZone = 'America/Los_Angeles';
    
    // Initialize OpenMeter client
    const openMeter = new OpenMeter({
      apiKey: OPENMETER_API_KEY,
      baseUrl: OPENMETER_BASE_URL,
    });

    console.log('API Route: Preparing to query OpenMeter for model usage');
    
    // Query usage data for the specific meter and subject, grouped by model
    console.log(`API Route: Querying model usage data for meter 'tokens_total' and subject '${subject}'`);
    
    // Query usage data for the specified meter using the proper method signature
    const data = await openMeter.meters.query(
      'tokens_total', // meterId or slug
      {
        from,
        to,
        windowSize: windowSize as "DAY",
        subject: [subject], // Pass subject as an array as required by the API
        groupBy: ['model'], // Group by model
        windowTimeZone
      }
    );
    
    console.log(`API Route: Successfully retrieved model usage data for subject '${subject}'`);
    
    // Return the data
    return NextResponse.json({
      subject,
      metric: 'tokens_total',
      windowSize,
      startTime: from,
      endTime: to,
      data
    });
  } catch (error) {
    console.error('API Route: Error querying OpenMeter for model usage:', error);
    return NextResponse.json(
      { 
        error: 'Failed to query model usage data',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
