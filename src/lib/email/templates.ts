export const emailTemplates = {
  updateNotification: (userName: string, updates: string[]) => ({
    subject: "⚡ Kisakata Digital Dashboard : Mises à jour",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #F2EEDD; background-color: #050B08; margin: 0; padding: 0; }
          .wrapper { background-color: #050B08; padding: 40px 10px; width: 100%; table-layout: fixed; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0A1F15; border-radius: 24px; border: 1px solid rgba(181, 149, 81, 0.2); overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
          .header { text-align: center; padding: 50px 30px; background: linear-gradient(180deg, #122A1E 0%, #0A1F15 100%); }
          .title { color: #B59551; font-size: 32px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
          .subtitle { color: rgba(242, 238, 221, 0.6); font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
          .content { padding: 40px 35px; }
          .greeting { font-size: 20px; font-weight: 600; color: #F2EEDD; margin-bottom: 20px; }
          .intro { color: rgba(242, 238, 221, 0.8); font-size: 16px; margin-bottom: 30px; }
          .update-section { margin-bottom: 30px; }
          .update-title { font-weight: 700; color: #B59551; font-size: 18px; display: block; margin-bottom: 15px; border-bottom: 1px solid rgba(181, 149, 81, 0.1); padding-bottom: 8px; }
          .update-list { list-style: none; padding: 0; margin: 0; }
          .update-list li { margin-bottom: 12px; padding-left: 20px; position: relative; color: rgba(242, 238, 221, 0.9); font-size: 14px; }
          .update-list li::before { content: "•"; color: #B59551; font-weight: bold; position: absolute; left: 0; }
          .cta-wrapper { text-align: center; margin-top: 40px; }
          .cta-button { background-color: #B59551; color: #0A1F15 !important; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; transition: background-color 0.3s; }
          .footer { text-align: center; padding: 30px; font-size: 12px; color: rgba(242, 238, 221, 0.4); border-top: 1px solid rgba(181, 149, 81, 0.1); }
          .footer a { color: #B59551; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="title">Sakata Digital Hub</div>
              <div class="subtitle">L'Héritage Ancestral au Cœur du Numérique</div>
            </div>
            
            <div class="content">
              <p class="greeting">Mboté <strong>${userName}</strong>,</p>
              <p class="intro">La brume se lève sur une nouvelle ère pour notre hub. Nous avons le plaisir de vous annoncer les derniers déploiements sur votre plateforme :</p>
              
              <div class="update-section">
                ${updates.join("")}
              </div>
              
              <div class="cta-wrapper">
                <a href="https://sakata-basakata.com" class="cta-button">Accéder au Hub</a>
              </div>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Sakata Digital Hub. Tous droits réservés.</p>
              <p>Vous recevez cet email car vous êtes membre de la communauté Sakata. <br/> 
                 <a href="https://sakata-basakata.com/help">Aide & Support</a> | <a href="https://sakata-basakata.com/profil">Mon Compte</a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
  
  broadcastTemplate: (content: string, version: string) => ({
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #F2EEDD; background-color: #050B08; margin: 0; padding: 0; }
          .wrapper { background-color: #050B08; padding: 40px 10px; width: 100%; table-layout: fixed; }
          .container { max-width: 600px; margin: 0 auto; background-color: #0A1F15; border-radius: 24px; border: 1px solid rgba(181, 149, 81, 0.2); overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.5); }
          .header { text-align: center; padding: 50px 30px; background: linear-gradient(180deg, #122A1E 0%, #0A1F15 100%); }
          .title { color: #B59551; font-size: 32px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
          .subtitle { color: rgba(242, 238, 221, 0.6); font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
          .content { padding: 40px 35px; color: rgba(242, 238, 221, 0.9); font-size: 16px; whitespace: pre-line; }
          .content h3 { color: #B59551; font-size: 20px; border-bottom: 1px solid rgba(181, 149, 81, 0.1); padding-bottom: 10px; margin-top: 30px; }
          .content p { margin-bottom: 20px; }
          .content ul { list-style: none; padding: 0; }
          .content li { margin-bottom: 10px; padding-left: 20px; position: relative; }
          .content li::before { content: "•"; color: #B59551; position: absolute; left: 0; }
          .cta-wrapper { text-align: center; margin-top: 40px; }
          .cta-button { background-color: #B59551; color: #0A1F15 !important; padding: 16px 32px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; }
          .footer { text-align: center; padding: 30px; font-size: 12px; color: rgba(242, 238, 221, 0.4); border-top: 1px solid rgba(181, 149, 81, 0.1); }
          .footer a { color: #B59551; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <div class="title">Sakata Digital Hub</div>
              <div class="subtitle">Mise à jour v${version}</div>
            </div>
            
            <div class="content">
              ${content.replace(/\n/g, '<br/>')}
            </div>
            
            <div class="cta-wrapper" style="margin-bottom: 40px;">
              <a href="https://sakata-basakata.com" class="cta-button">Découvrir les nouveautés</a>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} Sakata Digital Hub. Tous droits réservés.</p>
              <p>Vous recevez cet email car vous êtes membre de la communauté Sakata. <br/> 
                 <a href="https://sakata-basakata.com">Visiter le site</a>
              </p>
            </div>
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

  v2_6UpdateHtml: () => `
    <div class="update-title">✨ Version 2.6 — Restauration UX & Intelligence Culturelle</div>
    <ul class="update-list">
      <li><strong>Refactoring UI/UX :</strong> Restauration complète du thème V1 "Brume de la Rivière" (tons sombres, glassmorphism).</li>
      <li><strong>Navigation Hub École :</strong> Accès direct aux cours depuis la sélection de l'année et nouveau bouton de retour au dashboard pédagogique.</li>
      <li><strong>Enrichissement Mémoire Pinecone :</strong> Indexation sémantique complète des croyances Sakata, structures chefferies (Mbey/Mojuu), et tabous féminins (M'pka).</li>
      <li><strong>Génération de Savoirs :</strong> Création automatique d'articles profonds (poétiques et académiques) propulsés par les KIs.</li>
      <li><strong>Déploiement Résilient :</strong> Déplacement et sécurisation des routes d'aide et de mises à jour vers /help.</li>
    </ul>
  `,

  v2_7UpdateHtml: () => `
    <div class="update-title">⚡ Version 2.7 — Interactivité Totale & Fluidité Auth</div>
    <ul class="update-list">
      <li><strong>Chat & Optimistic UI :</strong> Vos messages apparaissent instantanément dès l'envoi. La connexion WebSocket a été stabilisée pour éviter les déconnexions.</li>
      <li><strong>Stabilité Authentification :</strong> Correction des erreurs "Lock Stolen". La navigation entre le Chat et l'Accueil est désormais fluide et sans erreurs.</li>
      <li><strong>Réactions Forum (Mboka) :</strong> Exprimez-vous avec des émojis sur tous les messages du forum communautaire, en temps réel.</li>
      <li><strong>Notifications Push :</strong> Recevez des alertes pour vos nouveaux messages directement sur votre smartphone ou ordinateur.</li>
      <li><strong>Géographie Avancée :</strong> HUD interactif corrigé pour une navigation transversale facilitée sur la carte 3D.</li>
    </ul>
  `,
};

export function getPhase2Updates() {
  return [emailTemplates.phase2UpdateHtml()];
}

export function getV2_6Updates() {
  return [emailTemplates.v2_6UpdateHtml()];
}

export function getV2_7Updates() {
  return [emailTemplates.v2_7UpdateHtml()];
}
