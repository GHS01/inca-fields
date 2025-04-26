import { users, type User, type InsertUser, type Contact, type InsertContact, type Subscriber, type InsertSubscriber } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContact(contact: InsertContact): Promise<Contact>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private contacts: Map<number, Contact>;
  private subscribers: Map<number, Subscriber>;
  userCurrentId: number;
  contactCurrentId: number;
  subscriberCurrentId: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.subscribers = new Map();
    this.userCurrentId = 1;
    this.contactCurrentId = 1;
    this.subscriberCurrentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.contactCurrentId++;
    const contact: Contact = { ...insertContact, id };
    this.contacts.set(id, contact);
    return contact;
  }

  async createSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    // Check if email already exists to simulate unique constraint
    const emailExists = Array.from(this.subscribers.values()).some(
      (sub) => sub.email === insertSubscriber.email
    );
    
    if (emailExists) {
      throw new Error("Email must be unique");
    }
    
    const id = this.subscriberCurrentId++;
    const subscriber: Subscriber = { ...insertSubscriber, id };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
}

export const storage = new MemStorage();
