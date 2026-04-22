import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  console.log("Navigation vers www.sakata-basakata.com/savoir/ngongo-philosophique ...");
  await page.goto("https://www.sakata-basakata.com/savoir/ngongo-philosophique", { waitUntil: 'networkidle' });
  
  console.log("Recherche du lecteur audio...");
  // Attendre que l'élément audio ou AudioNarrator apparaisse
  try {
    // Si la page charge des choses, on attend quelques secondes
    await page.waitForTimeout(5000);
    
    // Chercher un tag <audio> ou un bouton play
    const audioTags = await page.$$('audio');
    if (audioTags.length > 0) {
      console.log(`✅ Succès: ${audioTags.length} lecteur(s) audio trouvé(s) sur la page !`);
    } else {
      console.log("❌ Aucun lecteur audio <audio> trouvé.");
      const pageText = await page.content();
      if (pageText.includes("narrator") || pageText.includes("Vieux Sage") || pageText.includes("Écouter")) {
         console.log("Mais du texte suggérant le narrateur a été trouvé.");
      }
    }
    await page.screenshot({ path: 'verify-audio-ngongo.png', fullPage: true });
    console.log("Capture d'écran enregistrée sous verify-audio-ngongo.png");
  } catch (err) {
    console.error("Erreur lors de la vérification:", err);
  } finally {
    await browser.close();
  }
})();
