// CLIENT-SIDE ADAPTER
// In this serverless environment, this client handles missing endpoints gracefully.

const API_BASE = ''; 

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
};

export const apiFetch = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  console.warn(`[MockAPI] Call intercepted to ${path}. Ensure the service is mocked correctly.`);
  
  // Prevent crash by returning a promise that rejects controlled or resolves empty
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          console.error(`[MockAPI] 404 Not Found (Simulated): ${path}`);
          // Rejecting here might still cause uncaught promise errors if not handled.
          // For safety in this demo, we can resolve with an empty object cast as T, 
          // or reject if we are sure the caller handles it.
          reject(new Error(`Endpoint ${path} not available in Client-Only mode.`));
      }, 500);
  });
};