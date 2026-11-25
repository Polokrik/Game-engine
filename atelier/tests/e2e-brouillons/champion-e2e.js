const { chromium } = require('playwright');
const fs = require('fs');
const wrap = (b) => '<!doctype html><html><head><meta charset=utf8><meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover"><style>[hidden]{display:none!important}</style></head><body>'+b+'</body></html>';
(async () => {
  fs.writeFileSync('page.html', wrap(fs.readFileSync('/home/user/atelier-quiz/index.html','utf8')));
  fs.writeFileSync('page_v4.html', wrap(fs.readFileSync('/home/user/game-engine/atelier/atelier-jeux.html','utf8')));
  const b = await chromium.launch({ args:['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport:{width:1400,height:1000}, acceptDownloads:true });
  await ctx.addInitScript(() => {
    window.__log = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function(){ window.__log.push({e:'play',len:(this.src||'').length,t:performance.now()}); return play.call(this); };
  });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push('PAGE '+e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('CONSOLE '+m.text())});
  await p.goto('file://'+process.cwd()+'/page.html'); await p.waitForTimeout(1500);
  const noms = await p.evaluate(()=>{ const o={}; for (const pk of [SONS_DEFAUT,SONS_QPUC]) for (const [k,v] of Object.entries(pk)) o[v.src.length]=k; return o; });
  const plays = async () => (await p.evaluate(()=>window.__log)).map(x=>noms[x.len]||('?'+x.len));
  const reset = () => p.evaluate(()=>{window.__log=[]});
  const scene = (s) => p.locator('#scene').locator(s);
  const txt = async (s) => ((await scene(s).first().textContent()) || '').trim();

  // ---- 1. bascule de type de jeu
  await p.selectOption('#f-jeu','champion'); await p.waitForTimeout(500);
  console.log('1. selecteur vue:', await p.locator('#f-vue option').allTextContents());
  await p.click('#tab-regles');
  console.log('1. regles champion visibles:', await p.isVisible('#f-m-sprint'), '| blocs quiz caches:', !(await p.isVisible('#f-gainmax')));
  console.log('1. manches cochees:', await p.evaluate(()=>[...document.querySelectorAll('[data-manche]')].map(c=>c.dataset.manche+':'+c.checked).join(' ')));
  console.log('1. valeurs sprint:', await p.inputValue('#f-sp-obj'), await p.inputValue('#f-sp-max'), '| serie:', await p.inputValue('#f-se-lon'), '| trouve:', await p.inputValue('#f-tr-nb'), await p.inputValue('#f-tr-pen'));
  await p.screenshot({path:'c_regles.png'});
  await p.click('#tab-questions');
  await p.locator('#liste-questions .q >> nth=0 >> summary').click();
  console.log('1. champs theme/niveau:', await p.inputValue('#liste-questions .q >> nth=0 >> input[list]'), await p.inputValue('#liste-questions .q >> nth=0 >> select'));
  console.log('1. concepts:', await p.locator('#liste-trouve .q').count(), await p.textContent('#compte-trouve'));
  await p.locator('#liste-trouve .q >> nth=0 >> summary').click();
  await p.locator('#liste-trouve').scrollIntoViewIfNeeded();
  await p.screenshot({path:'c_questions.png'});
  await p.click('#tab-sons');
  console.log('1. emplacements sons:', await p.locator('#liste-sons h3').allTextContents());
  await p.screenshot({path:'c_sons.png'});

  // ---- 2. partie complete dans l'apercu
  async function bonneIdx() {
    const e = await txt('.qz-enonce');
    const b = await p.evaluate((e) => { const q = cfg.questions.find((x) => x.enonce === e); return q.reponses[q.bonne]; }, e);
    return (await scene('.qz-rep-texte').allTextContents()).indexOf(b);
  }
  async function repondre(juste) {
    const i = await bonneIdx(), n = await scene('.qz-rep').count();
    await scene('.qz-rep').nth(juste ? i : (i + 1) % n).click();
  }
  await reset();
  await p.click('#btn-rejouer'); await p.waitForTimeout(400);
  console.log('2. accueil:', (await txt('.qz-regles')).slice(0, 90).replace(/\n/g,' '), '| boutons:', await scene('.qz-actions-debut .qz-btn').allTextContents());
  await p.screenshot({path:'d_accueil.png'});
  await scene('text=Commencer avec le son').click(); await p.waitForTimeout(300);
  console.log('2. generique:', await plays(), '| intro:', await txt('.qz-etiquette'));
  await scene('text=C\'est parti').click(); await p.waitForTimeout(300);
  // sprint : une erreur a la 2e question, puis que des bonnes
  let n = 0, erreurVue = false;
  for (let k = 0; k < 20; k++) {
    await repondre(!(k === 1));
    if (k === 1) { erreurVue = (await txt('.qz-retour')).includes('reviendra'); await p.screenshot({path:'d_erreur.png'}); }
    if (k === 0) { await p.screenshot({path:'d_sprint.png'}); }
    n++;
    const suite = (await txt('.qz-retour .qz-principal'));
    if (suite === 'Terminer la manche') { console.log('2. fin du sprint apres', n, 'questions | message:', await txt('.qc-msg-manche')); await scene('.qz-retour .qz-principal').click(); break; }
    await scene('.qz-retour .qz-principal').click();
  }
  console.log('2. erreur -> question reprogrammee annoncee:', erreurVue, '| sons joues:', [...new Set(await plays())].join(','));
  console.log('2. bilan sprint:', await txt('h1'), '|', await txt('.qz-accroche'));
  await p.screenshot({path:'d_bilan.png'});
  await scene('.qz-principal').click(); await p.waitForTimeout(200);
  console.log('2. intro serie:', await txt('h1'), '| themes:', await scene('.qc-theme-titre').allTextContents());
  await p.screenshot({path:'d_themes.png'});
  await p.locator('#scene').locator('.qc-theme', { hasText: 'Techniques de révision' }).click(); await p.waitForTimeout(200);
  // serie : bonne, mauvaise (remise a zero), puis 4 bonnes
  await repondre(true); await scene('.qz-retour .qz-principal').click();
  console.log('2. serie apres 1 bonne:', await txt('.qc-suivi-texte'));
  await repondre(false); console.log('2. serie apres erreur:', await txt('.qc-suivi-texte')); await scene('.qz-retour .qz-principal').click();
  for (let k = 0; k < 10; k++) {
    await repondre(true);
    if ((await txt('.qz-retour .qz-principal')) === 'Terminer la manche') { console.log('2. serie:', await txt('.qc-msg-manche')); await p.screenshot({path:'d_serie.png'}); await scene('.qz-retour .qz-principal').click(); break; }
    await scene('.qz-retour .qz-principal').click();
  }
  console.log('2. bilan serie:', await txt('h1'), '|', await txt('.qz-accroche'));
  await scene('.qz-principal').click(); await p.waitForTimeout(200);
  console.log('2. intro trouve:', await txt('h1'));
  await reset();
  await scene('text=C\'est parti').click(); await p.waitForTimeout(300);
  const concept = async () => { const i0 = await txt('.qc-indice-t'); return p.evaluate((i0) => cfg.trouve.find((x) => x.indices[0] === i0), i0); };
  // concept 1 : indice 2 puis JE SAIS, bonne reponse
  let c1 = await concept();
  console.log('2. trouve: enjeu:', await txt('.qc-enjeu'));
  await p.screenshot({path:'d_trouve.png'});
  await scene('text=Indice suivant').click();
  console.log('2. trouve: enjeu apres indice:', await txt('.qc-enjeu'));
  await scene('text=JE SAIS').click(); await p.waitForTimeout(200);
  console.log('2. buzzer joue:', (await plays()).slice(-1)[0], '| choix:', await scene('.qz-rep-texte').allTextContents());
  await p.screenshot({path:'d_choix.png'});
  const idxBonne = (await scene('.qz-rep-texte').allTextContents()).indexOf(c1.reponse);
  await scene('.qz-rep').nth(idxBonne).click(); await p.waitForTimeout(200);
  console.log('2. trouve resultat 1:', await txt('.qz-retour-titre'), '| son:', (await plays()).slice(-1)[0]);
  await p.screenshot({path:'d_trouve_ok.png'});
  await scene('text=Concept suivant').click();
  // concept 2 : mauvaise reponse a l'indice 1
  let c2 = await concept();
  await scene('text=JE SAIS').click();
  const t2 = await scene('.qz-rep-texte').allTextContents();
  await scene('.qz-rep').nth((t2.indexOf(c2.reponse) + 1) % t2.length).click(); await p.waitForTimeout(200);
  console.log('2. trouve resultat 2:', await txt('.qz-retour-titre'), '| son:', (await plays()).slice(-1)[0]);
  await scene('text=Concept suivant').click();
  // concept 3 : jusqu'au bout sans savoir
  for (let k = 0; k < 3; k++) await scene('text=Indice suivant').click();
  await scene('text=Je ne sais pas').click();
  console.log('2. trouve resultat 3:', await txt('.qz-retour-titre'));
  await scene('text=Terminer la manche').click();
  console.log('2. bilan trouve:', await txt('.qz-accroche'));
  await scene('.qz-principal').click(); await p.waitForTimeout(300);
  console.log('2. fin:', await txt('.qz-gain-final'), '|', await txt('.qz-score'), '| cartes:', await scene('.qc-carte-manche').count(), '| memo:', await scene('.qz-memo-item').count(), '| themes:', await scene('.qc-theme-ligne').count());
  await p.screenshot({path:'d_fin.png', fullPage:false});
  await scene('.qz-fin').evaluate(el => el.scrollIntoView());
  const fin2 = await p.evaluate(() => { const r = document.getElementById('scene').shadowRoot.querySelector('.qz'); return [r.scrollHeight, r.clientHeight]; });
  console.log('2. fin hauteur contenu/visible:', fin2.join('/'));

  // ---- 3. chrono et timer
  await p.evaluate(()=>{ cfg.champion.sprint.chrono = 3; toutRafraichir(); }); await p.waitForTimeout(500);
  await p.selectOption('#f-vue','sprint'); await p.waitForTimeout(500);
  await scene('.qz-son').click(); await reset();
  await p.selectOption('#f-vue','sprint'); await p.waitForTimeout(500); await scene('.qz-son').click(); await reset();
  await p.evaluate(()=>{}); // le son est actif : relancer une question
  await scene('.qz-rep').nth(0).click(); await scene('.qz-retour .qz-principal').click(); await p.waitForTimeout(300);
  console.log('3. timer joue a la question suivante:', await plays());
  console.log('3. chrono affiche:', await txt('.qz-chrono'));
  await p.waitForTimeout(3600);
  console.log('3. temps ecoule:', await txt('.qz-retour-titre'), '| sons:', await plays());

  // ---- 4. apercu direct des ecrans
  for (const v of ['accueil','serie','trouve','fin']) { await p.selectOption('#f-vue', v); await p.waitForTimeout(500); }
  console.log('4. fin simulee:', await txt('.qz-gain-final'));
  await p.selectOption('#f-vue','serie'); await p.waitForTimeout(400); console.log('4. serie direct:', await txt('.qc-suivi-texte'));
  await p.selectOption('#f-vue','trouve'); await p.waitForTimeout(400); console.log('4. trouve direct:', await txt('.qc-suivi-texte'));

  // ---- 5. import Excel a deux feuilles
  await p.click('#tab-questions');
  const bilan = await p.evaluate(async () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([EN_TETES,
      ['Q import 1 ?','a','b','c','d','B','','info 1',2,'','Sécurité'],
      ['Q import 2 ?','a','b','','','C','','info 2',3,'','Sécurité'],
      ['Q import 3 ?','a','b','c','d','Z','','',1,'','Qualité']]), 'Questions');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([EN_TETES_TROUVE,
      ['Qualité','i1','i2','i3','i4','Rep','f1','f2','f3','info',''],
      ['Qualité','i1','','i3','i4','Rep','f1','f2','f3','info','']]), 'Trouve avant la fin');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    await importerFichier(new File([buf], 'test.xlsx'));
    return document.getElementById('import-bilan').innerText;
  });
  console.log('5. bilan import:', bilan.replace(/\n/g, ' | '));
  await p.click('button[data-import=remplacer]'); await p.waitForTimeout(300);
  console.log('5. apres import: questions', await p.evaluate(()=>cfg.questions.length + ' ' + cfg.questions[0].theme + '/' + cfg.questions[0].niveau + ' ; concepts ' + cfg.trouve.length));
  // modele telecharge puis reimporte
  const dl = p.waitForEvent('download'); await p.click('#btn-modele'); const d = await dl;
  console.log('5. modele:', d.suggestedFilename()); await d.saveAs('modele.xlsx');
  await p.setInputFiles('#fichier-import', 'modele.xlsx'); await p.waitForTimeout(500);
  console.log('5. reimport du modele:', (await p.textContent('#import-bilan')).split('\n')[0].trim().slice(0, 120));

  // ---- 6. export + records conserves
  await p.evaluate(()=>{ cfg = editionExemple(); cfg.jeu = 'champion'; cfg.champion.manches = ['sprint']; cfg.champion.sprint.objectif = 3; toutRafraichir(); });
  const html = await p.evaluate(()=>construireExport(configPropre(true)));
  fs.writeFileSync('export_champion.html', html); console.log('6. export Ko', Math.round(html.length/1024));
  const p2 = await ctx.newPage(); p2.on('pageerror',e=>errs.push('EXPORT '+e.message)); p2.on('console',m=>{if(m.type()==='error')errs.push('EXPORT-CONSOLE '+m.text())});
  await p2.setViewportSize({width:1200,height:800});
  await p2.goto('file://'+process.cwd()+'/export_champion.html'); await p2.waitForTimeout(300);
  await p2.screenshot({path:'e_export.png'});
  await p2.click('text=Commencer sans le son');
  await p2.click('text=C\'est parti');
  for (let k = 0; k < 10; k++) {
    const e = ((await p2.textContent('.qz-enonce')) || '').trim();
    const b = await p2.evaluate((e) => { const q = CONFIG.questions.find((x) => x.enonce === e); return q.reponses[q.bonne]; }, e);
    const i = (await p2.locator('.qz-rep-texte').allTextContents()).indexOf(b);
    await p2.locator('.qz-rep').nth(i).click();
    const suite = ((await p2.textContent('.qz-retour .qz-principal')) || '').trim();
    await p2.click('.qz-retour .qz-principal');
    if (suite === 'Terminer la manche') break;
  }
  console.log('6. export bilan:', ((await p2.textContent('h1')) || '').trim());
  await p2.click('text=Voir mon résultat'); await p2.waitForTimeout(200);
  console.log('6. export fin:', ((await p2.textContent('.qz-gain-final')) || '').trim());
  console.log('6. stockage:', await p2.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('qz-champion')).join(',') + ' ' + localStorage.getItem('qz-champion-exemple')));
  await p2.reload(); await p2.waitForTimeout(300);
  console.log('6. apres rechargement: records:', await p2.locator('.qc-tuile').allTextContents(), '| themes:', await p2.locator('.qc-theme-ligne').count());
  await p2.screenshot({path:'e_export_records.png'});

  // ---- 7. reprise d'un brouillon de la version precedente
  const p3 = await ctx.newPage(); p3.on('pageerror',e=>errs.push('V4 '+e.message));
  await p3.evaluate(()=>{}).catch(()=>{});
  await p3.goto('file://'+process.cwd()+'/page_v4.html'); await p3.waitForTimeout(1200);
  await p3.evaluate(()=>{ localStorage.removeItem('atelier-quiz-brouillon-v1'); });
  await p3.reload(); await p3.waitForTimeout(800);
  await p3.click('#tab-questions'); await p3.locator('#liste-questions .q >> nth=0 >> summary').click();
  await p3.fill('#liste-questions .q >> nth=0 >> textarea >> nth=0', 'Quelle méthode de révision ancre le mieux un contenu dans la mémoire à long terme ? (brouillon)');
  await p3.waitForTimeout(900);
  const p4 = await ctx.newPage(); p4.on('pageerror',e=>errs.push('MIGR '+e.message));
  await p4.goto('file://'+process.cwd()+'/page.html'); await p4.waitForTimeout(1200);
  console.log('7. migration:', await p4.evaluate(()=>JSON.stringify({ jeu: cfg.jeu, exemple: cfg.meta.exemple, trouve: cfg.trouve.length, q0: cfg.questions[0].enonce.slice(-12), theme0: cfg.questions[0].theme, sons: Object.keys(cfg.sons.pistes).length })));

  console.log('errs', errs);
  await b.close();
})();
