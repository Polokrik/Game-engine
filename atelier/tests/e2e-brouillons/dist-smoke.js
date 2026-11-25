const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport:{width:1400,height:900} });
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
  await p.goto('file:///home/user/atelier-quiz/dist/atelier-jeux.html'); await p.waitForTimeout(1500);
  console.log('titre:', await p.title(), '| type de jeu:', await p.inputValue('#f-jeu'), '| apercu:', (await p.locator('#scene').locator('h1').first().textContent()));
  await p.setViewportSize({width:400,height:850}); await p.waitForTimeout(300);
  console.log('largeur 400px, defilement horizontal:', await p.evaluate(()=>document.documentElement.scrollWidth > 400));
  console.log('errs', errs); await b.close();
})();
