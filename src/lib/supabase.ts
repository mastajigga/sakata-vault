import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

const client = createBrowserClient(supabaseUrl, supabaseAnonKey);

// -----------------------------------------------------------------------------
// TRAFFIC CONTROL & INSTRUMENTATION (Audit de Robustesse)
// -----------------------------------------------------------------------------
const MAX_CONCURRENT = 4; // On laisse 2 sockets libres pour l'Auth et les Assets
let activeRequests = 0;
const requestQueue: Array<{ resolve: () => void; callName: string; isPriority: boolean }> = [];

function releaseRequest() {
  activeRequests--;
  if (requestQueue.length > 0) {
    // Priorité aux requêtes critiques (ex: profiles pour l'auth)
    const nextIndex = requestQueue.findIndex(q => q.isPriority);
    const next = nextIndex !== -1 
      ? requestQueue.splice(nextIndex, 1)[0] 
      : requestQueue.shift();
    
    if (next) {
      activeRequests++;
      next.resolve();
    }
  }
}

async function acquireRequest(callName: string, isPriority = false) {
  if (activeRequests < MAX_CONCURRENT) {
    activeRequests++;
    return;
  }
  
  return new Promise<void>(resolve => {
    if (requestQueue.length > 5) {
      console.warn(`[NET-SATURATION] File d'attente Supabase: ${requestQueue.length}`);
    }
    requestQueue.push({ resolve, callName, isPriority });
  });
}

/**
 * Proxifie un builder Supabase (Postgrest) pour intercepter .then() et .abortSignal()
 */
function proxyBuilder(builder: any, callName: string, requestId: string, startTime: number): any {
  return new Proxy(builder, {
    get(target: any, prop: string) {
      const original = target[prop];

      // 1. Intercepter le déclenchement de la requête
      if (prop === 'then') {
        return (onfulfilled: any, onrejected: any) => {
          const isPriority = callName.includes("profiles");
          
          return acquireRequest(callName, isPriority).then(() => {
            return original.call(target, 
              (res: any) => {
                releaseRequest();
                return onfulfilled ? onfulfilled(res) : res;
              }, 
              (err: any) => {
                releaseRequest();
                console.error(`%c[NET-ERROR] %c${callName} %c[ID:${requestId}]`, 
                  "color: #B55151; font-weight: bold", "color: #F2EEDD", "color: #666", err);
                return onrejected ? onrejected(err) : Promise.reject(err);
              }
            );
          });
        };
      }

      // 2. Gestion de .abortSignal()
      if (prop === 'abortSignal') {
        if (typeof original === 'function') {
          return (...args: any[]) => proxyBuilder(original.apply(target, args), callName, requestId, startTime);
        } else {
          console.debug(`[NET-ROBUST] .abortSignal() dummy for ${callName}`);
          return () => proxyBuilder(target, callName, requestId, startTime);
        }
      }

      // 3. Maintenir le chaînage
      if (typeof original === 'function') {
        return (...args: any[]) => {
          const result = original.apply(target, args);
          if (result && typeof result === 'object' && (result.then || result.select || result.insert)) {
            return proxyBuilder(result, callName, requestId, startTime);
          }
          return result;
        };
      }

      return original;
    }
  });
}

const instrumentedClient = new Proxy(client, {
  get(target: any, prop: string) {
    const original = target[prop];
    
    if (prop === 'from' || prop === 'rpc') {
      return (...args: any[]) => {
        const result = original.apply(target, args);
        const requestId = Math.random().toString(36).substring(7);
        const callName = `${prop}(${args[0]})`;
        return proxyBuilder(result, callName, requestId, Date.now());
      };
    }
    
    return typeof original === 'function' ? original.bind(target) : original;
  }
});

export const supabase = instrumentedClient;
export const supabasePublic = instrumentedClient;
