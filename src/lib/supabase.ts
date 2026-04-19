import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

const client = createBrowserClient(supabaseUrl, supabaseAnonKey);

// -----------------------------------------------------------------------------
// INSTRUMENTATION RÉSEAU (Audit de Robustesse)
// On intercepte les appels pour détecter la saturation des 6 sockets.
// -----------------------------------------------------------------------------
let activeRequests = 0;

const instrumentedClient = new Proxy(client, {
  get(target: any, prop: string) {
    const original = target[prop];
    
    // On n'instrumente que les points d'entrée de données
    if (prop === 'from' || prop === 'rpc') {
      return (...args: any[]) => {
        const requestId = Math.random().toString(36).substring(7);
        const startTime = Date.now();
        activeRequests++;
        
        if (activeRequests > 5) {
          console.warn(`%c[NET-SATURATION] %cLimite navigateur atteinte (${activeRequests}/6 active). Danger de freeze imminent.`, 
            "color: #ff0000; font-weight: bold; font-size: 14px", 
            "color: #F2EEDD");
        }

        console.log(`%c[NET-QUEUED] %c${prop}(${args[0]}) %c[ID:${requestId}] [Active:${activeRequests}]`, 
          "color: #B59551; font-weight: bold", 
          "color: #F2EEDD", 
          "color: #666");

        const result = original.apply(target, args);

        // On intercepte la résolution de la promesse (then/catch)
        if (result && typeof result.then === 'function') {
          return result.then((res: any) => {
            activeRequests--;
            const duration = Date.now() - startTime;
            console.log(`%c[NET-RESOLVED] %c${prop}(${args[0]}) %c[${duration}ms] [ID:${requestId}]`, 
              "color: #51B57A; font-weight: bold", 
              "color: #F2EEDD", 
              "color: #666");
            return res;
          }).catch((err: any) => {
            activeRequests--;
            console.error(`%c[NET-ERROR] %c${prop}(${args[0]}) %c[ID:${requestId}]`, 
              "color: #B55151; font-weight: bold", 
              "color: #F2EEDD", 
              "color: #666", err);
            throw err;
          });
        }
        return result;
      };
    }
    
    return typeof original === 'function' ? original.bind(target) : original;
  }
});

export const supabase = instrumentedClient;
