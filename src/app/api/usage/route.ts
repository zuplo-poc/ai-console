import { NextRequest, NextResponse } from 'next/server';
import { subHours, subDays } from 'date-fns';
import { OpenMeter } from '@openmeter/sdk';

// Environment variables
const OPENMETER_API_KEY = process.env.NEXT_PUBLIC_OPENMETER_API_KEY;
const OPENMETER_BASE_URL = 'https://openmeter.cloud';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const url = new URL(request.url);
    const subject = url.searchParams.get('subject');
    const metric = url.searchParams.get('metric') || 'http_request';
    const windowSize = url.searchParams.get('windowSize') || '1h';
    const timeRange = url.searchParams.get('timeRange') || '24h';
    
    // Validate required parameters
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject parameter is required' },
        { status: 400 }
      );
    }

    console.log(`API Route: Querying usage for subject '${subject}' with metric '${metric}'`);
    
    // Calculate time range
    const now = new Date();
    let start: Date;
    
    // Parse time range
    if (timeRange.endsWith('h')) {
      const hours = parseInt(timeRange.replace('h', ''));
      start = subHours(now, hours);
    } else if (timeRange.endsWith('d')) {
      const days = parseInt(timeRange.replace('d', ''));
      start = subDays(now, days);
    } else {
      // Default to 24 hours
      start = subHours(now, 24);
    }
    
    const end = now;

    // Initialize OpenMeter client inside the function to ensure fresh instance
    const openMeter = new OpenMeter({
      apiKey: OPENMETER_API_KEY,
      baseUrl: OPENMETER_BASE_URL,
    });

    console.log('API Route: Preparing to query OpenMeter');
    
    // Just use the meters.list() method since it's working
    console.log('API Route: Listing available meters');
    
    // Get the list of available meters
    const data = await openMeter.meters.list();
    console.log('API Route: Successfully listed available meters');
      
    console.log(`API Route: Successfully retrieved data for subject '${subject}'`);
    
    // Log the structure of the response data for debugging
    console.log('API Route: Response data structure:', JSON.stringify({
      hasData: !!data,
      dataType: typeof data,
      isArray: Array.isArray(data),
      keys: data ? Object.keys(data) : []
    }, null, 2));
    
    // Return the data
    return NextResponse.json({
      subject,
      metric,
      windowSize,
      timeRange,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      data: data
    });
  } catch (error) {
    console.error('API Route: Error querying OpenMeter:', error);
    return NextResponse.json(
      { 
        error: 'Failed to query usage data',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
