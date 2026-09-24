/* ─────────────────────────────────────────────────────────────
 * ui.js —— 文字的层：神谕、经文、提示、七日之印、创世日志、标题、终幕
 * ───────────────────────────────────────────────────────────── */
(function (GS) {
  'use strict';
  const U = GS.util, W = GS.W;
  const $ = id => document.getElementById(id);

  let el = {};
  let narrQueue = [], narrTimer = 0, narrShowing = false;
  // 经文的节拍按世界时间（与情节同步；慢设备、切走标签页时一同停住）
  const later = (ms, fn) => (GS.book && GS.book.after ? GS.book.after(ms / 1000, fn) : setTimeout(fn, ms / (W.fast || 1)));
  const cancel = h => { if (!h) return; if (typeof h === 'object') { if (GS.book && GS.book.cancel) GS.book.cancel(h); } else clearTimeout(h); };
  let hintTimer = 0;
  let utterText = '', utterShown = 0, utterFadeT = 0, utterState = 'idle';

  const DAY_CH = ['一', '二', '三', '四', '五', '六', '七'];
  const DAY_NAME = ['起初', '头一日', '第二日', '第三日', '第四日', '第五日', '第六日', '第七日'];

  function init() {
    el = {
      utter: $('utter'), scripture: $('scripture'), hint: $('hint'), days: $('days'),
      ledger: $('ledger'), title: $('title'), titleBtns: $('titleBtns'), titlePrompt: $('titlePrompt'),
      help: $('help'), tools: $('tools'), tag: $('tag'), finale: $('finale'),
      act: $('act'), actcard: $('actcard'), toc: $('toc'),
      bLedger: $('bLedger'), bToc: $('bToc'), bSound: $('bSound'), bFull: $('bFull'), bHelp: $('bHelp'), bShot: $('bShot'),
    };
    el.days.innerHTML = DAY_CH.map(c => '<span><b>' + c + '</b><i class="g"></i></span>').join('');
  }

  // ── 神谕：按住时逐字浮现 ────────────────────────────────────
  let utterKind = '', utterChars = [];
  const PUNCT = /[，。、；：！？「」『』（）…—,.;:!?]/;
  // 每个字带一点手写的随性：微斜、微高低、微大小，言说时轻轻浮动
  function utterBegin(text, tint, kind) {
    utterText = text;
    utterKind = kind || '';
    utterShown = 0;
    utterState = 'speaking';
    el.utter.className = 'layer' + (kind ? ' k-' + kind : '');
    let k = 0;
    // 以标点为界分成若干段，段内不折行：名字与词语不会被拆到两行（太长的段仍可折行，免得溢出窄屏）
    const segs = [[]];
    Array.from(text).forEach(ch => {
      if (ch === ' ') { segs.push([]); return; }
      const pu = PUNCT.test(ch);
      const r = pu ? 0 : (Math.random() * 2 - 1) * 3.4;
      const y = pu ? 0 : (Math.random() * 2 - 1) * 0.07;
      const sc = pu ? 1 : 0.93 + Math.random() * 0.17;
      segs[segs.length - 1].push('<span class="ch' + (pu ? ' pu' : '') + '" style="--r:' + r.toFixed(2) + 'deg;--y:' + y.toFixed(3) + 'em;--s:' + sc.toFixed(3) +
        ';--f:' + (-Math.random() * 3.4).toFixed(2) + 's;--k:' + (k++) + '"><i>' + ch + '</i></span>');
      if (pu) segs.push([]);
    });
    el.utter.innerHTML = segs.filter(g => g.length).map(g => '<span class="seg' + (g.length > 8 ? ' long' : '') + '">' + g.join('') + '</span>').join('');
    utterChars = el.utter.querySelectorAll('.ch');
    el.utter.style.transition = 'opacity 0.3s ease';
    el.utter.style.opacity = '1';
    el.utter.style.transform = '';
    el.utter.style.filter = '';
    const c = tint || [190, 215, 255];
    el.utter.style.setProperty('--utter-glow', U.rgba(c[0], c[1], c[2], 0.6));
  }
  // 返回当前显出的字数
  function utterProgress(charge) {
    if (utterState !== 'speaking') return utterShown;
    const chars = utterChars;
    // 「甚好」：先看，后说——前半段只是凝视，话语在后半段才浮现
    const f = utterKind === 'behold' ? Math.max(0, (charge - 0.45) / 0.4) : charge / 0.85;
    const n = Math.min(chars.length, Math.ceil(f * chars.length));
    for (let i = utterShown; i < n; i++) chars[i].classList.add('on');
    if (n > utterShown) utterShown = n;
    el.utter.style.transform = 'scale(' + (0.97 + 0.05 * charge).toFixed(4) + ')';
    el.utter.style.filter = charge >= 1 ? 'brightness(1.3)' : '';
    return utterShown;
  }
  // 说满松手：话语成就——一字接一字化光升去
  function utterFulfill() {
    utterState = 'fulfilled';
    const chars = utterChars;
    for (let i = 0; i < chars.length; i++) chars[i].classList.add('on');
    el.utter.classList.add('done');
    el.utter.style.transition = 'transform 2.6s ease, filter 1.4s ease';
    el.utter.style.transform = 'scale(1.06)';
    el.utter.style.filter = 'brightness(1.2)';
  }
  // 话未说完：墨散入水
  function utterCancel() {
    utterState = 'idle';
    el.utter.classList.add('scatter');
    el.utter.style.transform = '';
    el.utter.style.filter = '';
  }

  // 经文逐字包裹：一字一痕，如墨渗入纸；出处落一方朱印
  // 经文按标点分成若干小段，段内不折行：只在标点之后换行（「形像」「刑罚」不会被拆开）；太长的段仍可折行，免得溢出窄屏
  const PH_END = /[，。；：、！？」』）…,.;:!?]/;
  function inkText(text, ref) {
    let k = 0;
    const body = String(text).split(/<br\s*\/?>/i).map(part => {
      const segs = [[]];
      const chars = Array.from(part);
      chars.forEach((ch, i) => {
        segs[segs.length - 1].push('<span class="sc" style="--k:' + (k++) + '">' + ch + '</span>');
        if (PH_END.test(ch) && !(chars[i + 1] && PH_END.test(chars[i + 1]))) segs.push([]);
      });
      return segs.filter(g => g.length).map(g => '<span class="ph' + (g.length > 16 ? ' long' : '') + '">' + g.join('') + '</span>').join('');
    }).join('<br>');
    return body + (ref ? '<span class="ref"><span class="seal" style="--k:' + k + '">' + ref + '</span></span>' : '');
  }

  // ── 经文：一句一句浮现；新的旁白会取代尚未显示的旧旁白 ───────
  // lines: [{text, ref, hold}]；opts.replace 默认 true
  function narrate(lines, opts) {
    opts = opts || {};
    if (!Array.isArray(lines)) lines = [lines];
    if (opts.replace !== false) { narrQueue = []; cancel(narrTimer); }
    narrQueue.push(...lines);
    if (opts.replace !== false || !narrShowing) nextLine(opts.delay || 0);
  }
  function nextLine(delay) {
    cancel(narrTimer);
    const line = narrQueue.shift();
    if (!line) {
      narrShowing = false;
      el.scripture.classList.remove('show');
      return;
    }
    narrShowing = true;
    const show = () => {
      el.scripture.innerHTML = inkText(line.text, line.ref);
      void el.scripture.offsetWidth;            // 先让每个字以"未干"的样子出现，再逐字渗开
      el.scripture.classList.add('show');
      hideHint();
      if (!line.silent) GS.bus.emit('scripture', line);
      const hold = (line.hold || Math.max(4.2, 1.6 + line.text.length * 0.2)) * 1000;
      narrTimer = later(hold, () => {
        if (narrQueue.length) {
          el.scripture.classList.remove('show');
          narrTimer = later(1300, () => nextLine(0));
        } else {
          el.scripture.classList.remove('show');
          narrShowing = false;
        }
      });
    };
    const wasShown = el.scripture.classList.contains('show');
    if (wasShown || delay) {
      el.scripture.classList.remove('show');
      narrTimer = later(Math.max(delay * 1000, wasShown ? 900 : 0), show);
    } else show();
  }
  // 故事仍在展开时，经文下方有一行轻轻呼吸的「· · ·」
  let unfolding = false;
  function setUnfolding(on) { if (on !== unfolding) { unfolding = on; el.scripture.classList.toggle('unfolding', on); } }
  // 大地已成之后，经文移到海的一侧（不遮住地上正发生的事）
  function setStage(acts) { document.body.classList.toggle('acts', !!acts); }
  function clearNarration() {
    narrQueue = []; cancel(narrTimer); narrShowing = false;
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
  // day：当前第几日；sealed：已封存（黎明已至）的日数；holy：第七日已定为圣日
  // goods[d]：第 d 日已出现几次「神看着是好的」（2 = 甚好）；breaths：第七日静止的息数（0..7，null 为不显示）
  function setDays(day, sealed, holy, goods, breaths) {
    const spans = el.days.children;
    for (let i = 0; i < 7; i++) {
      const s = spans[i];
      let cls = '';
      if (breaths != null) cls = i < breaths ? 'breath' : '';
      else if (holy && i === 6) cls = 'holy';
      else if (i < sealed) cls = 'done';
      else if (i === day - 1) cls = 'now';
      if (s.className !== cls) s.className = cls;
      const g = goods ? goods[i + 1] || 0 : 0;
      const gi = s.querySelector('.g');
      const want = g >= 2 ? '<em></em><em class="big"></em>' : '<em></em>'.repeat(g);
      if (gi.innerHTML !== want) gi.innerHTML = want;
    }
  }
  function showDays(on) { el.days.classList.toggle('show', !!on); }
  function showTools(on) { el.tools.classList.toggle('show', !!on); }

  // ── 创世日志：God is the first vibecoder ─────────────────────
  // 每一句话语是一条命令；每一日是一次提交。
  // 每一次言说都是一次提交：一个由句序决定的短哈希
  function hash(i) {
    let h = (i + 1) * 2654435761 >>> 0;
    h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995) >>> 0; h ^= h >>> 15;
    return ('000000' + (h >>> 0).toString(16)).slice(-7);
  }
  function renderLedger(stages, done, acts) {
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    let html = '<h2>创世日志</h2><div class="sub">~/heavens-and-earth · branch: main</div>';
    if (done <= 0) {
      html += '<div class="ln"><span class="r"># 空虚混沌。按住画面，说出第一句话。</span></div>';
    }
    let lastDay = -1, lastAct = 0, lastBook = acts && acts[0] ? acts[0].book : '';
    if (done > 0 && acts && acts[0]) html += '<div class="bk">' + esc(acts[0].book) + '</div>';
    for (let i = 0; i < Math.min(done, stages.length); i++) {
      const s = stages[i];
      if (s.act > 0 && s.act !== lastAct && acts && acts[s.act]) {
        lastAct = s.act;
        const a = acts[s.act];
        if (a.book !== lastBook) { lastBook = a.book; html += '<div class="bk">' + esc(a.book) + '<span>' + esc(a.ordinal || '') + '</span></div>'; }
        html += '<div class="act">' + esc(a.title) + '<span>' + esc(a.sub || '') + '</span></div>';
        html += '<div class="ln"><span class="p">$ </span><span class="c">git checkout -b ' + esc(a.id) + '</span></div>';
      } else if (s.act === 0 && s.day !== lastDay && s.day > 0) {
        lastDay = s.day;
        html += '<div class="day">' + DAY_NAME[s.day] + '</div>';
      }
      const isNew = i === done - 1;
      html += '<div class="ln' + (isNew ? ' new' : '') + '"><span class="h">' + hash(i) + '</span> <span class="p">' + (i === 0 ? '$ ' : '✓ ') +
        '</span><span class="c">' + esc(s.cmd) + '</span>  <span class="r"># ' + esc(s.ref || '') + '</span></div>';
    }
    if (acts && acts.length > 1 && done > acts[0].last && (done < stages.length)) {
      // 七日已成：在第一卷之后留一行
    }
    if (done >= stages.length) {
      const spoken = stages.filter(s => s.utter).length;
      html += '<div class="ok">✓ build passed · 旧约 39 卷 · 929 章</div>';
      html += '<div class="ln"><span class="r">' + spoken + ' 句话 · 0 个 bug</span></div>';
      html += '<div class="ln"><span class="r">God is the first vibecoder.</span></div>';
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
  const panelOpen = () => el.ledger.classList.contains('open') || el.help.classList.contains('show') || !!(el.toc && el.toc.classList.contains('open'));

  // ── 目录：三十九卷，每一幕都可翻到 ──────────────────────────
  let tocKey = '';
  function renderToc(acts, stage, max, mode) {
    if (!el.toc || !acts) return;
    const cur = stage >= GS.story.STAGES.length ? -1 : (GS.story.STAGES[stage] ? GS.story.STAGES[stage].act : -1);
    const key = cur + '/' + max + '/' + acts.length + '/' + mode;
    if (key === tocKey) return;
    tocKey = key;
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const B = GS.book.BOOKS, G = GS.book.GROUPS;
    let html = '<h2>目录</h2><div class="sub">旧约 · 三十九卷 · 点一幕便翻到那里</div>';
    let lastGroup = -1, lastBook = '';
    for (const a of acts) {
      const bk = B[(a.books && a.books[0] ? a.books[0] : 1) - 1] || B[0];
      if (bk.group !== lastGroup) { lastGroup = bk.group; html += '<div class="grp">' + G[bk.group] + '</div>'; }
      if (a.book !== lastBook) {
        lastBook = a.book;
        const names = (a.books || []).map(n => B[n - 1] && B[n - 1].name).filter(Boolean);
        const sub = names.length > 1 ? names.join(' · ') : (a.ordinal || '');
        html += '<div class="bk">' + esc(a.book) + '<span>' + esc(sub) + '</span></div>';
      }
      const st = a.index === cur ? ' cur' : a.first <= max ? ' done' : '';
      const ref = String(a.sub || '').replace(/^\S+\s+/, '');
      html += '<button class="it' + st + '" data-stage="' + a.first + '">' + esc(a.title) + '<span>' + esc(ref) + '</span></button>';
    }
    el.toc.innerHTML = html;
  }
  function toggleToc(force) {
    if (!el.toc) return false;
    const open = force == null ? !el.toc.classList.contains('open') : force;
    el.toc.classList.toggle('open', open);
    document.body.classList.toggle('show-cursor', open || el.help.classList.contains('show') || el.ledger.classList.contains('open'));
    if (open) { const c = el.toc.querySelector('.cur'); if (c) setTimeout(() => c.scrollIntoView({ block: 'center' }), 50); }
    return open;
  }

  // ── 标题 ────────────────────────────────────────────────────
  function showTitle(saved, onNew, onContinue, onToc) {
    el.title.classList.remove('gone', 'dim');
    el.title.style.display = '';
    document.body.classList.add('on-title');
    el.titleBtns.innerHTML = '';
    const tocBtn = () => {
      if (!onToc) return;
      const t = document.createElement('button');
      t.textContent = '目录';
      t.addEventListener('pointerdown', e => e.stopPropagation());
      t.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
      t.addEventListener('click', e => { e.stopPropagation(); onToc(); });
      el.titleBtns.appendChild(t);
    };
    if (saved && saved.stage > 0) {
      el.titlePrompt.textContent = '按住画面 · 继续创世';
      const cont = document.createElement('button');
      cont.textContent = '继续 · ' + (saved.label || (saved.stage >= GS.story.STAGES.length ? '终' : DAY_NAME[saved.day] || ''));
      const neo = document.createElement('button');
      neo.textContent = '重新创世';
      [cont, neo].forEach(b => {
        b.addEventListener('pointerdown', e => e.stopPropagation());
        b.addEventListener('touchstart', e => e.stopPropagation(), { passive: true });
      });
      cont.addEventListener('click', e => { e.stopPropagation(); onContinue(); });
      // 重新创世会抹去进度：点两次才算（第一次只是提醒）
      let armed = 0;
      neo.addEventListener('click', e => {
        e.stopPropagation();
        if (Date.now() - armed < 3500) { onNew(); return; }
        armed = Date.now();
        neo.textContent = '再点一次 · 重新创世';
        setTimeout(() => { if (Date.now() - armed >= 3400) neo.textContent = '重新创世'; }, 3500);
      });
      el.titleBtns.appendChild(cont);
      el.titleBtns.appendChild(neo);
      tocBtn();
    } else {
      el.titlePrompt.textContent = '按住画面 · 说「起初」';
      tocBtn();
    }
  }
  function hideTitle() {
    document.body.classList.remove('on-title');
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
  // 终幕：opts = { title（两三字，毛笔写出）, sub, foot }
  function finale(on, opts) {
    if (on && opts) {
      const f1 = el.finale.querySelector('.f1'), f2 = el.finale.querySelector('.f2'), f3 = el.finale.querySelector('.f3');
      f1.innerHTML = Array.from(opts.title || '').map((ch, k) => '<span class="brush" style="--k:' + k + '">' + ch + '</span>').join('');
      f2.textContent = opts.sub || '';
      f3.textContent = opts.foot || '';
      el.finale.classList.remove('drawn');
      void el.finale.offsetWidth;
    }
    if (on) el.finale.classList.add('drawn');
    el.finale.classList.toggle('show', !!on);
    document.body.classList.toggle('finale-on', !!on);
  }

  // ── 卷：顶部的卷名，与卷首的大字 ─────────────────────────────
  function setAct(a) {
    if (!el.act) return;
    if (!a) { el.act.classList.remove('show'); return; }
    showDays(false);
    const html = '<b>' + (a.book || a.numeral) + '</b>' + a.title + '<span>' + (a.sub || '') + '</span>';
    if (el.act.dataset.id !== a.id) { el.act.innerHTML = html; el.act.dataset.id = a.id; }
    el.act.classList.add('show');
  }
  function actCard(a, on) {
    const c = el.actcard;
    if (!c) return;
    if (on) {
      const prev = GS.book.opensBook(a) ? GS.book.ACTS[a.index - 1] : null;
      c.innerHTML = (prev ? '<div class="e">' + prev.book + ' · 终</div>' : '') +
        '<div class="n">' + (a.ordinal ? a.ordinal + ' · ' : '') + a.book + '</div><div class="t' + (Array.from(a.title).length > 3 ? ' long' : '') + '">' +
        Array.from(a.title).map((ch, k) => '<span class="brush" style="--k:' + k + '">' + ch + '</span>').join('') +
        '</div><div class="s">' + (a.sub || '') + '</div>';
      c.classList.remove('show'); void c.offsetWidth;
    }
    c.classList.toggle('show', !!on);
  }

  function setSoundButton(muted) { el.bSound.classList.toggle('off', !!muted); }

  GS.ui = {
    init, utterBegin, utterProgress, utterFulfill, utterCancel,
    narrate, clearNarration, narrating, hint, hideHint, setUnfolding, setStage,
    setDays, showDays, showTools, renderLedger, toggleLedger, toggleHelp, panelOpen, renderToc, toggleToc,
    showTitle, hideTitle, setTitlePrompt, dimTitle, tag, finale, setSoundButton, setAct, actCard,
    DAY_NAME,
    get el() { return el; },
  };
})(window.GS);
