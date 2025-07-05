// Types for the application

export interface ApiKeyMetadata {
  requestLimit?: number;
  tokens?: number;
  timeWindow?: string;
  [key: string]: unknown;
}

export interface ConsumerMetadata {
  [key: string]: unknown;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  metadata?: ApiKeyMetadata;
}

export interface Consumer {
  id: string;
  name: string;
  createdOn: string;
  updatedOn: string;
  description: string | null;
  tags?: {
    account?: string;
    project?: string;
    environmentType?: string;
    [key: string]: unknown;
  };
  metadata?: {
    limits?: {
      budget?: number;
      tokens?: number;
      requests?: number;
      timeWindowMinutes?: number;
    };
    model?: string;
    rateLimit?: number;
    [key: string]: unknown;
  };
}

export interface ApiKeyFormValues {
  name: string;
  requestLimit?: number;
  tokens?: number;
  timeWindow?: string;
  model?: string;
  moneyLimit?: number;
}

export interface ApiKeyUpdateFormValues {
  name?: string;
  requestLimit?: number;
  tokens?: number;
  timeWindow?: string;
  model?: string;
  moneyLimit?: number;
}

export interface ConsumerFormValues {
  name: string;
  metadata?: Record<string, unknown>;
}

export interface ConsumerUpdateFormValues {
  name?: string;
  metadata?: Record<string, unknown>;
}
