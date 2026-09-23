/* ─────────────────────────────────────────────────────────────
 * ui.js —— 文字的层：神谕、经文、提示、七日之印、创世日志、标题、终幕
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const $ = id => document.getElementById(id);

  let el = {};
  let narrQueue = [], narrTimer = 0, narrShowing = false;
  let hintTimer = 0;
  let utterText = '', utterShown = 0, utterFadeT = 0, utterState = 'idle';

  const DAY_CH = ['一', '二', '三', '四', '五', '六', '七'];
  const DAY_NAME = ['起初', '第一日', '第二日', '第三日', '第四日', '第五日', '第六日', '第七日'];

  function init() {
    el = {
      utter: $('utter'), scripture: $('scripture'), hint: $('hint'), days: $('days'),
      ledger: $('ledger'), title: $('title'), titleBtns: $('titleBtns'), titlePrompt: $('titlePrompt'),
      help: $('help'), tools: $('tools'), tag: $('tag'), finale: $('finale'),
      bLedger: $('bLedger'), bSound: $('bSound'), bFull: $('bFull'), bHelp: $('bHelp'),
    };
    el.days.innerHTML = DAY_CH.map(c => '<span>' + c + '</span>').join('');
  }

  // ── 神谕：按住时逐字浮现 ────────────────────────────────────
  function utterBegin(text, tint) {
    utterText = text;
    utterShown = 0;
    utterState = 'speaking';
    el.utter.classList.remove('scatter');
    el.utter.innerHTML = Array.from(text).map(ch =>
      ch === ' ' ? '<span class="ch">&nbsp;</span>' : '<span class="ch">' + ch + '</span>').join('');
    el.utter.style.opacity = '1';
    el.utter.style.transition = 'opacity 0.3s ease';
    const c = tint || [190, 215, 255];
    el.utter.style.setProperty('--utter-glow', U.rgba(c[0], c[1], c[2], 0.6));
  }
  // charge 0..1：按比例显出文字（在 0.85 时说完，余下的是"充盈"）
  function utterProgress(charge) {
    if (utterState !== 'speaking') return;
    const chars = el.utter.children;
    const n = Math.min(chars.length, Math.ceil((charge / 0.85) * chars.length));
    for (let i = utterShown; i < n; i++) chars[i].classList.add('on');
    if (n > utterShown) utterShown = n;
    el.utter.style.transform = 'scale(' + (0.97 + 0.05 * charge).toFixed(4) + ')';
    el.utter.style.filter = charge >= 1 ? 'brightness(1.25)' : '';
  }
  // 说满松手：话语成就——文字化光而去
  function utterFulfill() {
    utterState = 'fulfilled';
    el.utter.style.transition = 'opacity 1.6s ease 0.5s, transform 2.2s ease, filter 1.2s ease';
    el.utter.style.transform = 'scale(1.08)';
    el.utter.style.filter = 'brightness(1.6) blur(1px)';
    el.utter.style.opacity = '0';
  }
  // 话未说完：声息散去
  function utterCancel() {
    utterState = 'idle';
    el.utter.classList.add('scatter');
    el.utter.style.transition = 'opacity 1s ease';
    el.utter.style.opacity = '0';
  }

  // ── 经文：一句一句浮现；新的旁白会取代尚未显示的旧旁白 ───────
  // lines: [{text, ref, hold}]；opts.replace 默认 true
  function narrate(lines, opts) {
    opts = opts || {};
    if (!Array.isArray(lines)) lines = [lines];
    if (opts.replace !== false) { narrQueue = []; clearTimeout(narrTimer); }
    narrQueue.push(...lines);
    if (opts.replace !== false || !narrShowing) nextLine(opts.delay || 0);
  }
  function nextLine(delay) {
    clearTimeout(narrTimer);
    const line = narrQueue.shift();
    if (!line) {
      narrShowing = false;
      el.scripture.classList.remove('show');
      return;
    }
    narrShowing = true;
    const show = () => {
      el.scripture.innerHTML = line.text + (line.ref ? '<span class="ref">' + line.ref + '</span>' : '');
      el.scripture.classList.add('show');
      hideHint();
      if (!line.silent) GS.bus.emit('scripture', line);
      const hold = (line.hold || Math.max(4.2, 1.6 + line.text.length * 0.2)) * 1000 / (W.fast || 1);
      narrTimer = setTimeout(() => {
        if (narrQueue.length) {
          el.scripture.classList.remove('show');
          narrTimer = setTimeout(() => nextLine(0), 1300 / (W.fast || 1));
        } else {
          el.scripture.classList.remove('show');
          narrShowing = false;
        }
      }, hold);
    };
    if (el.scripture.classList.contains('show') || delay) {
      el.scripture.classList.remove('show');
      narrTimer = setTimeout(show, Math.max(delay * 1000, el.scripture.classList.contains('show') ? 900 : 0) / (W.fast || 1));
    } else show();
  }
  function clearNarration() {
    narrQueue = []; clearTimeout(narrTimer); narrShowing = false;
    el.scripture.classList.remove('show');
  }
  const narrating = () => narrShowing || narrQueue.length > 0;

  // ── 提示 ────────────────────────────────────────────────────
  function hint(text, dur) {
    el.hint.textContent = text;
    el.hint.classList.add('show');
    clearTimeout(hintTimer);
    if (dur) hintTimer = setTimeout(hideHint, dur * 1000);
  }
  function hideHint() { clearTimeout(hintTimer); el.hint.classList.remove('show'); }

  // ── 七日之印 ────────────────────────────────────────────────
  function setDays(day, sealed, holy) {
    const spans = el.days.children;
    for (let i = 0; i < 7; i++) {
      const s = spans[i];
      s.className = '';
      if (holy && i === 6) s.classList.add('holy');
      else if (i < sealed) s.classList.add('done');
      else if (i === day - 1) s.classList.add('now');
    }
  }
  function showDays(on) { el.days.classList.toggle('show', !!on); }
  function showTools(on) { el.tools.classList.toggle('show', !!on); }

  // ── 创世日志：God is the first vibecoder ─────────────────────
  // 每一句话语是一条命令；每一日是一次提交。
  function renderLedger(stages, done) {
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    let html = '<h2>创世日志</h2><div class="sub">~/heavens-and-earth · branch: main</div>';
    if (done <= 0) {
      html += '<div class="ln"><span class="r"># 空虚混沌。按住画面，说出第一句话。</span></div>';
    }
    let lastDay = -1;
    for (let i = 0; i < Math.min(done, stages.length); i++) {
      const s = stages[i];
      if (s.day !== lastDay && s.day > 0) {
        lastDay = s.day;
        html += '<div class="day">' + DAY_NAME[s.day] + '</div>';
      }
      const isNew = i === done - 1;
      html += '<div class="ln' + (isNew ? ' new' : '') + '"><span class="p">' + (i === 0 ? '$ ' : '✓ ') +
        '</span><span class="c">' + esc(s.cmd) + '</span>  <span class="r"># ' + esc(s.ref || '') + '</span></div>';
    }
    if (done >= stages.length) {
      html += '<div class="ok">✓ build passed · 神看着一切所造的都甚好</div>';
      html += '<div class="ln" style="margin-top:14px"><span class="p">$ </span><span class="c cursor"></span></div>';
      html += '<div style="margin-top:26px"><button data-act="restart" class="restart">重新创世</button></div>';
    } else {
      html += '<div class="ln" style="margin-top:14px"><span class="p">$ </span><span class="c cursor"></span></div>';
    }
    el.ledger.innerHTML = html;
    const nw = el.ledger.querySelector('.new');
    if (nw && el.ledger.classList.contains('open')) nw.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  function toggleLedger(force) {
    const open = force == null ? !el.ledger.classList.contains('open') : force;
    el.ledger.classList.toggle('open', open);
    document.body.classList.toggle('show-cursor', open || el.help.classList.contains('show'));
    if (open) {
      const nw = el.ledger.querySelector('.new') || el.ledger.querySelector('.cursor');
      if (nw) setTimeout(() => nw.scrollIntoView({ block: 'center' }), 50);
    }
    return open;
  }
  function toggleHelp(force) {
    const show = force == null ? !el.help.classList.contains('show') : force;
    el.help.classList.toggle('show', show);
    document.body.classList.toggle('show-cursor', show || el.ledger.classList.contains('open'));
    return show;
  }
  const panelOpen = () => el.ledger.classList.contains('open') || el.help.classList.contains('show');

  // ── 标题 ────────────────────────────────────────────────────
  function showTitle(saved, onNew, onContinue) {
    el.title.classList.remove('gone');
    el.title.style.display = '';
    el.titleBtns.innerHTML = '';
    if (saved && saved.stage > 0) {
      el.titlePrompt.textContent = '按住画面 · 继续创世';
      const cont = document.createElement('button');
      cont.textContent = '继续 · ' + (saved.stage >= GS.story.STAGES.length ? '安息' : DAY_NAME[saved.day] || '');
      const neo = document.createElement('button');
      neo.textContent = '重新创世';
      [cont, neo].forEach(b => {
        b.addEventListener('pointerdown', e => e.stopPropagation());
        b.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
      });
      cont.addEventListener('click', e => { e.stopPropagation(); onContinue(); });
      neo.addEventListener('click', e => { e.stopPropagation(); onNew(); });
      el.titleBtns.appendChild(cont);
      el.titleBtns.appendChild(neo);
    } else {
      el.titlePrompt.textContent = '按住画面 · 说「起初」';
    }
  }
  function hideTitle() {
    el.title.classList.remove('dim');
    el.title.classList.add('gone');
    setTimeout(() => { if (el.title.classList.contains('gone')) el.title.style.display = 'none'; }, 2400);
  }
  function setTitlePrompt(t) { el.titlePrompt.textContent = t; }
  function dimTitle(on) { el.title.classList.toggle('dim', !!on); }

  // ── 生灵之名（安息后） ──────────────────────────────────────
  let tagName = '';
  function tag(text, x, y) {
    if (!text) { el.tag.classList.remove('show'); tagName = ''; return; }
    if (text !== tagName) { el.tag.textContent = text; tagName = text; }
    el.tag.style.left = x + 'px';
    el.tag.style.top = y + 'px';
    el.tag.classList.add('show');
  }

  // ── 终幕 ────────────────────────────────────────────────────
  function finale(on) { el.finale.classList.toggle('show', !!on); }

  function setSoundButton(muted) { el.bSound.classList.toggle('off', !!muted); }

  GS.ui = {
    init, utterBegin, utterProgress, utterFulfill, utterCancel,
    narrate, clearNarration, narrating, hint, hideHint,
    setDays, showDays, showTools, renderLedger, toggleLedger, toggleHelp, panelOpen,
    showTitle, hideTitle, setTitlePrompt, dimTitle, tag, finale, setSoundButton,
    DAY_NAME,
    get el() { return el; },
  };
})(window.GS);
