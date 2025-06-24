import fs from "fs/promises";
import path from "path";
import type { AzureOpenAIConfig } from "@shared/azure-config";
import { azureOpenAIConfigSchema, defaultAzureConfig } from "@shared/azure-config";

const CONFIG_FILE_PATH = path.join(process.cwd(), "azure-config.json");

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AzureOpenAIConfig;

  private constructor() {
    // Initialize with hardcoded credentials
    this.config = {
      apiKey: "EtC80EvTpKYnZL6AA9GGLeXP3KwQx6cXW8vqh769ilXMpVRFznYNJQQJ99BEACHYHv6XJ3w3AAAAACOGwkxo",
      endpoint: "https://ephraimcabanli2640620931.cognitiveservices.azure.com",
      deploymentName: "gpt-4o-mini",
      apiVersion: "2024-12-01-preview"
    };
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async loadConfig(): Promise<AzureOpenAIConfig> {
    try {
      // Return hardcoded credentials instead of loading from external sources
      const hardcodedConfig: AzureOpenAIConfig = {
        apiKey: "EtC80EvTpKYnZL6AA9GGLeXP3KwQx6cXW8vqh769ilXMpVRFznYNJQQJ99BEACHYHv6XJ3w3AAAAACOGwkxo",
        endpoint: "https://ephraimcabanli2640620931.cognitiveservices.azure.com",
        deploymentName: "gpt-4o-mini",
        apiVersion: "2024-12-01-preview"
      };
      
      this.config = hardcodedConfig;
      return this.config;
    } catch (error) {
      console.error("Error loading Azure OpenAI config:", error);
      return this.config;
    }
  }

  private loadFromEnvironment(): Partial<AzureOpenAIConfig> {
    return {
      apiKey: process.env.AZURE_OPENAI_API_KEY || "",
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
      deploymentName: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o",
    };
  }

  private isValidConfig(config: Partial<AzureOpenAIConfig>): boolean {
    try {
      azureOpenAIConfigSchema.parse(config);
      return true;
    } catch {
      return false;
    }
  }

  async saveConfig(config: AzureOpenAIConfig): Promise<void> {
    try {
      const validatedConfig = azureOpenAIConfigSchema.parse(config);
      await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(validatedConfig, null, 2));
      this.config = validatedConfig;
    } catch (error) {
      throw new Error(`Failed to save Azure OpenAI config: ${error}`);
    }
  }

  getConfig(): AzureOpenAIConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<AzureOpenAIConfig>): AzureOpenAIConfig {
    this.config = { ...this.config, ...newConfig };
    return this.config;
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  isConfigured(): boolean {
    // Always return true since we have hardcoded credentials
    return true;
  }
}