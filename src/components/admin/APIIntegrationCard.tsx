import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import { APIIntegrationCardProps } from "@/types/api";

export function APIIntegrationCard({ 
  title, 
  description, 
  fields, 
  onSave, 
  isLoading 
}: APIIntegrationCardProps) {
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