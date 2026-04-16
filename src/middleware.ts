import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Routes que les utilisateurs non authentifiés ne doivent pas atteindre
const PROTECTED_ROUTES = [
  "/forum",
  "/membres",
  "/chat",
  "/ecole",
  "/geographie",
  "/profil",
  "/contributeur",
  "/admin",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si la route est protégée
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    const supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Vérifier la session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Rediriger vers /auth avec redirect_to pour revenir à la page demandée
      const loginUrl = new URL("/auth", request.url);
      loginUrl.searchParams.set("redirect_to", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("Middleware error:", error);
    // En cas d'erreur, rediriger vers l'auth par sécurité
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect_to", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
