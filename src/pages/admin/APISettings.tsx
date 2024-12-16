import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { APIIntegration } from "@/types/api";
import { APIIntegrationCard } from "@/components/admin/APIIntegrationCard";

export default function APISettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [integrations, setIntegrations] = useState<APIIntegration[]>([]);
  const { toast } = useToast();

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

  const apiIntegrations = [
    {
      title: "Google Speech to Text",
      description: "Convert audio to text using Google's Speech-to-Text API",
      fields: [
        { key: "api_key", label: "API Key" },
        { key: "project_id", label: "Project ID" }
      ]
    },
    {
      title: "Google Translate",
      description: "Translate content across multiple languages",
      fields: [
        { key: "api_key", label: "API Key" },
        { key: "project_id", label: "Project ID" }
      ]
    },
    {
      title: "Google Search Console",
      description: "Monitor your site's presence in Google Search results",
      fields: [
        { key: "api_key", label: "API Key" },
        { key: "site_url", label: "Site URL" }
      ]
    },
    {
      title: "Google Meet",
      description: "Create and manage video meetings",
      fields: [
        { key: "client_id", label: "Client ID" },
        { key: "client_secret", label: "Client Secret" }
      ]
    },
    {
      title: "Zoom",
      description: "Create and manage video conferences",
      fields: [
        { key: "api_key", label: "API Key" },
        { key: "api_secret", label: "API Secret" }
      ]
    },
    {
      title: "Razorpay",
      description: "Accept payments using Razorpay payment gateway",
      fields: [
        { key: "key_id", label: "Key ID" },
        { key: "key_secret", label: "Key Secret" }
      ]
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">API Settings</h1>
        <p className="text-gray-500">
          Manage your API integrations and configurations here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {apiIntegrations.map((integration) => (
          <APIIntegrationCard
            key={integration.title}
            {...integration}
            onSave={saveConfiguration}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
