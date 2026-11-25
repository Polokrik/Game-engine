const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args:['--autoplay-policy=no-user-gesture-required'] });
  const p = await (await b.newContext({ viewport:{width:1400,height:1000} })).newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.addInitScript(() => { window.__A=[]; const O=window.Audio; window.Audio=function(s){ const a=new O(s); window.__A.push(a); return a; }; window.Audio.prototype=O.prototype; });
  await p.goto('file:///home/user/game-engine/atelier/atelier-jeux.html'); await p.waitForTimeout(1500);
  await p.selectOption('#f-jeu','champion').catch(async()=>{ console.log('selecteur jeu ?'); });
  await p.waitForTimeout(600);
  await p.click('#tab-sons'); await p.click('#btn-ambiance'); await p.waitForTimeout(400);
  const sc=p.locator('#scene'); await p.selectOption('#f-vue','accueil').catch(()=>{}); await p.waitForTimeout(500);
  await sc.locator('text=Commencer avec le son').click(); await p.waitForTimeout(2500);
  const amb=()=>p.evaluate(()=>{const a=window.__A.filter(x=>x.loop)[0]; return a?{paused:a.paused,vol:+a.volume.toFixed(2)}:null;});
  console.log('son btn', await sc.locator('[data-son]').count(), 'ecran', (await sc.locator('h1,h2').first().textContent())); console.log('musique :', JSON.stringify(await amb()), '| nb boutons musique', await sc.locator('[data-musique]').count());
  if(await sc.locator('[data-musique]').count()){ await sc.locator('[data-musique]').first().click(); } await p.waitForTimeout(900); console.log('coupée :', JSON.stringify(await amb()));
  await b.close(); console.log('erreurs', errs);
})();
