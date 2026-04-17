export const emailTemplates = {
  updateNotification: (userName: string, updates: string[]) => ({
    subject: "✨ Nouvelles du Sanctuaire : Phase 2 est Arrivée !",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; }
          .container { max-width: 600px; mx-auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .title { color: #C16B34; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 12px; border: 1px solid #eee; }
          .update-list { list-style: none; padding: 0; }
          .update-item { margin-bottom: 20px; padding-left: 20px; border-left: 3px solid #C16B34; }
          .update-title { font-weight: bold; color: #0A1F15; display: block; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">Kisakata Digital</div>
            <p>Le Hub Culturel du Peuple Sakata</p>
          </div>
          
          <div class="content">
            <p>Mboté <strong>${userName}</strong>,</p>
            <p>La forêt s'éveille avec de nouvelles possibilités. Nous sommes ravis de vous présenter les dernières évolutions de votre plateforme :</p>
            
            <div class="update-list">
              ${updates.join("")}
            </div>
            
            <p style="margin-top: 30px;">
              Explorez ces nouveautés dès maintenant sur <a href="https://kisakata.com" style="color: #C16B34; text-decoration: none; font-weight: bold;">kisakata.com</a>.
            </p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Sakata Digital Hub. Tous droits réservés.</p>
            <p>Vous recevez cet email car vous êtes inscrit à la newsletter de Kisakata.</p>
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
