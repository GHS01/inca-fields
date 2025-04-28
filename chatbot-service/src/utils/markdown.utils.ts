import matter from 'gray-matter';
import { KnowledgeSection } from '../types';
import logger from './logger';

export class MarkdownUtils {
  parseMarkdownToSections(markdown: string): KnowledgeSection[] {
    try {
      // Eliminar frontmatter si existe
      const { content } = matter(markdown);
      
      // Dividir por secciones de nivel 2 (##)
      const sections: KnowledgeSection[] = [];
      const sectionRegex = /^## (.+?)$([\s\S]*?)(?=^## |\n$)/gm;
      
      let match;
      while ((match = sectionRegex.exec(content))) {
        const sectionTitle = match[1].trim();
        const sectionContent = match[2].trim();
        
        // Proceso para extraer subsecciones (### títulos)
        const subsections = this.extractSubsections(sectionContent);
        
        // Crear sección
        sections.push({
          title: sectionTitle,
          content: sectionContent,
          subsections: subsections.length > 0 ? subsections : undefined
        });
      }
      
      logger.info(`Markdown procesado: ${sections.length} secciones principales encontradas`);
      return sections;
    } catch (error) {
      logger.error('Error al procesar markdown:', error);
      return [];
    }
  }
  
  private extractSubsections(content: string): { title: string, content: string }[] {
    const subsections: { title: string, content: string }[] = [];
    const subsectionRegex = /^### (.+?)$([\s\S]*?)(?=^### |\n$)/gm;
    
    let match;
    while ((match = subsectionRegex.exec(content))) {
      const title = match[1].trim();
      const subsectionContent = match[2].trim();
      
      subsections.push({
        title,
        content: subsectionContent
      });
    }
    
    return subsections;
  }
} 