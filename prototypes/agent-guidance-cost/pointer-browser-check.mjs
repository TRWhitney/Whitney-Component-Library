// Independent trusted interactions for the additional tasks.
export async function checkBundledBrowser(browser, task, trial, port) {
  const rows = [];
  const evaluate = async (expression) =>
    (await browser.evaluate({expression, awaitPromise: true, returnByValue: true})).value;
  const settle = () => evaluate('new Promise(r => setTimeout(() => r(true), 350))');
  let width;
  const check = async (name, expression) => {
    const passed = await evaluate(
      `(async()=>{for(let i=0;i<20;i++){if(${expression})return true;await new Promise(r=>setTimeout(r,100));}return false;})()`,
    );
    const row = {trial, task, width, name, passed: Boolean(passed)};
    rows.push(row);
    browser.record?.(row);
  };
  const type = async (label, text) => browser.type({locator: `label=${label}`, text, clear: true});
  const click = async (name) => browser.click({locator: `role=button[name="${name}"]`});
  for (width of [390, 1280]) {
    await browser.resize({mode: 'freeform', width, height: 800});
    await browser.navigate({url: `http://127.0.0.1:${port}`});
    await browser.snapshot({includeImage: false});
    await settle();
    await evaluate(
      `window.__field = label => Array.from(document.querySelectorAll('input')).find(e=>Array.from(e.labels||[]).some(l=>l.textContent.includes(label)));window.__named = e => e?.getAttribute("aria-label") || (e?.getAttribute("aria-labelledby")||"").split(/\\s+/).map(id=>document.getElementById(id)?.textContent||"").join(" ").trim();window.__linked = e => ['aria-describedby','aria-errormessage'].flatMap(a=>(e?.getAttribute(a)||'').split(/\\s+/)).map(id=>document.getElementById(id)?.textContent||'').join(' ');true`,
    );
    await check('outer fits viewport', 'document.documentElement.scrollWidth<=innerWidth');
    if (task === 'form') {
      await check(
        'heading',
        'Array.from(document.querySelectorAll("h1")).some(e=>e.textContent==="Add contact")',
      );
      await check(
        'visible input labels',
        '["Name","Email"].every(n=>Array.from(window.__field(n)?.labels||[]).some(l=>l.getBoundingClientRect().width>0))',
      );
      await check(
        'initial values',
        '!window.__field("Name")?.value && !window.__field("Email")?.value && !document.querySelector("input[type=checkbox]")?.checked',
      );
      await click('Save contact');
      await settle();
      await check(
        'all custom errors',
        '["Enter a name","Enter a valid email","Accept the terms"].every(s=>document.body.innerText.includes(s))',
      );
      await check(
        'name error associated',
        'window.__linked(window.__field("Name")).includes("Enter a name")',
      );
      await check(
        'email error associated',
        'window.__linked(window.__field("Email")).includes("Enter a valid email")',
      );
      await check(
        'terms error associated',
        'window.__linked(document.querySelector("input[type=checkbox]")).includes("Accept the terms")',
      );
      await type('Name', '   ');
      await type('Email', 'invalid');
      await click('Save contact');
      await settle();
      await check('whitespace rejected', 'document.body.innerText.includes("Enter a name")');
      await check(
        'malformed email rejected',
        'document.body.innerText.includes("Enter a valid email")',
      );
      await check('invalid not saved', '!document.body.innerText.includes("Saved ")');
      await type('Name', '  Grace  ');
      await type('Email', '  grace@example.com  ');
      await click('Save contact');
      await settle();
      await check(
        'terms still required',
        'document.body.innerText.includes("Accept the terms") && !document.body.innerText.includes("Saved ")',
      );
      await evaluate('document.querySelector("input[type=checkbox]").focus();true');
      await browser.press({key: 'Space'});
      await settle();
      await check('keyboard checkbox', 'document.querySelector("input[type=checkbox]").checked');
      await click('Save contact');
      await settle();
      await check(
        'trimmed save',
        'document.body.innerText.includes("Saved Grace, grace@example.com")',
      );
      await check(
        'save announced',
        'Array.from(document.querySelectorAll("[role=status],[aria-live=polite],[aria-live=assertive],output")).some(e=>e.textContent.includes("Saved Grace, grace@example.com"))',
      );
      await check(
        'values retained',
        'window.__field("Name").value.trim()==="Grace" && window.__field("Email").value.trim()==="grace@example.com" && document.querySelector("input[type=checkbox]").checked',
      );
      await check(
        'valid errors cleared',
        '![window.__linked(window.__field("Name")),window.__linked(window.__field("Email")),window.__linked(document.querySelector("input[type=checkbox]"))].some(s=>["Enter a name","Enter a valid email","Accept the terms"].some(message=>s.includes(message))) && !Array.from(document.querySelectorAll("[role=alert]")).some(e=>["Enter a name","Enter a valid email","Accept the terms"].some(s=>e.textContent.includes(s)))',
      );
      await click('Reset');
      await settle();
      await check(
        'reset values',
        '!window.__field("Name").value && !window.__field("Email").value && !document.querySelector("input[type=checkbox]").checked',
      );
      await check(
        'reset feedback',
        '!document.body.innerText.includes("Saved ") && ![window.__linked(window.__field("Name")),window.__linked(window.__field("Email")),window.__linked(document.querySelector("input[type=checkbox]"))].some(s=>["Enter a name","Enter a valid email","Accept the terms"].some(message=>s.includes(message))) && !Array.from(document.querySelectorAll("[role=alert]")).some(e=>["Enter a name","Enter a valid email","Accept the terms"].some(s=>e.textContent.includes(s)))',
      );
      await click('Save contact');
      await settle();
      await check(
        'validation after reset',
        '["Enter a name","Enter a valid email","Accept the terms"].every(s=>document.body.innerText.includes(s))',
      );
    } else {
      await evaluate(
        `window.__names=()=>Array.from(document.querySelectorAll('[role=row],tbody tr')).filter(e=>e.getBoundingClientRect().height>0&&!e.querySelector('[role=columnheader]')).map(e=>(e.querySelector('[role=rowheader],th[scope=row],th,td,[role=gridcell],[role=cell]')?.textContent||'').trim()).filter(n=>['Ada','Grace','Linus'].includes(n));window.__tab=n=>Array.from(document.querySelectorAll('[role=tab]')).find(e=>e.textContent.trim()===n);window.__sort=()=>Array.from(document.querySelectorAll('[role=columnheader],th')).find(e=>/^Name\\b/.test(e.textContent.trim()));true`,
      );
      await check('heading', 'document.querySelector("h1")?.textContent==="People directory"');
      await check(
        'tab list named',
        'window.__named(document.querySelector("[role=tablist]"))==="Directory views"',
      );
      await check('initial tab', 'window.__tab("People")?.getAttribute("aria-selected")==="true"');
      await check(
        'panel relationship',
        'Boolean(document.getElementById(window.__tab("People")?.getAttribute("aria-controls")))',
      );
      await check('search label', 'Boolean(window.__field("Search people"))');
      await check(
        'table named',
        'Array.from(document.querySelectorAll("table,[role=grid],[role=table]")).some(e=>window.__named(e)==="People" || (e.querySelector("caption")?.textContent||"")==="People")',
      );
      await check('initial ascending rows', 'window.__names().join(",")==="Ada,Grace,Linus"');
      await browser.click({locator: 'role=columnheader[name=/^Name/]'});
      await settle();
      await check('descending rows', 'window.__names().join(",")==="Linus,Grace,Ada"');
      await check(
        'descending announced',
        'window.__sort()?.getAttribute("aria-sort")==="descending"',
      );
      await browser.click({locator: 'role=columnheader[name=/^Name/]'});
      await settle();
      await check(
        'ascending again',
        'window.__names().join(",")==="Ada,Grace,Linus" && window.__sort()?.getAttribute("aria-sort")==="ascending"',
      );
      await type('Search people', '  GRACE  ');
      await settle();
      await check('case trimmed search', 'window.__names().join(",")==="Grace"');
      await click('View Grace');
      await settle();
      await check(
        'action status',
        'Array.from(document.querySelectorAll("[role=status],[aria-live=polite],[aria-live=assertive],output")).some(e=>e.textContent.includes("Selected Grace"))',
      );
      await check(
        'action keeps tab',
        'window.__tab("People").getAttribute("aria-selected")==="true"',
      );
      await browser.click({locator: 'role=tab[name="Summary"]'});
      await settle();
      await check(
        'summary selected',
        'window.__tab("Summary").getAttribute("aria-selected")==="true"',
      );
      await check('summary content', 'document.body.innerText.includes("3 people")');
      await browser.press({key: 'ArrowLeft'});
      await settle();
      await check(
        'arrow automatic activation',
        'window.__tab("People").getAttribute("aria-selected")==="true"',
      );
      await check(
        'query preserved',
        'window.__field("Search people")?.value==="  GRACE  " && window.__names().join(",")==="Grace"',
      );
      await check('selection preserved', 'document.body.innerText.includes("Selected Grace")');
      await type('Search people', 'nothing');
      await settle();
      await check(
        'no matches',
        'document.body.innerText.includes("No matches") && window.__names().length===0',
      );
      await click('Clear search');
      await settle();
      await check(
        'clear restores rows',
        'window.__field("Search people").value==="" && window.__names().length===3',
      );
      await type('Search people', 'ada@example');
      await settle();
      await check('email search', 'window.__names().join(",")==="Ada"');
      await browser.press({key: 'Escape'});
      await settle();
      await check(
        'Escape clears',
        'window.__field("Search people").value==="" && window.__names().length===3',
      );
      await check('final fits viewport', 'document.documentElement.scrollWidth<=innerWidth');
    }
  }
  return rows;
}
