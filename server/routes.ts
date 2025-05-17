import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertSubscriberSchema } from "@shared/schema";
import { z } from "zod";
import { handleChatRequest } from "./chatbot";
import { mailerSend } from "./services/mailerSend";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check route
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // API route for contact form submissions
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);

      // Store in memory (optional, can be removed if you only want to use MailerSend)
      const contact = await storage.createContact(validatedData);

      // Send email using MailerSend
      const emailSent = await mailerSend.sendContactFormEmail(validatedData);

      if (emailSent) {
        log('✅ Contact form email sent successfully');
        res.status(201).json({
          success: true,
          message: "Contact message received and email sent",
          contact
        });
      } else {
        log('⚠️ Failed to send contact form email, but data was stored');
        res.status(201).json({
          success: true,
          message: "Contact message received but email could not be sent",
          contact
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, message: "Invalid form data", errors: error.errors });
      } else {
        console.error("Error processing contact form:", error);
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

  // API route for chatbot - versión simplificada
  app.post("/api/chat", async (req, res) => {
    try {
      console.log("Recibida solicitud de chat");
      return await handleChatRequest(req, res);
    } catch (error) {
      console.error("Error en la ruta de chat:", error);
      return res.status(200).json({
        response: "Lo siento, hubo un problema técnico. Por favor, intenta de nuevo."
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
