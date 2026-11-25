const { chromium } = require('playwright');
const PAGE = 'file:///home/user/game-engine/atelier/atelier-jeux.html';
(async () => {
  const b = await chromium.launch({ args:['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await b.newContext({ viewport:{width:1400,height:1000} });
  const errs=[]; const p = await ctx.newPage(); p.on('pageerror',e=>errs.push('PAGE '+e.message));
  // instrumente Audio pour suivre les pistes : volume, boucle, lecture
  await p.addInitScript(() => { window.__A=[]; const O=window.Audio; window.Audio=function(s){ const a=new O(s); a.__len=String(s||'').length; window.__A.push(a); return a; }; window.Audio.prototype=O.prototype; });
  await p.goto(PAGE); await p.waitForTimeout(1500);
  const sc = p.locator('#scene');
  const amb = () => p.evaluate(()=>{ const a=window.__A.filter(x=>x.loop); return a.length?{n:a.length,paused:a[0].paused,vol:+a[0].volume.toFixed(2),loop:a[0].loop}:null; });
  await p.click('#tab-sons');
  console.log('1. emplacement musique :', await p.locator('#liste-sons h3').first().textContent());
  await p.click('#btn-ambiance'); await p.waitForTimeout(500);
  console.log('2. nom piste :', (await p.locator('#liste-sons .son-nom').first().textContent()));
  await p.selectOption('#f-vue','accueil').catch(()=>{}); await p.waitForTimeout(600);
  const btnAvec = sc.locator('text=Commencer avec le son');
  console.log('3. choix son présent :', await btnAvec.count());
  await btnAvec.click(); await p.waitForTimeout(2500);
  console.log('4. musique après démarrage (vol attendu ~0,25 ou atténué par le lancement) :', JSON.stringify(await amb()));
  console.log('5. bouton musique :', (await sc.locator('[data-musique]').first().textContent()), '| pressed', await sc.locator('[data-musique]').first().getAttribute('aria-pressed'));
  await sc.locator('[data-musique]').first().click(); await p.waitForTimeout(900);
  console.log('6. après clic Musique :', JSON.stringify(await amb()), '|', await sc.locator('[data-musique]').first().textContent());
  await sc.locator('[data-musique]').first().click(); await p.waitForTimeout(2000);
  console.log('7. remise :', JSON.stringify(await amb()));
  // effet sonore : répondre -> la musique baisse puis remonte
  console.log('rep btns', await sc.locator('button.qz-rep, .qz-reponses button').count()); await sc.locator('.qz-reponses button').first().click(); await p.waitForTimeout(300); const v=sc.locator('button:has-text("Valider")'); if(await v.count()) await v.first().click();
  let mini=1; for(let i=0;i<40;i++){ await p.waitForTimeout(150); const x=await amb(); if(x&&x.vol<mini) mini=x.vol; } const pendant={mini};
  await p.waitForTimeout(6000); const apres=await amb();
  console.log('8. pendant effet :', JSON.stringify(pendant), '| après :', JSON.stringify(apres));
  console.log('son btn', await sc.locator('[data-son]').count(), await sc.locator('[data-son]').first().textContent()); await sc.locator('[data-son]').first().click(); await p.waitForTimeout(800);
  console.log('9. Son coupé -> musique :', JSON.stringify(await amb()));
  console.log('son btn après', await sc.locator('[data-son]').first().textContent(), '| musique btn', await sc.locator('[data-musique]').count()); await p.waitForTimeout(1500); console.log('9b', JSON.stringify(await amb())); await p.screenshot({path:'/tmp/claude-0/amb.png'});
  console.log('erreurs :', errs);
  await b.close();
})();
