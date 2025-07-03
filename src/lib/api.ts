// API service for interacting with Zuplo API Keys and Consumers
// Documentation: 
// - API Keys: https://zuplo.com/docs/api/api-keys-keys
// - Consumers: https://zuplo.com/docs/api/api-keys-consumers
//
// This service implements the Zuplo API endpoints for managing API keys and consumers
// including listing, creating, updating, deleting, and rolling keys.

import { Consumer } from "./types";

// Environment variables and constants
const API_BASE_URL = '/api/consumers';
const DEFAULT_ACCOUNT = 'ai-gateway-prototype';
const DEFAULT_BUCKET = 'zprj-jkbnlgztocnahrbabinyeact-production';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  metadata?: {
    requestLimit?: number;
    tokens?: number;
    timeWindow?: string;
    [key: string]: unknown;
  };
}

export interface ApiKeyCreateRequest {
  name: string;
  metadata?: {
    requestLimit?: number;
    tokens?: number;
    timeWindow?: string;
    [key: string]: unknown;
  };
}

export interface ApiKeyUpdateRequest {
  name?: string;
  metadata?: {
    requestLimit?: number;
    tokens?: number;
    timeWindow?: string;
    [key: string]: unknown;
  };
}

// Define the request types based on the API documentation
export interface ConsumerCreateRequest {
  name: string;
  managers?: string[];
  description?: string;
  tags?: Record<string, unknown>;
  metadata?: {
    limits?: {
      tokens?: number;
      requests?: number;
      timeWindowMinutes?: number;
    };
    rateLimit?: number;
    [key: string]: unknown;
  };
}

export interface ConsumerUpdateRequest {
  name?: string;
  metadata?: {
    limits?: {
      tokens?: number;
      requests?: number;
      timeWindowMinutes?: number;
    };
    rateLimit?: number;
    [key: string]: unknown;
  };
}

// API service for interacting with Zuplo API Keys and Consumers via Next.js API routes
// This approach avoids CORS issues by proxying requests through our own API routes

// API functions
export const apiService = {
  // Fetch model usage data for a specific application
  async getModelUsageData(subject: string): Promise<{
    subject: string;
    metric: string;
    windowSize: string;
    startTime: string;
    endTime: string;
    data: any;
  }> {
    try {
      const url = `/api/model-usage?subject=${encodeURIComponent(subject)}`;
      console.log('Fetching model usage data from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching model usage data:', error);
      throw error;
    }
  },

  // Fetch usage data for a specific application
  async getUsageData(subject: string, metric: string = 'tokens_total', timeRange: string = '30d', windowSize: string = 'DAY'): Promise<{
    subject: string;
    metric: string;
    windowSize: string;
    timeRange: string;
    startTime: string;
    endTime: string;
    data: {
      data: Array<{
        groupBy: Record<string, unknown>;
        subject: string;
        value: number;
        windowEnd: string;
        windowStart: string;
      }>;
      from: string;
      to: string;
      windowSize: string;
    };
  }> {
    try {
      const url = `/api/usage?subject=${encodeURIComponent(subject)}&metric=${encodeURIComponent(metric)}&timeRange=${encodeURIComponent(timeRange)}&windowSize=${encodeURIComponent(windowSize)}`;
      console.log('Fetching usage data from:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching usage data:', error);
      throw error;
    }
  },
  // Using the consumer listing endpoint via our Next.js API route to avoid CORS issues
  async getAllKeys(): Promise<Consumer[]> {
    try {
      // Call our local API route instead of the Zuplo API directly
      const url = '/api/consumers';
      console.log('Fetching from local API route:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        // Ensure we're not using cache
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      // The API returns data in the format: { data: Consumer[], offset: number, limit: number }
      if (data && data.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching consumers:', error);
      throw error;
    }
  },

  async getKey(id: string): Promise<ApiKey> {
    // This method is kept for backward compatibility
    // but is not used in the consumer implementation
    console.warn('getKey is not implemented for consumers');
    return {} as ApiKey;
  },

  async createKey(data: ApiKeyCreateRequest): Promise<ApiKey> {
    // This method is kept for backward compatibility
    // but is not used in the consumer implementation
    console.warn('createKey is not implemented for consumers');
    return {} as ApiKey;
  },

  async updateKey(id: string, data: ApiKeyUpdateRequest): Promise<ApiKey> {
    // This method is kept for backward compatibility
    // but is not used in the consumer implementation
    console.warn('updateKey is not implemented for consumers');
    return {} as ApiKey;
  },

  async deleteKey(id: string): Promise<void> {
    // This method is kept for backward compatibility
    // but is not used in the consumer implementation
    console.warn('deleteKey is not implemented for consumers');
    return;
  },

  async rollKey(id: string): Promise<ApiKey> {
    // This method is kept for backward compatibility
    // but is not used in the consumer implementation
    console.warn('rollKey is not implemented for consumers');
    return {} as ApiKey;
  },

  // Consumer management functions
  async getAllConsumers(): Promise<Consumer[]> {
    // This is the same as getAllKeys - just an alias for better naming
    return this.getAllKeys();
  },

  async getConsumer(id: string): Promise<Consumer> {
    try {
      const url = `${API_BASE_URL}/accounts/${DEFAULT_ACCOUNT}/key-buckets/${DEFAULT_BUCKET}/consumers/${id}`;
      console.log('Fetching consumer from URL:', url);
      
      const options = {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      };
      
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      console.error('Error fetching consumer:', error);
      throw error;
    }
  },

  async createConsumer(data: ConsumerCreateRequest): Promise<{ consumer: Consumer; apiKey?: string }> {
    try {
      // Use our local API route instead of calling Zuplo API directly
      const url = '/api/consumers';
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create consumer: ${response.status} ${response.statusText}\nDetails: ${errorText}`);
      }
      
      const responseData = await response.json();
      
      // Extract the API key from the response if it exists
      // Based on the actual response structure we know the key is in apiKeys[0].key
      let apiKey: string | undefined;
      
      if (responseData && 
          responseData.apiKeys && 
          Array.isArray(responseData.apiKeys) && 
          responseData.apiKeys.length > 0 && 
          responseData.apiKeys[0].key) {
        apiKey = responseData.apiKeys[0].key;
        console.log('API Service: Successfully extracted API key:', apiKey);
      } else {
        console.log('API Service: No API key found in response');
      }
      
      return { consumer: responseData, apiKey };
    } catch (error) {
      console.error('Error creating consumer:', error);
      throw error;
    }
  },

  async updateConsumer(id: string, data: ConsumerUpdateRequest): Promise<Consumer> {
    try {
      // Call our local API route instead of the Zuplo API directly
      const url = `/api/consumers/${id}`;
      console.log('Updating consumer via local API route:', url);
      
      const options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      };
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating consumer:', error);
      throw error;
    }
  },

  async deleteConsumer(id: string, name: string): Promise<void> {
    try {
      // Call our local API route instead of the Zuplo API directly
      // Use the consumer name as the path parameter, not the ID
      const url = `/api/consumers/${name}`;
      console.log('Deleting consumer via local API route:', url);
      
      const options: RequestInit = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store' as RequestCache
      };
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      // For DELETE operations, we don't need to return data
      // Just checking if the operation was successful is enough
    } catch (error) {
      console.error('Error deleting consumer:', error);
      throw error;
    }
  },
};
