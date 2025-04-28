/**
 * Clase para gestionar múltiples claves API de Gemini con rotación automática
 * cuando una clave alcanza su límite de solicitudes.
 */
export class ApiKeyManager {
  private apiKeys: string[] = [];
  private keyUsage: Map<string, { requests: number, lastRequestTime: number, resetTime: number }> = new Map();
  private currentKeyIndex: number = 0;
  private maxRequestsPerMinute: number = 2; // Límite por clave de Gemini

  /**
   * Constructor del gestor de claves API
   * @param apiKeys Array de claves API de Gemini
   */
  constructor(apiKeys: string[]) {
    // Filtrar claves vacías o inválidas
    this.apiKeys = apiKeys.filter(key => key && key.trim() !== '');
    
    console.log(`ApiKeyManager inicializado con ${this.apiKeys.length} claves API`);
    
    // Inicializar el seguimiento de uso para cada clave
    this.apiKeys.forEach(key => {
      this.keyUsage.set(key, { 
        requests: 0, 
        lastRequestTime: 0,
        resetTime: 0
      });
    });
  }

  /**
   * Obtiene la siguiente clave API disponible
   * @returns La siguiente clave API disponible o null si todas están en su límite
   */
  getNextAvailableKey(): string | null {
    const now = Date.now();
    
    // Si no hay claves configuradas, devolver null
    if (this.apiKeys.length === 0) {
      console.warn('No hay claves API configuradas');
      return null;
    }
    
    // Verificar todas las claves, comenzando desde la actual
    for (let i = 0; i < this.apiKeys.length; i++) {
      const index = (this.currentKeyIndex + i) % this.apiKeys.length;
      const key = this.apiKeys[index];
      const usage = this.keyUsage.get(key)!;
      
      // Reiniciar contador si ha pasado un minuto desde el resetTime
      if (usage.resetTime > 0 && now - usage.resetTime >= 60000) {
        console.log(`Reiniciando contador para la clave API #${index + 1}`);
        usage.requests = 0;
        usage.resetTime = 0;
      }
      
      // Si esta clave no ha alcanzado su límite, usarla
      if (usage.requests < this.maxRequestsPerMinute) {
        this.currentKeyIndex = index;
        console.log(`Usando clave API #${index + 1} (${usage.requests}/${this.maxRequestsPerMinute} solicitudes)`);
        return key;
      }
    }
    
    // Si todas las claves están en su límite, devolver null
    console.warn('Todas las claves API han alcanzado su límite');
    return null;
  }

  /**
   * Registra el uso de una clave API
   * @param key La clave API utilizada
   */
  trackKeyUsage(key: string): void {
    const usage = this.keyUsage.get(key);
    if (usage) {
      usage.requests++;
      usage.lastRequestTime = Date.now();
      
      // Si es la primera solicitud o se ha reiniciado el contador, establecer el resetTime
      if (usage.resetTime === 0) {
        usage.resetTime = usage.lastRequestTime;
      }
      
      console.log(`Solicitud registrada para clave API. Total: ${usage.requests}/${this.maxRequestsPerMinute}`);
      
      // Si alcanzó el límite, mostrar mensaje
      if (usage.requests >= this.maxRequestsPerMinute) {
        const timeUntilReset = 60000 - (Date.now() - usage.resetTime);
        console.log(`Clave API alcanzó su límite. Se reiniciará en ${Math.ceil(timeUntilReset/1000)} segundos`);
      }
    }
  }

  /**
   * Verifica si hay alguna clave API disponible
   * @returns true si hay al menos una clave disponible, false en caso contrario
   */
  hasAvailableKey(): boolean {
    return this.getNextAvailableKey() !== null;
  }

  /**
   * Obtiene el tiempo estimado hasta que una clave esté disponible
   * @returns Tiempo en milisegundos hasta que una clave esté disponible
   */
  getTimeUntilAvailable(): number {
    const now = Date.now();
    let minTimeRemaining = Infinity;
    
    for (const key of this.apiKeys) {
      const usage = this.keyUsage.get(key)!;
      if (usage.requests >= this.maxRequestsPerMinute && usage.resetTime > 0) {
        const timeRemaining = 60000 - (now - usage.resetTime);
        if (timeRemaining > 0 && timeRemaining < minTimeRemaining) {
          minTimeRemaining = timeRemaining;
        }
      } else {
        return 0; // Ya hay una clave disponible
      }
    }
    
    return minTimeRemaining === Infinity ? 0 : minTimeRemaining;
  }

  /**
   * Obtiene el número total de claves API configuradas
   * @returns Número de claves API
   */
  getKeyCount(): number {
    return this.apiKeys.length;
  }
}
