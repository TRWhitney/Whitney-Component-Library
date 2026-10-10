// Independent checks using the T3 collaborative browser, not a second browser system.
export async function checkDiscoveryBrowser(browser, condition, port) {
  const results = [];
  const evaluate = async (expression) =>
    (await browser.evaluate({expression, awaitPromise: true, returnByValue: true})).value;
  const settle = () => evaluate('new Promise(resolve => setTimeout(() => resolve(true), 750))');
  const check = async (name, expression) => {
    // Test the settled result, allowing the library's exit animation and focus restoration.
    const passed = await evaluate(
      `(async () => {for (let i = 0; i < 30; i++) {if (${expression}) return true; await new Promise(resolve => setTimeout(resolve, 100));} return false;})()`,
    );
    const result = {condition, width, name, passed: Boolean(passed)};
    results.push(result);
    browser.record?.(result);
  };
  let width;
  for (width of [390, 1280]) {
    await browser.resize({mode: 'freeform', width, height: 800});
    await browser.navigate({url: `http://127.0.0.1:${port}`});
    await browser.snapshot({includeImage: false});
    await settle();
    await check('initial name', `document.body.innerText.includes('Ada')`);
    await check('page fits viewport', 'document.documentElement.scrollWidth <= innerWidth');
    await browser.click({locator: 'role=button[name="Edit profile"]'});
    await browser.snapshot({includeImage: false});
    await settle();
    await evaluate(
      `window.__editor = () => document.querySelector('dialog[open], [role="dialog"]'); window.__name = () => window.__editor()?.querySelector('input'); window.__accessibleText = (element, attribute) => (element?.getAttribute(attribute) || '').split(/\\s+/).filter(Boolean).map(id => document.getElementById(id)?.textContent || '').join(' '); true`,
    );
    await check('dialog opens', 'Boolean(window.__editor())');
    await check(
      'dialog named',
      `window.__editor()?.getAttribute('aria-label') === 'Edit profile' || window.__accessibleText(window.__editor(), 'aria-labelledby').trim() === 'Edit profile'`,
    );
    await check(
      'dialog description',
      `window.__accessibleText(window.__editor(), 'aria-describedby').includes('Update your display name')`,
    );
    await check(
      'dialog modal',
      `window.__editor()?.getAttribute('aria-modal') === 'true' || window.__editor()?.matches('dialog:modal') || Boolean(Array.from(document.querySelectorAll('button')).find(button => button.textContent.trim() === 'Edit profile')?.closest('[inert], [aria-hidden="true"]'))`,
    );
    await check('initial input', `window.__name()?.value === 'Ada'`);
    await check(
      'visible field label',
      `Array.from(window.__name()?.labels || []).some(label => label.textContent.includes('Name') && label.getBoundingClientRect().width > 0)`,
    );
    await check('focus enters', 'window.__editor()?.contains(document.activeElement)');
    await check(
      'editor fits viewport',
      'window.__editor()?.getBoundingClientRect().left >= 0 && window.__editor()?.getBoundingClientRect().right <= innerWidth && document.documentElement.scrollWidth <= innerWidth',
    );
    await evaluate(
      `window.__tabbables = () => Array.from(window.__editor().querySelectorAll('button,input,select,textarea,a[href],[tabindex]')).filter(element => element.tabIndex >= 0 && !element.disabled && element.getBoundingClientRect().width > 2 && element.getBoundingClientRect().height > 2); window.__tabbables().at(-1)?.focus(); true`,
    );
    await browser.press({key: 'Tab'});
    await check('Tab boundary contained', 'window.__editor()?.contains(document.activeElement)');
    await evaluate('window.__tabbables()[0]?.focus(); true');
    await browser.press({key: 'Tab', modifiers: ['Shift']});
    await check(
      'ShiftTab boundary contained',
      'window.__editor()?.contains(document.activeElement)',
    );
    await browser.type({locator: 'role=textbox[name="Name"]', text: '', clear: true});
    await browser.click({locator: 'role=button[name="Save"]'});
    await settle();
    await check(
      'empty rejected with message',
      `Boolean(window.__editor()) && window.__editor().innerText.includes('Enter a name')`,
    );
    await browser.type({locator: 'role=textbox[name="Name"]', text: '   ', clear: true});
    await browser.click({locator: 'role=button[name="Save"]'});
    await settle();
    await check(
      'whitespace rejected',
      `Boolean(window.__editor()) && window.__editor().innerText.includes('Enter a name')`,
    );
    await check(
      'error associated',
      `window.__accessibleText(window.__name(), 'aria-describedby').includes('Enter a name') || window.__accessibleText(window.__name(), 'aria-errormessage').includes('Enter a name')`,
    );
    await browser.type({locator: 'role=textbox[name="Name"]', text: '  Grace  ', clear: true});
    await browser.click({locator: 'role=button[name="Save"]'});
    await settle();
    await check('save closes', '!window.__editor()');
    await check(
      'trimmed save',
      `document.body.innerText.includes('Grace') && !document.body.innerText.includes('Ada')`,
    );
    await check(
      'save focus return',
      `document.activeElement?.textContent.trim() === 'Edit profile'`,
    );
    await browser.click({locator: 'role=button[name="Edit profile"]'});
    await settle();
    await check('reopen saved value', `window.__name()?.value === 'Grace'`);
    await check('reopen clears error', `!window.__editor()?.innerText.includes('Enter a name')`);
    await browser.type({locator: 'role=textbox[name="Name"]', text: 'Unsaved', clear: true});
    await browser.click({locator: 'role=button[name="Cancel"]'});
    await settle();
    await check(
      'cancel discards',
      `!window.__editor() && document.body.innerText.includes('Grace') && !document.body.innerText.includes('Unsaved')`,
    );
    await check(
      'cancel focus return',
      `document.activeElement?.textContent.trim() === 'Edit profile'`,
    );
    await browser.click({locator: 'role=button[name="Edit profile"]'});
    await settle();
    await browser.type({locator: 'role=textbox[name="Name"]', text: 'Unsaved', clear: true});
    await browser.press({key: 'Escape'});
    await settle();
    await check(
      'Escape discards',
      `!window.__editor() && document.body.innerText.includes('Grace') && !document.body.innerText.includes('Unsaved')`,
    );
    await check(
      'Escape focus return',
      `document.activeElement?.textContent.trim() === 'Edit profile'`,
    );
  }
  return results;
}
