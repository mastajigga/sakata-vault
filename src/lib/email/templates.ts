// Email Templates with Sakata branding
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sakata.com';

export const emailTemplates = {
  updateNotification: (userName: string, updates: string[]) => ({
    subject: "🌍 Sakata — Mises à Jour Majeures de Phase 2",
    html: `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Outfit', sans-serif; background: #050B08; color: #E9DCC9; }
          .container { max-width: 600px; margin: 0 auto; background: #0F1410; border: 1px solid #C16B34; border-radius: 8px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #C16B34 0%, #9B4F24 100%); padding: 32px 24px; text-align: center; }
          .header h1 { margin: 0; font-size: 28px; color: #E9DCC9; font-weight: 700; letter-spacing: -0.5px; }
          .header p { margin: 8px 0 0 0; color: rgba(233, 220, 201, 0.8); font-size: 14px; }
          .content { padding: 32px 24px; }
          .greeting { font-size: 18px; margin-bottom: 24px; color: #E9DCC9; }
          .update-section { margin: 24px 0; padding: 16px; background: rgba(193, 107, 52, 0.1); border-left: 4px solid #C16B34; border-radius: 4px; }
          .update-title { font-size: 16px; font-weight: 600; color: #C16B34; margin-bottom: 12px; }
          .update-list { margin: 0; padding-left: 20px; }
          .update-list li { margin: 8px 0; color: #D4C5B0; font-size: 14px; line-height: 1.6; }
          .cta { text-align: center; margin: 32px 0; }
          .cta-button { display: inline-block; background: #C16B34; color: #050B08; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; transition: background 0.3s; }
          .cta-button:hover { background: #9B4F24; }
          .footer { padding: 24px; background: rgba(193, 107, 52, 0.05); border-top: 1px solid #C16B34; text-align: center; font-size: 12px; color: rgba(233, 220, 201, 0.6); }
          .footer a { color: #C16B34; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌍 SAKATA</h1>
            <p>Patrimoine Sakata — Brume de la Rivière</p>
          </div>

          <div class="content">
            <div class="greeting">
              Bonjour <strong>${userName}</strong>,
            </div>

            <p style="color: #D4C5B0; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Nous sommes heureux de vous annoncer des mises à jour majeures de Phase 2 pour la plateforme Sakata. Ces améliorations renforcent la sécurité, les performances et l'expérience utilisateur.
            </p>

            ${updates.map(update => `
              <div class="update-section">
                ${update}
              </div>
            `).join('')}

            <div class="cta">
              <a href="${SITE_URL}/help/changelog" class="cta-button">Découvrir les mises à jour</a>
            </div>

            <p style="color: #D4C5B0; font-size: 14px; line-height: 1.6; margin-top: 24px;">
              Pour plus de détails, consultez notre <a href="${SITE_URL}/help/changelog" style="color: #C16B34; text-decoration: none;">changelog complet</a>.
            </p>
          </div>

          <div class="footer">
            <p style="margin: 0 0 8px 0;">© 2026 Sakata — Patrimoine et Transmission Culturelle</p>
            <p style="margin: 0;">
              <a href="${SITE_URL}/help/gdpr">Confidentialité</a> •
              <a href="${SITE_URL}/help/philosophy">Philosophie</a> •
              <a href="${SITE_URL}/help/guidelines">Directives</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  phase2UpdateHtml: () => `
    <div class="update-title">📊 Phase 2 — Optimisations et Nouvelles Fonctionnalités</div>
    <ul class="update-list">
      <li><strong>Images Optimisées :</strong> Migration complète vers Next.js Image (40+ images optimisées)</li>
      <li><strong>Validation Formulaires :</strong> React Hook Form + Zod sur chat, profil, articles, connexion</li>
      <li><strong>Caching Hybride :</strong> ISR + localStorage + SWR pour API articles, profils, cours</li>
      <li><strong>Pagination Messages :</strong> Chargement incrémental (50 par lot) pour chat haute-charge</li>
      <li><strong>Optimisation Géographie :</strong> Chargement lazy du globe 3D et tuiles Mapbox</li>
      <li><strong>Système d'Erreurs Unifié :</strong> Messages clairs et actionnables dans toute l'app</li>
    </ul>
  `,
};

export function getPhase2Updates() {
  return [emailTemplates.phase2UpdateHtml()];
}
