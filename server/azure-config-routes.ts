import type { Express } from "express";
import { azureOpenAIConfigSchema, type AzureOpenAIConfig } from "@shared/azure-config";
import { storage } from "./storage";
import { z } from "zod";

export function registerAzureConfigRoutes(app: Express) {
  // Get current Azure OpenAI configuration
  app.get("/api/azure-config", async (req, res) => {
    try {
      const config = storage.getAzureConfig();
      // Don't expose the API key in the response for security
      const safeConfig = {
        ...config,
        apiKey: config.apiKey ? "***CONFIGURED***" : "",
      };
      res.json(safeConfig);
    } catch (error) {
      console.error("Error getting Azure config:", error);
      res.status(500).json({ 
        message: "Failed to retrieve Azure OpenAI configuration" 
      });
    }
  });

  // Update Azure OpenAI configuration
  app.post("/api/azure-config", async (req, res) => {
    try {
      const validatedConfig = azureOpenAIConfigSchema.parse(req.body);
      await storage.updateAzureConfig(validatedConfig);
      
      res.json({
        message: "Azure OpenAI configuration updated successfully",
        config: {
          ...validatedConfig,
          apiKey: "***CONFIGURED***", // Don't expose API key
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid configuration",
          errors: error.errors 
        });
      } else {
        console.error("Error updating Azure config:", error);
        res.status(500).json({ 
          message: "Failed to update Azure OpenAI configuration" 
        });
      }
    }
  });

  // Test Azure OpenAI connection
  app.post("/api/azure-config/test", async (req, res) => {
    try {
      const testMessage = "Hello, this is a test message. Please respond with 'Connection successful'.";
      const response = await storage.generatePEResponse(testMessage);
      
      if (response && !response.includes("technical difficulties")) {
        res.json({
          success: true,
          message: "Azure OpenAI connection test successful",
          response: response.substring(0, 200) + "..."
        });
      } else {
        res.json({
          success: false,
          message: "Azure OpenAI connection test failed - using fallback response"
        });
      }
    } catch (error) {
      console.error("Azure OpenAI test error:", error);
      res.status(500).json({
        success: false,
        message: "Azure OpenAI connection test failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}