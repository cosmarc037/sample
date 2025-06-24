import OpenAI from "openai";
import type { AzureOpenAIConfig, AzureOpenAIError } from "@shared/azure-config";

export class AzureOpenAIClient {
  private client: OpenAI;
  private config: AzureOpenAIConfig;

  constructor(config: AzureOpenAIConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey,
      baseURL: `${config.endpoint}/openai/deployments/${config.deploymentName}`,
      defaultQuery: { 'api-version': config.apiVersion },
      defaultHeaders: {
        'api-key': config.apiKey,
      }
    });
  }

  async createChatCompletion(
    messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
    options: {
      maxTokens?: number;
      temperature?: number;
    } = {}
  ): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.config.deploymentName,
        messages,
        max_tokens: options.maxTokens || 1500,
        temperature: options.temperature || 0.7,
      });

      return response.choices[0].message.content || "";
    } catch (error: any) {
      const azureError: AzureOpenAIError = new Error(
        `Azure OpenAI API Error: ${error.message || 'Unknown error'}`
      );
      azureError.status = error.status;
      azureError.code = error.code;
      azureError.type = error.type;
      throw azureError;
    }
  }

  updateConfig(newConfig: AzureOpenAIConfig) {
    this.config = newConfig;
    this.client = new OpenAI({
      apiKey: newConfig.apiKey,
      baseURL: `${newConfig.endpoint}/openai/deployments/${newConfig.deploymentName}`,
      defaultQuery: { 'api-version': newConfig.apiVersion },
      defaultHeaders: {
        'api-key': newConfig.apiKey,
      }
    });
  }

  getConfig(): AzureOpenAIConfig {
    return { ...this.config };
  }
}