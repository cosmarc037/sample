import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { azureOpenAIConfigSchema, type AzureOpenAIConfig } from "@shared/azure-config";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, TestTube, CheckCircle, XCircle, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AzureConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

interface ConfigStatus {
  isConfigured: boolean;
  config: Partial<AzureOpenAIConfig> | null;
}

export default function AzureConfigModal({ isOpen, onClose, onConfigSaved }: AzureConfigModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({ isConfigured: false, config: null });
  const { toast } = useToast();

  const form = useForm<AzureOpenAIConfig>({
    resolver: zodResolver(azureOpenAIConfigSchema),
    defaultValues: {
      apiKey: "",
      endpoint: "",
      apiVersion: "2024-02-15-preview",
      deploymentName: "gpt-4o",
    },
  });

  useEffect(() => {
    if (isOpen) {
      loadCurrentConfig();
    }
  }, [isOpen]);

  const loadCurrentConfig = async () => {
    try {
      const response = await fetch("/api/azure-config", { credentials: "include" });
      const config = await response.json();
      
      setConfigStatus({
        isConfigured: !!config.apiKey && config.apiKey !== "",
        config: config,
      });

      // Update form with loaded config (except API key for security)
      if (config) {
        form.setValue("endpoint", config.endpoint || "");
        form.setValue("apiVersion", config.apiVersion || "2024-02-15-preview");
        form.setValue("deploymentName", config.deploymentName || "gpt-4o");
      }
    } catch (error) {
      console.error("Failed to load config:", error);
      toast({
        title: "Configuration Error",
        description: "Failed to load current Azure OpenAI configuration",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: AzureOpenAIConfig) => {
    setIsLoading(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/azure-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to save configuration");
      }

      toast({
        title: "Configuration Saved",
        description: "Azure OpenAI configuration has been updated successfully",
      });

      onConfigSaved();
      setConfigStatus({ isConfigured: true, config: values });
    } catch (error) {
      console.error("Failed to save config:", error);
      toast({
        title: "Configuration Error",
        description: "Failed to save Azure OpenAI configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    const formValues = form.getValues();
    
    // Validate form first
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fix the configuration errors before testing",
        variant: "destructive",
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      // Save config first
      const saveResponse = await fetch("/api/azure-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
        credentials: "include",
      });

      if (!saveResponse.ok) {
        throw new Error("Failed to save configuration for testing");
      }

      // Test connection
      const testResponse = await fetch("/api/azure-config/test", {
        method: "POST",
        credentials: "include",
      });

      const result = await testResponse.json();
      setTestResult(result);

      if (result.success) {
        toast({
          title: "Connection Successful",
          description: "Azure OpenAI is configured correctly and responding",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: result.message || "Azure OpenAI connection test failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Test failed:", error);
      setTestResult({
        success: false,
        message: "Failed to test Azure OpenAI connection",
      });
      toast({
        title: "Test Error",
        description: "Failed to test Azure OpenAI connection",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Azure OpenAI Configuration
          </DialogTitle>
          <DialogDescription>
            Configure your Azure OpenAI service settings. All fields are required for the AI chat to function properly.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {configStatus.isConfigured && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Azure OpenAI is currently configured
              </span>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your Azure OpenAI API key"
                      />
                    </FormControl>
                    <FormDescription>
                      Your Azure OpenAI API key from the Azure Portal
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endpoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endpoint URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://your-resource.openai.azure.com"
                      />
                    </FormControl>
                    <FormDescription>
                      Your Azure OpenAI service endpoint URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="apiVersion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Version</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select API version" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2024-02-15-preview">2024-02-15-preview</SelectItem>
                          <SelectItem value="2023-12-01-preview">2023-12-01-preview</SelectItem>
                          <SelectItem value="2023-05-15">2023-05-15</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deploymentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deployment Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="gpt-4o"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {testResult && (
                <div className={`flex items-center gap-2 p-3 border rounded-md ${
                  testResult.success 
                    ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
                }`}>
                  {testResult.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ${
                    testResult.success 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {testResult.message}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={testConnection}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="mr-2 h-4 w-4" />
                      Test Connection
                    </>
                  )}
                </Button>

                <div className="space-x-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Configuration"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}