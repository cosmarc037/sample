import { z } from "zod";

export const azureOpenAIConfigSchema = z.object({
  apiKey: z.string().min(1, "Azure OpenAI API Key is required"),
  endpoint: z.string().url("Valid Azure OpenAI endpoint URL is required"),
  apiVersion: z.string().min(1, "API version is required"),
  deploymentName: z.string().min(1, "Deployment name is required"),
});

export type AzureOpenAIConfig = z.infer<typeof azureOpenAIConfigSchema>;

export const defaultAzureConfig: AzureOpenAIConfig = {
  apiKey: "",
  endpoint: "",
  apiVersion: "2024-02-15-preview",
  deploymentName: "gpt-4o",
};

export interface AzureOpenAIError extends Error {
  status?: number;
  code?: string;
  type?: string;
}