import { Json } from "@/integrations/supabase/types";

export interface APIIntegration {
  id: string;
  service_name: string;
  config: Json;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface APIField {
  key: string;
  label: string;
}

export interface APIIntegrationCardProps {
  title: string;
  description: string;
  fields: APIField[];
  onSave: (serviceName: string, config: Record<string, string>) => Promise<void>;
  isLoading: boolean;
}