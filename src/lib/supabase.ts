import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

const client = createBrowserClient(supabaseUrl, supabaseAnonKey);

// -----------------------------------------------------------------------------
// INSTRUMENTATION RÉSEAU (Audit de Robustesse)
// On intercepte les appels pour détecter la saturation des 6 sockets.
// -----------------------------------------------------------------------------
let activeRequests = 0;

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
          activeRequests++;
          if (activeRequests > 5) {
            console.warn(`%c[NET-SATURATION] %cLimite navigateur atteinte (${activeRequests}/6 active). Danger de freeze imminent.`, 
              "color: #ff0000; font-weight: bold; font-size: 14px", 
              "color: #F2EEDD");
          }
          console.log(`%c[NET-QUEUED] %c${callName} %c[ID:${requestId}] [Active:${activeRequests}]`, 
            "color: #B59551; font-weight: bold", "color: #F2EEDD", "color: #666");

          return original.call(target, 
            (res: any) => {
              activeRequests--;
              const duration = Date.now() - startTime;
              console.log(`%c[NET-RESOLVED] %c${callName} %c[${duration}ms] [Active:${activeRequests}]`, 
                "color: #51B57A; font-weight: bold", "color: #F2EEDD", "color: #666");
              return onfulfilled ? onfulfilled(res) : res;
            }, 
            (err: any) => {
              activeRequests--;
              console.error(`%c[NET-ERROR] %c${callName} %c[ID:${requestId}]`, 
                "color: #B55151; font-weight: bold", "color: #F2EEDD", "color: #666", err);
              return onrejected ? onrejected(err) : Promise.reject(err);
            }
          );
        };
      }

      // 2. Gestion de .abortSignal() (souvent manquant dans certaines versions)
      if (prop === 'abortSignal') {
        if (typeof original === 'function') {
          return (...args: any[]) => proxyBuilder(original.apply(target, args), callName, requestId, startTime);
        } else {
          // Si manquant, on renvoie une fonction "dummy" qui ne fait rien mais empêche le crash
          // On log l'information pour l'audit
          console.debug(`[NET-ROBUST] .abortSignal() polyfilled for ${callName} (original method missing)`);
          return () => proxyBuilder(target, callName, requestId, startTime);
        }
      }

      // 3. Maintenir le chaînage fluide
      if (typeof original === 'function') {
        return (...args: any[]) => {
          const result = original.apply(target, args);
          // Si le résultat est un builder (objet avec select, order, insert, rpc, etc.), on continue de proxifier
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
