import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface APIIntegration {
  id: string;
  service_name: string;
  config: Record<string, string>;
  is_active: boolean;
}

export default function APISettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const { toast } = useToast();

  // Fetch existing integrations
  const fetchIntegrations = async () => {
    try {
      const { data, error } = await supabase
        .from('api_integrations')
        .select('*');

      if (error) throw error;
      setIntegrations(data || []);
    } catch (error) {
      console.error('Error fetching integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load API integrations",
        variant: "destructive",
      });
    }
  };

  // Save API configuration
  const saveConfiguration = async (serviceName: string, config: Record<string, string>) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('api_integrations')
        .upsert({
          service_name: serviceName,
          config: config,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${serviceName} configuration saved successfully`,
      });
      
      await fetchIntegrations();
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle API status
  const toggleAPIStatus = async (integration: APIIntegration) => {
    try {
      const { error } = await supabase
        .from('api_integrations')
        .update({ is_active: !integration.is_active })
        .eq('id', integration.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${integration.service_name} ${integration.is_active ? 'disabled' : 'enabled'} successfully`,
      });
      
      await fetchIntegrations();
    } catch (error) {
      console.error('Error toggling API status:', error);
      toast({
        title: "Error",
        description: "Failed to update API status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">API Settings</h1>
        <p className="text-gray-500">
          Manage your API integrations and configurations here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Google Speech to Text */}
        <APIIntegrationCard
          title="Google Speech to Text"
          description="Convert audio to text using Google's Speech-to-Text API"
          fields={[
            { key: "api_key", label: "API Key" },
            { key: "project_id", label: "Project ID" }
          ]}
          onSave={saveConfiguration}
          isLoading={isLoading}
        />

        {/* Google Translate */}
        <APIIntegrationCard
          title="Google Translate"
          description="Translate content across multiple languages"
          fields={[
            { key: "api_key", label: "API Key" },
            { key: "project_id", label: "Project ID" }
          ]}
          onSave={saveConfiguration}
          isLoading={isLoading}
        />

        {/* Google Search Console */}
        <APIIntegrationCard
          title="Google Search Console"
          description="Monitor your site's presence in Google Search results"
          fields={[
            { key: "api_key", label: "API Key" },
            { key: "site_url", label: "Site URL" }
          ]}
          onSave={saveConfiguration}
          isLoading={isLoading}
        />

        {/* Google Meet */}
        <APIIntegrationCard
          title="Google Meet"
          description="Create and manage video meetings"
          fields={[
            { key: "client_id", label: "Client ID" },
            { key: "client_secret", label: "Client Secret" }
          ]}
          onSave={saveConfiguration}
          isLoading={isLoading}
        />

        {/* Zoom */}
        <APIIntegrationCard
          title="Zoom"
          description="Create and manage video conferences"
          fields={[
            { key: "api_key", label: "API Key" },
            { key: "api_secret", label: "API Secret" }
          ]}
          onSave={saveConfiguration}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

interface APIIntegrationCardProps {
  title: string;
  description: string;
  fields: Array<{ key: string; label: string }>;
  onSave: (serviceName: string, config: Record<string, string>) => Promise<void>;
  isLoading: boolean;
}

function APIIntegrationCard({ title, description, fields, onSave, isLoading }: APIIntegrationCardProps) {
  const [config, setConfig] = useState<Record<string, string>>({});

  const handleSave = () => {
    onSave(title, config);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Switch />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <label htmlFor={field.key} className="text-sm font-medium">
              {field.label}
            </label>
            <Input
              id={field.key}
              type="password"
              value={config[field.key] || ''}
              onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
            />
          </div>
        ))}
        <Button 
          onClick={handleSave} 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}