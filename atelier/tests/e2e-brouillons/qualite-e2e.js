const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1400,height:1000} });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file:///home/user/game-engine/atelier/atelier-jeux.html'); await p.waitForTimeout(1300);
  await p.click('#tab-questions');
  const panneau = async () => (await p.locator('#controle-qualite').innerText()).replace(/\n+/g, ' | ');
  console.log('1. QUIZ, exemple livré :', await panneau());
  console.log('   pastilles sur les questions :', await p.locator('#liste-questions .q-qualite').count());
  // 2. une mauvaise question saisie à la main
  await p.click('#btn-ajouter'); await p.waitForTimeout(300);
  const c = p.locator('#liste-questions .q').last();
  await c.locator('textarea').first().fill("Laquelle de ces propositions n'est pas correcte ?");
  await c.locator('input[type=text]').nth(0).fill('Oui'); await c.locator('input[type=text]').nth(1).fill('Oui');
  await c.locator('input[type=text]').nth(2).fill('Toutes les réponses ci-dessus');
  await c.locator('input[type=text]').nth(3).fill('Une réponse beaucoup plus longue que toutes les autres réponses proposées ici');
  await c.locator('input[type=radio]').nth(3).check(); await p.waitForTimeout(300);
  console.log('2. mauvaise question, conseils :'); for (const l of await c.locator('.q-avis li').allTextContents()) console.log('   -', l);
  console.log('   pastille :', await c.locator('.q-qualite').textContent());
  // 3. la correction fait disparaître les conseils
  await c.locator('textarea').first().fill("Où doit-on stocker un document confidentiel ?");
  await c.locator('input[type=text]').nth(1).fill('Sur le disque partagé'); await c.locator('input[type=text]').nth(2).fill('Dans un message');
  await c.locator('input[type=text]').nth(3).fill('Dans l\'espace sécurisé'); await c.locator('textarea').nth(1).fill('Un document confidentiel se stocke uniquement dans l\'espace sécurisé.'); await p.waitForTimeout(300);
  console.log('3. après correction, conseils restants sur cette question :', await c.locator('.q-avis li').count(), '| pastille :', await c.locator('.q-qualite').count());
  // 4. Quiz : trop peu de questions et lettres répétées
  await p.evaluate(()=>{ cfg.questions = cfg.questions.slice(0,6); cfg.regles.melangerReponses = false; cfg.questions.forEach(q=>q.bonne=2); toutRafraichir(); }); await p.waitForTimeout(400);
  console.log('4. QUIZ, 6 questions, bonne = C partout, mélange désactivé :', await panneau());
  // 5. CHAMPION
  await p.evaluate(()=>{ cfg = editionExemple(); cfg.jeu = 'champion'; toutRafraichir(); }); await p.waitForTimeout(500);
  console.log('5. CHAMPION, exemple livré :', await panneau());
  await p.evaluate(()=>{ cfg.trouve[0].indices[1] = "Elle s'appelle L'effet d'espacement, rappelez-vous."; cfg.trouve[1].faux[0] = cfg.trouve[1].reponse; cfg.trouve[2].infoCle = ""; toutRafraichir(); }); await p.waitForTimeout(500);
  for (const [i, x] of (await p.locator('#liste-trouve .q').all()).entries()) { const l = await x.locator('.q-avis li').allTextContents(); if (l.length) console.log('   concept', i + 1, ':', l.join(' / ')); }
  // 6. message d'export
  await p.evaluate(()=>{ cfg = editionExemple(); cfg.questions[0].infoCle = ''; toutRafraichir(); }); await p.waitForTimeout(400);
  const dl = p.waitForEvent('download'); await p.click('#btn-exporter'); await dl; await p.waitForTimeout(300);
  console.log('6. message d\'export :', (await p.locator('#toast').textContent()).trim());
  console.log('erreurs :', errs.length ? errs : 'aucune');
  await p.screenshot({path:'qualite.png'});
  await b.close();
})();
