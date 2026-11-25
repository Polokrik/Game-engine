const { chromium } = require('playwright');
const fs = require('fs');
const PAGE = 'file:///home/user/game-engine/atelier/atelier-jeux.html';
(async () => {
  const b = await chromium.launch({ args:['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport:{width:1400,height:1000}, acceptDownloads:true });
  const errs=[];
  const p = await ctx.newPage(); p.on('pageerror',e=>errs.push('PAGE '+e.message));
  await p.goto(PAGE); await p.waitForTimeout(1500);
  const sc = p.locator('#scene');
  const txt = async (s) => ((await sc.locator(s).first().textContent()) || '').trim();
  const liste = async () => sc.locator('.qz-scores-li').allTextContents();

  // ---- A. quiz, 3 initiales (l'option est désactivée par défaut : on l'active)
  await p.click('#tab-scores'); console.log('A0. désactivée par défaut :', !(await p.isChecked('#f-scores-actif'))); await p.check('#f-scores-actif'); await p.waitForTimeout(400);
  await p.selectOption('#f-vue','fin'); await p.waitForTimeout(600);
  console.log('A. formulaire présent:', await sc.locator('.qz-nom-saisie').count(), '| consigne:', (await txt('.qz-scores-form label')).slice(0,70));
  await sc.locator('.qz-nom-saisie').fill('con'); await sc.locator('text=Enregistrer mon score').click();
  console.log('A. "CON" ->', await txt('.qz-erreur'));
  await sc.locator('.qz-nom-saisie').fill('ab'); await sc.locator('text=Enregistrer mon score').click();
  console.log('A. "AB"  ->', await txt('.qz-erreur'));
  await sc.locator('.qz-nom-saisie').fill('é1p2a3u'); console.log('A. saisie nettoyée :', await sc.locator('.qz-nom-saisie').inputValue());
  await sc.locator('.qz-nom-saisie').fill('pau'); await sc.locator('.qz-nom-saisie').press('Enter'); await p.waitForTimeout(200);
  console.log('A. classement:', await liste(), '| ligne en évidence:', await sc.locator('.qz-score-moi').count(), '| note:', (await txt('.qz-scores .qz-doux:last-of-type')).slice(0, 50));
  await p.screenshot({path:'a_scores.png'});

  // ---- B. pseudo généré
  await p.click('#tab-scores'); await p.selectOption('#f-scores-mode','genere'); await p.waitForTimeout(500);
  await p.selectOption('#f-vue','fin'); await p.waitForTimeout(600);
  const ps = [await txt('.qz-pseudo')];
  for (let i = 0; i < 6 && new Set(ps).size < 2; i++) { await sc.locator('text=Un autre pseudo').click(); ps.push(await txt('.qz-pseudo')); }
  console.log('B. pseudos proposés:', [...new Set(ps)].join(' | '), '| saisie libre:', await sc.locator('input').count());
  await sc.locator('text=Enregistrer mon score').click(); await p.waitForTimeout(200);
  console.log('B. classement:', await liste());

  // ---- C. pseudo libre + D. mots interdits
  await p.selectOption('#f-scores-mode','libre'); await p.fill('#f-scores-mots','zorglub, Rival'); await p.waitForTimeout(500);
  await p.selectOption('#f-vue','fin'); await p.waitForTimeout(600);
  for (const nom of ['Connard','C o n n a r d','Zorglub','Monique']) {
    await sc.locator('.qz-nom-libre').fill(nom); await sc.locator('text=Enregistrer mon score').click(); await p.waitForTimeout(100);
    const err = await sc.locator('.qz-erreur:visible').count() ? await txt('.qz-erreur') : '';
    console.log('C/D.', JSON.stringify(nom), '->', err ? 'REFUSÉ (' + err.slice(0,20) + '…)' : 'accepté');
    if (!err) break;
  }
  console.log('C. classement:', await liste());

  // ---- E. désactivation
  await p.uncheck('#f-scores-actif'); await p.waitForTimeout(500); await p.selectOption('#f-vue','fin'); await p.waitForTimeout(500);
  console.log('E. tableau désactivé -> sections:', await sc.locator('.qz-scores').count());
  await p.check('#f-scores-actif'); await p.selectOption('#f-scores-mode','initiales'); await p.fill('#f-scores-mots','');

  // ---- F. champion solo
  await p.selectOption('#f-jeu','champion'); await p.waitForTimeout(600);
  await p.selectOption('#f-vue','fin'); await p.waitForTimeout(600);
  console.log('F. champion, consigne:', (await txt('.qz-scores-form label')).slice(0,60));
  await sc.locator('.qz-nom-saisie').fill('LEA'); await sc.locator('text=Enregistrer mon score').click(); await p.waitForTimeout(200);
  console.log('F. classement:', await liste());
  await p.screenshot({path:'f_champion.png'});

  // ---- G. exports : conservation après rechargement
  async function exporter(jeu, nom) {
    await p.evaluate((jeu)=>{ cfg = editionExemple(); cfg.jeu = jeu; if (jeu==='champion') { cfg.champion.manches=['sprint']; cfg.champion.sprint.objectif=3; } cfg.scores.actif = true; cfg.scores.taille = 5; toutRafraichir(); }, jeu);
    const html = await p.evaluate(()=>construireExport(configPropre(true))); fs.writeFileSync(nom, html); return html.length;
  }
  async function jouerChampion(q) {
    await q.click('text=Commencer sans le son'); await q.click('text=C\'est parti');
    for (let k = 0; k < 12; k++) {
      const e = ((await q.textContent('.qz-enonce')) || '').trim();
      const bonne = await q.evaluate((e) => { const x = CONFIG.questions.find((y) => y.enonce === e); return x.reponses[x.bonne]; }, e);
      const i = (await q.locator('.qz-rep-texte').allTextContents()).indexOf(bonne);
      await q.locator('.qz-rep').nth(i).click();
      const suite = ((await q.textContent('.qz-retour .qz-principal')) || '').trim(); await q.click('.qz-retour .qz-principal');
      if (suite === 'Terminer la manche') break;
    }
    await q.click('text=Voir mon résultat');
  }
  console.log('G. export champion Ko:', Math.round(await exporter('champion','exp_champion.html')/1024));
  const q = await ctx.newPage(); q.on('pageerror',e=>errs.push('EXPORT '+e.message));
  await q.goto('file://'+process.cwd()+'/exp_champion.html'); await q.waitForTimeout(300);
  console.log('G. accueil, tableau activé mais vide -> section (invitation « soyez le premier »):', await q.locator('.qz-scores').count());
  await jouerChampion(q); await q.waitForTimeout(200);
  await q.locator('.qz-nom-saisie').fill('RIK'); await q.locator('text=Enregistrer mon score').click(); await q.waitForTimeout(200);
  console.log('G. fin :', (await q.locator('.qz-scores-li').allTextContents()), '| en évidence:', await q.locator('.qz-score-moi').count());
  await q.reload(); await q.waitForTimeout(300);
  console.log('G. après rechargement, accueil:', await q.locator('.qz-scores h2').textContent(), '|', await q.locator('.qz-scores-li').allTextContents());
  await q.screenshot({path:'g_accueil.png'});
  // deuxième partie : le tableau garde le premier score
  await jouerChampion(q); await q.waitForTimeout(200);
  console.log('G. 2e partie, formulaire:', await q.locator('.qz-nom-saisie').count(), '(le score égal au précédent entre tant que le tableau n\'est pas plein)');
  await q.locator('.qz-nom-saisie').fill('JOE'); await q.locator('text=Enregistrer mon score').click(); await q.waitForTimeout(200);
  console.log('G. classement:', await q.locator('.qz-scores-li').allTextContents());
  // effacement en deux temps
  await q.locator('text=Effacer les scores de ce poste').click();
  console.log('G. effacement, 1er clic ->', await q.locator('.qz-scores .qz-discret').last().textContent());
  await q.locator('.qz-scores .qz-discret').last().click(); await q.waitForTimeout(200);
  console.log('G. après effacement:', (await q.locator('.qz-scores-li').count()), 'ligne(s) |', await q.locator('.qz-scores .qz-doux').first().textContent());

  // ---- H. quiz exporté, stockage bloqué
  console.log('H. export quiz Ko:', Math.round(await exporter('quiz','exp_quiz.html')/1024));
  const r = await ctx.newPage(); r.on('pageerror',e=>errs.push('QUIZ-BLOQUÉ '+e.message));
  await r.addInitScript(()=>{ Object.defineProperty(window,'localStorage',{ get(){ throw new Error('stockage bloqué'); } }); });
  await r.goto('file://'+process.cwd()+'/exp_quiz.html'); await r.waitForTimeout(300);
  await r.click('text=Commencer sans le son');
  for (let k = 0; k < 10; k++) {
    const e = ((await r.textContent('.qz-enonce')) || '').trim();
    const bonne = await r.evaluate((e) => { const x = CONFIG.questions.find((y) => y.enonce === e); return x.reponses[x.bonne]; }, e);
    const i = (await r.locator('.qz-rep-texte').allTextContents()).indexOf(bonne);
    await r.locator('.qz-rep').nth(i).click(); await r.click('text=Valider ma réponse'); 
    const suite = ((await r.textContent('.qz-retour .qz-principal')) || '').trim(); await r.click('.qz-retour .qz-principal');
    if (suite === 'Voir mon résultat') break;
  }
  await r.locator('.qz-nom-saisie').fill('OKI'); await r.locator('text=Enregistrer mon score').click(); await r.waitForTimeout(200);
  console.log('H. stockage bloqué -> classement affiché:', await r.locator('.qz-scores-li').allTextContents(), '| note:', (await r.locator('.qz-scores .qz-doux').last().textContent()).trim().slice(0, 62));
  await r.screenshot({path:'h_quiz.png'});
  console.log('erreurs :', errs.length ? errs : 'aucune');
  await b.close();
})();
