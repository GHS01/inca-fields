export enum Intent {
  GREETING = 'greeting',
  QUESTION = 'question',
  PRICE = 'price',
  AVAILABILITY = 'availability',
  DELIVERY = 'delivery',
  PAYMENT = 'payment',
  PRODUCT = 'product',
  QUALITY = 'quality',
  CONTACT = 'contact',
  UNKNOWN = 'unknown'
}

export interface Entity {
  type: string;
  value: string;
  position: number;
}

export interface KnowledgeSection {
  title: string;
  content: string;
  subsections?: { title: string, content: string }[];
} 