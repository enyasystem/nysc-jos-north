import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExcoSchema, insertDeveloperSchema, insertEventSchema, insertResourceSchema, insertUiSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Excos routes
  app.get("/api/excos", async (req, res) => {
    try {
      const excos = await storage.getExcos();
      res.json(excos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch excos" });
    }
  });

  app.get("/api/excos/:id", async (req, res) => {
    try {
      const exco = await storage.getExco(req.params.id);
      if (!exco) {
        return res.status(404).json({ message: "Exco not found" });
      }
      res.json(exco);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exco" });
    }
  });

  app.post("/api/excos", async (req, res) => {
    try {
      const result = insertExcoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid exco data", errors: result.error.errors });
      }
      
      const exco = await storage.createExco(result.data);
      res.status(201).json(exco);
    } catch (error) {
      res.status(500).json({ message: "Failed to create exco" });
    }
  });

  app.put("/api/excos/:id", async (req, res) => {
    try {
      const result = insertExcoSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid exco data", errors: result.error.errors });
      }
      
      const exco = await storage.updateExco(req.params.id, result.data);
      if (!exco) {
        return res.status(404).json({ message: "Exco not found" });
      }
      res.json(exco);
    } catch (error) {
      res.status(500).json({ message: "Failed to update exco" });
    }
  });

  app.delete("/api/excos/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteExco(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Exco not found" });
      }
      res.json({ message: "Exco deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete exco" });
    }
  });

  // Developers routes
  app.get("/api/developers", async (req, res) => {
    try {
      const developers = await storage.getDevelopers();
      res.json(developers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch developers" });
    }
  });

  app.get("/api/developers/:id", async (req, res) => {
    try {
      const developer = await storage.getDeveloper(req.params.id);
      if (!developer) {
        return res.status(404).json({ message: "Developer not found" });
      }
      res.json(developer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch developer" });
    }
  });

  app.post("/api/developers", async (req, res) => {
    try {
      const result = insertDeveloperSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid developer data", errors: result.error.errors });
      }
      
      const developer = await storage.createDeveloper(result.data);
      res.status(201).json(developer);
    } catch (error) {
      res.status(500).json({ message: "Failed to create developer" });
    }
  });

  app.put("/api/developers/:id", async (req, res) => {
    try {
      const result = insertDeveloperSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid developer data", errors: result.error.errors });
      }
      
      const developer = await storage.updateDeveloper(req.params.id, result.data);
      if (!developer) {
        return res.status(404).json({ message: "Developer not found" });
      }
      res.json(developer);
    } catch (error) {
      res.status(500).json({ message: "Failed to update developer" });
    }
  });

  app.delete("/api/developers/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDeveloper(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Developer not found" });
      }
      res.json({ message: "Developer deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete developer" });
    }
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const result = insertEventSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid event data", errors: result.error.errors });
      }
      
      const event = await storage.createEvent(result.data);
      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const result = insertEventSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid event data", errors: result.error.errors });
      }
      
      const event = await storage.updateEvent(req.params.id, result.data);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to update event" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEvent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  // Resources routes
  app.get("/api/resources", async (req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  app.get("/api/resources/:id", async (req, res) => {
    try {
      const resource = await storage.getResource(req.params.id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const result = insertResourceSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid resource data", errors: result.error.errors });
      }
      
      const resource = await storage.createResource(result.data);
      res.status(201).json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to create resource" });
    }
  });

  app.put("/api/resources/:id", async (req, res) => {
    try {
      const result = insertResourceSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid resource data", errors: result.error.errors });
      }
      
      const resource = await storage.updateResource(req.params.id, result.data);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to update resource" });
    }
  });

  app.delete("/api/resources/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteResource(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Resource not found" });
      }
      res.json({ message: "Resource deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete resource" });
    }
  });

  // UI Settings routes
  app.get("/api/ui-settings", async (req, res) => {
    try {
      const settings = await storage.getUiSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch UI settings" });
    }
  });

  app.put("/api/ui-settings", async (req, res) => {
    try {
      const result = insertUiSettingsSchema.partial().safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid UI settings data", errors: result.error.errors });
      }
      
      const settings = await storage.updateUiSettings(result.data);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update UI settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
