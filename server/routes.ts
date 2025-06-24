import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatRequestSchema } from "@shared/schema";
import { registerAzureConfigRoutes } from "./azure-config-routes";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Register Azure OpenAI configuration routes
  registerAzureConfigRoutes(app);
  // Chat endpoint for PE research queries
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, sessionId } = chatRequestSchema.parse(req.body);
      
      // Store user message
      const userMessage = await storage.addMessage({
        content: message,
        role: "user",
        sessionId,
      });

      // Generate AI response based on the message content
      const assistantResponse = await storage.generatePEResponse(message);
      
      // Store assistant message
      const assistantMessage = await storage.addMessage({
        content: assistantResponse,
        role: "assistant", 
        sessionId,
      });

      res.json({
        userMessage,
        assistantMessage,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Invalid request",
          errors: error.errors 
        });
      } else {
        console.error("Chat error:", error);
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get conversation history
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessagesBySession(sessionId);
      res.json({ messages });
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ 
        message: "Failed to retrieve messages" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
