import { 
  type User, 
  type InsertUser, 
  type Exco, 
  type InsertExco, 
  type Developer, 
  type InsertDeveloper, 
  type Event, 
  type InsertEvent, 
  type Resource, 
  type InsertResource, 
  type UiSettings, 
  type InsertUiSettings 
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Excos
  getExcos(): Promise<Exco[]>;
  getExco(id: string): Promise<Exco | undefined>;
  createExco(exco: InsertExco): Promise<Exco>;
  updateExco(id: string, exco: Partial<InsertExco>): Promise<Exco | undefined>;
  deleteExco(id: string): Promise<boolean>;

  // Developers
  getDevelopers(): Promise<Developer[]>;
  getDeveloper(id: string): Promise<Developer | undefined>;
  createDeveloper(developer: InsertDeveloper): Promise<Developer>;
  updateDeveloper(id: string, developer: Partial<InsertDeveloper>): Promise<Developer | undefined>;
  deleteDeveloper(id: string): Promise<boolean>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;

  // Resources
  getResources(): Promise<Resource[]>;
  getResource(id: string): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  updateResource(id: string, resource: Partial<InsertResource>): Promise<Resource | undefined>;
  deleteResource(id: string): Promise<boolean>;

  // UI Settings
  getUiSettings(): Promise<UiSettings>;
  updateUiSettings(settings: Partial<InsertUiSettings>): Promise<UiSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private excos: Map<string, Exco>;
  private developers: Map<string, Developer>;
  private events: Map<string, Event>;
  private resources: Map<string, Resource>;
  private uiSettings: UiSettings;

  constructor() {
    this.users = new Map();
    this.excos = new Map();
    this.developers = new Map();
    this.events = new Map();
    this.resources = new Map();
    
    // Initialize default UI settings
    this.uiSettings = {
      id: randomUUID(),
      primaryColor: "#006600",
      secondaryColor: "#C3B091", 
      accentColor: "#FFD700",
      logoUrl: null,
      siteTitle: "NYSC Jos North - Official Biodata Portal",
      siteDescription: "Official portal for NYSC Jos North operations and management",
      contactEmail: "contact@nyscjosnorth.gov.ng",
      updatedAt: new Date(),
    };

    // Initialize with some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample Excos
    const sampleExcos: InsertExco[] = [
      {
        name: "Adamu Jibril",
        position: "State Coordinator",
        email: "adamu.jibril@nysc.gov.ng",
        phone: "+234 803 XXX 1234",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isActive: true,
      },
      {
        name: "Fatima Musa",
        position: "Assistant Coordinator",
        email: "fatima.musa@nysc.gov.ng", 
        phone: "+234 803 XXX 5678",
        imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        isActive: true,
      },
      {
        name: "Michael Chen",
        position: "Secretary",
        email: "michael.chen@nysc.gov.ng",
        phone: "+234 803 XXX 9012",
        imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        isActive: true,
      },
    ];

    sampleExcos.forEach(exco => this.createExco(exco));

    // Sample Developers
    const sampleDevelopers: InsertDeveloper[] = [
      {
        name: "Alex Rivera",
        email: "alex.rivera@email.com",
        role: "Full Stack Developer",
        skills: ["React", "Node.js", "TypeScript"],
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Emily Zhang",
        email: "emily.zhang@email.com", 
        role: "Frontend Developer",
        skills: ["Vue.js", "CSS", "JavaScript"],
        status: "active",
        imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
    ];

    sampleDevelopers.forEach(dev => this.createDeveloper(dev));

    // Sample Events
    const sampleEvents: InsertEvent[] = [
      {
        title: "Community Outreach Program",
        description: "Join us for our monthly community development initiative in Jos North communities.",
        date: "2024-12-15",
        time: "08:00 - 16:00",
        location: "Jos North LGA",
        category: "Community Service",
        imageUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=300&fit=crop",
        status: "published",
      },
      {
        title: "Skills Development Workshop",
        description: "Enhance your professional skills with our comprehensive training program.",
        date: "2024-12-20",
        time: "09:00 - 16:00",
        location: "Training Center",
        category: "Training",
        imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop",
        status: "published",
      },
      {
        title: "Annual Cultural Festival",
        description: "Celebrate Nigeria's rich cultural heritage with music, dance, and traditional cuisine.",
        date: "2024-12-25",
        time: "10:00 - 18:00",
        location: "Cultural Center",
        category: "Cultural",
        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=300&fit=crop",
        status: "published",
      },
    ];

    sampleEvents.forEach(event => this.createEvent(event));

    // Sample Resources
    const sampleResources: InsertResource[] = [
      {
        title: "NYSC Handbook 2024",
        description: "Complete guide for corps members",
        category: "Documents",
        fileUrl: "/documents/nysc-handbook-2024.pdf",
        fileType: "PDF",
        fileSize: "2.3 MB",
      },
      {
        title: "Service Certificate Form",
        description: "Official service certificate application form",
        category: "Forms",
        fileUrl: "/documents/service-cert-form.pdf", 
        fileType: "PDF",
        fileSize: "145 KB",
      },
      {
        title: "Leadership Training Module",
        description: "Video training on leadership skills",
        category: "Videos",
        fileUrl: "/videos/leadership-training.mp4",
        fileType: "MP4", 
        fileSize: "45.2 MB",
      },
    ];

    sampleResources.forEach(resource => this.createResource(resource));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Exco methods
  async getExcos(): Promise<Exco[]> {
    return Array.from(this.excos.values());
  }

  async getExco(id: string): Promise<Exco | undefined> {
    return this.excos.get(id);
  }

  async createExco(insertExco: InsertExco): Promise<Exco> {
    const id = randomUUID();
    const exco: Exco = { 
      ...insertExco,
      phone: insertExco.phone || null,
      imageUrl: insertExco.imageUrl || null,
      isActive: insertExco.isActive ?? true,
      id, 
      createdAt: new Date() 
    };
    this.excos.set(id, exco);
    return exco;
  }

  async updateExco(id: string, updateData: Partial<InsertExco>): Promise<Exco | undefined> {
    const exco = this.excos.get(id);
    if (!exco) return undefined;
    
    const updatedExco = { ...exco, ...updateData };
    this.excos.set(id, updatedExco);
    return updatedExco;
  }

  async deleteExco(id: string): Promise<boolean> {
    return this.excos.delete(id);
  }

  // Developer methods
  async getDevelopers(): Promise<Developer[]> {
    return Array.from(this.developers.values());
  }

  async getDeveloper(id: string): Promise<Developer | undefined> {
    return this.developers.get(id);
  }

  async createDeveloper(insertDeveloper: InsertDeveloper): Promise<Developer> {
    const id = randomUUID();
    const developer: Developer = { 
      ...insertDeveloper,
      status: insertDeveloper.status || "active",
      imageUrl: insertDeveloper.imageUrl || null,
      skills: insertDeveloper.skills || null,
      id, 
      createdAt: new Date() 
    };
    this.developers.set(id, developer);
    return developer;
  }

  async updateDeveloper(id: string, updateData: Partial<InsertDeveloper>): Promise<Developer | undefined> {
    const developer = this.developers.get(id);
    if (!developer) return undefined;
    
    const updatedDeveloper = { ...developer, ...updateData };
    this.developers.set(id, updatedDeveloper);
    return updatedDeveloper;
  }

  async deleteDeveloper(id: string): Promise<boolean> {
    return this.developers.delete(id);
  }

  // Event methods
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: string): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = randomUUID();
    const event: Event = { 
      ...insertEvent,
      status: insertEvent.status || "draft",
      imageUrl: insertEvent.imageUrl || null,
      id, 
      createdAt: new Date() 
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: string, updateData: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...updateData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: string): Promise<boolean> {
    return this.events.delete(id);
  }

  // Resource methods
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async getResource(id: string): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = randomUUID();
    const resource: Resource = { 
      ...insertResource,
      description: insertResource.description || null,
      fileUrl: insertResource.fileUrl || null,
      fileSize: insertResource.fileSize || null,
      id, 
      createdAt: new Date() 
    };
    this.resources.set(id, resource);
    return resource;
  }

  async updateResource(id: string, updateData: Partial<InsertResource>): Promise<Resource | undefined> {
    const resource = this.resources.get(id);
    if (!resource) return undefined;
    
    const updatedResource = { ...resource, ...updateData };
    this.resources.set(id, updatedResource);
    return updatedResource;
  }

  async deleteResource(id: string): Promise<boolean> {
    return this.resources.delete(id);
  }

  // UI Settings methods
  async getUiSettings(): Promise<UiSettings> {
    return this.uiSettings;
  }

  async updateUiSettings(updateData: Partial<InsertUiSettings>): Promise<UiSettings> {
    this.uiSettings = { 
      ...this.uiSettings, 
      ...updateData, 
      updatedAt: new Date() 
    };
    return this.uiSettings;
  }
}

export const storage = new MemStorage();
