export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta || '')
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, error || '')
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta || '')
  },
  audit: (event: string, data?: any) => {
    console.log(`[AUDIT] ${new Date().toISOString()}: ${event}`, data || '')
  }
} 