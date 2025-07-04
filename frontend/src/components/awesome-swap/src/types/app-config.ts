export interface AppConfig {
  name: string;
  description: string;
  version: string;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
  };
} 