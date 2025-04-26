import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertSubscriberSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API route for contact form submissions
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json({ success: true, message: "Contact message received", contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid form data", errors: error.errors });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({ success: false, message: "Error processing contact form" });
      }
    }
  });

  // API route for newsletter subscriptions
  app.post("/api/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      const subscriber = await storage.createSubscriber(validatedData);
      res.status(201).json({ success: true, message: "Successfully subscribed", subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid email", errors: error.errors });
      } else if (error instanceof Error && error.message.includes("unique")) {
        res.status(409).json({ success: false, message: "Email already subscribed" });
      } else {
        console.error("Error creating subscriber:", error);
        res.status(500).json({ success: false, message: "Error processing subscription" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
