const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const body = fs.readFileSync('/home/user/atelier-quiz/index.html','utf8');
  fs.writeFileSync('page.html','<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>[hidden]{display:none!important}</style></head><body>'+body+'</body></html>');
  const b = await chromium.launch({ args:['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport:{width:1400,height:1000} });
  await ctx.addInitScript(() => {
    window.__log = [];
    const play = HTMLMediaElement.prototype.play, pause = HTMLMediaElement.prototype.pause;
    HTMLMediaElement.prototype.play = function(){ window.__log.push({e:'play',len:(this.src||'').length,t:Date.now()}); return play.call(this); };
    HTMLMediaElement.prototype.pause = function(){ window.__log.push({e:'pause',len:(this.src||'').length,t:Date.now()}); return pause.call(this); };
  });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push('PAGE '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text())});
  await p.goto('file://'+process.cwd()+'/page.html'); await p.waitForTimeout(1500);
  const noms = await p.evaluate(()=>Object.fromEntries(Object.entries(SONS_DEFAUT).map(([k,v])=>[v.src.length,k])));
  const plays = async () => (await p.evaluate(()=>window.__log)).filter(x=>x.e==='play').map(x=>noms[x.len]||('?'+x.len));
  const reset = () => p.evaluate(()=>{window.__log=[]});
  const scene = (s) => p.locator('#scene').locator(s);
  const rep = (i) => scene('.qz-rep').nth(i);

  console.log('sons dans cfg:', await p.evaluate(()=>Object.keys(cfg.sons.pistes).join(',')));
  await p.evaluate(()=>{cfg.regles.melangerReponses=false; cfg.sons.suspenseMax=3; toutRafraichir();}); await p.waitForTimeout(500);

  // B. accueil avec avertissement
  console.log('notice:', (await scene('.qz-avis-son').textContent()).slice(0,70));
  console.log('boutons:', await scene('.qz-actions-debut .qz-btn').allTextContents());
  await p.screenshot({path:'k_accueil.png'});

  // C. sans le son
  await scene('text=Commencer sans le son').click();
  console.log('C toggle:', await scene('.qz-son').textContent(), '| plays:', await plays());
  await rep(2).click(); await scene('text=Valider ma réponse').click(); await p.waitForTimeout(300);
  console.log('C apres reponse plays:', await plays());

  // D. avec le son
  await p.click('#btn-rejouer'); await p.waitForTimeout(500);
  await reset();
  await scene('text=Commencer avec le son').click(); await p.waitForTimeout(300);
  console.log('D lancement:', await plays(), await scene('.qz-son').textContent());
  await rep(2).click(); await scene('text=Valider ma réponse').click(); await p.waitForTimeout(400);
  console.log('D bonne:', await plays(), '| retour:', await scene('.qz-retour-titre').textContent());
  await scene('text=Question suivante').click();
  await rep(1).click(); await scene('text=Valider ma réponse').click(); await p.waitForTimeout(400);
  console.log('D mauvaise:', await plays(), '| retour:', (await scene('.qz-retour-titre').textContent()).trim());

  // E. palier de securite -> suspense plafonne a 3 s
  await p.selectOption('#f-vue','q4'); await p.waitForTimeout(500);
  await scene('.qz-son').click(); await reset();
  console.log('E toggle:', await scene('.qz-son').textContent());
  await rep(2).click(); const t0 = Date.now(); await scene('text=Valider ma réponse').click(); await p.waitForTimeout(300);
  console.log('E suspense visible:', await scene('.qz-suspense').isVisible(), 'reponses desactivees:', await scene('.qz-rep:disabled').count());
  await p.screenshot({path:'l_suspense.png'});
  await scene('.qz-retour').waitFor({timeout:9000}); const dt = (Date.now()-t0)/1000;
  console.log('E verdict apres', dt.toFixed(1), 's; plays:', await plays());

  // F. derniere question, passer le suspense -> jackpot
  await p.selectOption('#f-vue','q9'); await p.waitForTimeout(500);
  await scene('.qz-son').click(); await reset();
  await rep(1).click(); await scene('text=Valider ma réponse').click(); await p.waitForTimeout(300);
  await scene('text=Passer le suspense').click(); await p.waitForTimeout(300);
  console.log('F plays:', await plays(), '| retour:', (await scene('.qz-retour-titre').textContent()).trim(), '| bouton:', (await scene('.qz-retour .qz-principal').textContent()));

  // G. derniere question fausse
  await p.selectOption('#f-vue','q9'); await p.waitForTimeout(500);
  await scene('.qz-son').click(); await reset();
  await rep(0).click(); await scene('text=Valider ma réponse').click(); await p.waitForTimeout(200);
  await scene('text=Passer le suspense').click(); await p.waitForTimeout(300);
  console.log('G plays:', await plays());
  await scene('.qz-retour .qz-principal').click(); await p.waitForTimeout(300);
  console.log('G fin: bouton son present:', await scene('.qz-son').count(), '| fiche memo:', await scene('.qz-memo-item').count());

  // H. couper le son pendant le suspense
  await p.selectOption('#f-vue','q9'); await p.waitForTimeout(500);
  await scene('.qz-son').click(); await reset();
  await rep(1).click(); await scene('text=Valider ma réponse').click(); await p.waitForTimeout(300);
  await scene('.qz-son').click(); await p.waitForTimeout(300);
  console.log('H verdict immediat apres coupure:', await scene('.qz-retour').isVisible(), '| plays:', await plays());

  // I. editeur : onglet Sons
  await p.click('#tab-sons'); await p.waitForTimeout(300);
  await p.screenshot({path:'m_sons.png'});
  await p.locator('#liste-sons button[data-action=choisir]').nth(1).click().catch(()=>{});
  await p.setInputFiles('#fichier-son','/home/user/atelier-quiz/sons/wrong_millionaire.mp3'); await p.waitForTimeout(800);
  console.log('I remplace correct:', await p.evaluate(()=>cfg.sons.pistes.correct.nom+' '+cfg.sons.pistes.correct.duree));
  await p.click('#liste-sons .bloc >> nth=1 >> button[data-action=retirer]');
  console.log('I apres retrait:', await p.evaluate(()=>Object.keys(cfg.sons.pistes).join(',')));
  await p.click('#btn-pack'); console.log('I pack:', await p.evaluate(()=>Object.keys(cfg.sons.pistes).length), await p.textContent('#sons-poids'));
  await p.setInputFiles('#fichier-son','/home/user/atelier-quiz/index.html'); await p.waitForTimeout(300); // pas un son (cle cible deja posee)
  console.log('I toast non-son:', await p.textContent('#toast'));
  await p.click('#btn-sons-vider'); await p.click('#btn-sons-vider');
  console.log('I vider:', await p.evaluate(()=>Object.keys(cfg.sons.pistes).length), await p.textContent('#sons-poids'));
  await p.click('#btn-pack');
  await p.uncheck('#f-sons-actif'); await p.waitForTimeout(500);
  await p.click('#btn-rejouer'); await p.waitForTimeout(300);
  console.log('I sons desactives -> notice:', await scene('.qz-avis-son').count(), '| bouton:', await scene('.qz-accueil .qz-principal').textContent());
  await p.check('#f-sons-actif');

  // J. export autonome
  const html = await p.evaluate(()=>construireExport(configPropre(true)));
  fs.writeFileSync('export3.html', html); console.log('J export Ko', Math.round(html.length/1024));
  const p2 = await ctx.newPage(); p2.on('pageerror',e=>errs.push('EXPORT '+e.message));
  await p2.setViewportSize({width:1200,height:800});
  await p2.goto('file://'+process.cwd()+'/export3.html'); await p2.waitForTimeout(300);
  await p2.screenshot({path:'n_export.png'});
  await p2.click('text=Commencer avec le son'); await p2.waitForTimeout(300);
  const lg = (await p2.evaluate(()=>window.__log)).filter(x=>x.e==='play').length;
  console.log('J export lancement play:', lg, '| son:', await p2.textContent('.qz-son'));
  await p2.keyboard.press('c'); await p2.keyboard.press('Enter'); await p2.waitForTimeout(300);
  console.log('J export reponse:', (await p2.textContent('.qz-retour-titre')).trim(), '| plays:', (await p2.evaluate(()=>window.__log)).filter(x=>x.e==='play').length);
  console.log('errs', errs);
  await b.close();
})();
