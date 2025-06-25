import fs from "fs/promises";
import path from "path";
import type { AzureOpenAIConfig } from "@shared/azure-config";
import { azureOpenAIConfigSchema, defaultAzureConfig } from "@shared/azure-config";
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

const CONFIG_FILE_PATH = path.join(process.cwd(), "azure-config.json");

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AzureOpenAIConfig;

  private constructor() {
    // Initialize with default config, will be loaded from Key Vault or environment
    this.config = defaultAzureConfig;
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async loadConfig(): Promise<AzureOpenAIConfig> {
    try {
      // Try to load from Azure Key Vault first
      const keyVaultConfig = await this.loadFromKeyVault();
      if (this.isValidConfig(keyVaultConfig)) {
        this.config = keyVaultConfig as AzureOpenAIConfig;
        return this.config;
      }

      // Fallback to environment variables
      const envConfig = this.loadFromEnvironment();
      if (this.isValidConfig(envConfig)) {
        this.config = envConfig as AzureOpenAIConfig;
        return this.config;
      }

      // Fallback to config file
      const fileConfig = await this.loadFromFile();
      if (this.isValidConfig(fileConfig)) {
        this.config = fileConfig as AzureOpenAIConfig;
        return this.config;
      }

      console.warn("No valid Azure OpenAI configuration found. Using default config.");
      return this.config;
    } catch (error) {
      console.error("Error loading Azure OpenAI config:", error);
      return this.config;
    }
  }

  private async loadFromKeyVault(): Promise<Partial<AzureOpenAIConfig>> {
    try {
      const keyVaultUrl = process.env.AZURE_KEY_VAULT_URL || "https://pe-llm-credentials.vault.azure.net";
      const credential = new DefaultAzureCredential();
      const client = new SecretClient(keyVaultUrl, credential);

      const apiKeySecret = await client.getSecret("AZURE-API-KEY");
      const endpointSecret = await client.getSecret("AZURE-ENDPOINT");
      const deploymentNameSecret = await client.getSecret("AZURE-DEPLOYMENT-NAME");
      const apiVersionSecret = await client.getSecret("AZURE-API-VERSION");

      return {
        apiKey: apiKeySecret.value || "",
        endpoint: endpointSecret.value || "",
        deploymentName: deploymentNameSecret.value || "",
        apiVersion: apiVersionSecret.value || ""
      };
    } catch (error) {
      console.error("Failed to load config from Key Vault:", error);
      return {};
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

  private async loadFromFile(): Promise<Partial<AzureOpenAIConfig>> {
    try {
      if (await this.fileExists(CONFIG_FILE_PATH)) {
        const fileContent = await fs.readFile(CONFIG_FILE_PATH, "utf-8");
        return JSON.parse(fileContent);
      }
    } catch (error) {
      console.error("Failed to load config from file:", error);
    }
    return {};
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
    return this.isValidConfig(this.config);
  }
}