/* ============================================================================
 *  ✿  二次元主题 · 交互脚本
 *  ---------------------------------------------------------------------------
 *  所有可调参数都在 config.js 里，这里只负责「把它变活」。
 *  不依赖任何第三方库，不发起外部请求。
 * ========================================================================== */
(function () {
  'use strict';

  var CFG = window.ANIME_CONFIG || {};
  var doc = document;
  var html = doc.documentElement;
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  html.classList.add('anime');

  /* ------------------------------------------------------------------ 工具 */
  function el(tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function siteRoot() {
    var p = location.pathname || '/';
    if (/\/post\/[^/]*$/.test(p)) p = p.replace(/post\/[^/]*$/, '');
    else p = p.replace(/[^/]*$/, '');
    return p || '/';
  }

  var ROOT = siteRoot();

  function asset(p) {
    return ROOT + String(p || '').replace(/^\.?\//, '');
  }

  function resolveHref(h) {
    if (!h) return ROOT;
    if (/^(https?:)?\/\//i.test(h) || /^(mailto:|tel:|#)/i.test(h)) return h;
    return ROOT + h.replace(/^\.?\//, '');
  }

  function hash(str) {
    var h = 0, i;
    for (i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function $(sel, ctx) { return (ctx || doc).querySelector(sel); }

  var ICONS = {
    home: '<path d="M4 11.2 12 4l8 7.2V19a1 1 0 0 1-1 1h-4.6v-5.4H9.6V20H5a1 1 0 0 1-1-1z"/>',
    tag: '<path d="M4 4h6.8L20 13.2 13.2 20 4 10.8z"/><circle cx="8.4" cy="8.4" r="1.4"/>',
    random: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="8.6" cy="8.6" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.4" cy="8.6" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="8.6" cy="15.4" r="1.3" fill="currentColor" stroke="none"/><circle cx="15.4" cy="15.4" r="1.3" fill="currentColor" stroke="none"/>',
    quote: '<path d="M9.4 7H6.9A2.9 2.9 0 0 0 4 9.9v2.2A2.9 2.9 0 0 0 6.9 15H8v2"/><path d="M19 7h-2.5A2.9 2.9 0 0 0 13.6 9.9v2.2A2.9 2.9 0 0 0 16.5 15H17v2"/>',
    palette: '<path d="M12 20.5a8.5 8.5 0 1 1 8.5-8.5c0 2.2-1.6 3.3-3.3 3.3h-1.4c-1.2 0-2.2 1-2.2 2.2 0 .6.2 1.1.5 1.5.3.4.4.9.4 1.5z"/><circle cx="8.6" cy="10" r="1.2" fill="currentColor" stroke="none"/><circle cx="13" cy="8" r="1.2" fill="currentColor" stroke="none"/><circle cx="16.4" cy="11" r="1.2" fill="currentColor" stroke="none"/>',
    top: '<path d="M12 19.5V5.5"/><path d="m6.5 11 5.5-5.5L17.5 11"/>',
    moon: '<path d="M20.4 14.7A8.6 8.6 0 0 1 9.3 3.6 8.6 8.6 0 1 0 20.4 14.7z"/>',
    github: '<path d="M9 19.5c-4.8 1.4-4.8-2.4-6.7-2.9M16.3 22v-3.8a3.4 3.4 0 0 0-.9-2.6c3.1-.3 6.3-1.5 6.3-6.8a5.3 5.3 0 0 0-1.5-3.7 5 5 0 0 0-.1-3.7s-1.2-.3-3.8 1.4a13.1 13.1 0 0 0-7 0C6.7.9 5.5 1.2 5.5 1.2a5 5 0 0 0-.1 3.7A5.3 5.3 0 0 0 3.9 8.6c0 5.3 3.2 6.5 6.3 6.8a3.4 3.4 0 0 0-.9 2.6V22"/>',
    rss: '<circle cx="5" cy="19" r="1"/><path d="M5 12a7 7 0 0 1 7 7"/><path d="M5 5a14 14 0 0 1 14 14"/>',
    link: '<path d="M10.5 13.5a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 0 0-5.7-5.7L11.5 6.8"/><path d="M13.5 10.5a4 4 0 0 0-5.7 0l-2.3 2.3a4 4 0 0 0 5.7 5.7l1.3-1.3"/>',
    heart: '<path d="M12 20s-7-4.4-7-9.1A4.1 4.1 0 0 1 12 7.2a4.1 4.1 0 0 1 7 3.7C19 15.6 12 20 12 20z"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3.2 2"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M8 3v4M16 3v4M3.5 10.2h17"/>',
    star: '<path d="m12 3 2.8 5.9 6.2.8-4.6 4.3 1.2 6.3L12 17.4 6.4 20.3l1.2-6.3L3 9.7l6.2-.8z"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>'
  };

  function icon(name) {
    var p = ICONS[name] || ICONS.star;
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  /* ------------------------------------------------------------- 提示 / 引用 */
  var toastEl = null, toastTimer = null;

  function showToast(content, ms) {
    if (!toastEl) {
      toastEl = el('div', 'anime-toast');
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      doc.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '';
    if (typeof content === 'string') {
      toastEl.appendChild(el('b', null, content));
    } else if (content) {
      toastEl.appendChild(content);
    }
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, ms || 3400);
  }

  function showQuote() {
    var list = (CFG.quotes || []).filter(function (q) { return q && q.text; });
    if (!list.length) return;
    var q = list[Math.floor(Math.random() * list.length)];
    var box = doc.createDocumentFragment();
    box.appendChild(el('b', null, '\u300c' + q.text + '\u300d'));
    if (q.from) box.appendChild(el('small', null, '\u2014 ' + q.from));
    showToast(box, 5600);
  }

  /* ------------------------------------------------------------ 主题 / 背景 */
  var BG_KEY = 'anime_bg';

  function bgList() {
    return (CFG.backgrounds && CFG.backgrounds.length) ? CFG.backgrounds : [
      { id: 'sakura', label: '樱花', url: 'anime/bg-sakura.svg', theme: 'light' },
      { id: 'night', label: '星夜', url: 'anime/bg-night.svg', theme: 'dark' }
    ];
  }

  function themeMode() {
    return html.getAttribute('data-color-mode') || 'light';
  }

  function isDark() {
    var m = themeMode();
    if (m === 'dark') return true;
    if (m === 'auto') return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return false;
  }

  function findBg(id) {
    var list = bgList();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function autoBg() {
    var list = bgList(), want = isDark() ? 'dark' : 'light', i;
    for (i = 0; i < list.length; i++) if ((list[i].theme || 'any') === want) return list[i];
    return list[0];
  }

  function paintBg(bg) {
    if (!bg) return;
    html.style.setProperty('--anime-bg-image', 'url("' + asset(bg.url) + '")');
    html.setAttribute('data-anime-bg', bg.id || '');
  }

  function applyBg(id) {
    var bg = (id && id !== 'auto') ? (findBg(id) || autoBg()) : autoBg();
    paintBg(bg);
    return bg;
  }

  function initBg() {
    var saved = null;
    try { saved = localStorage.getItem(BG_KEY); } catch (e) {}
    applyBg(saved || CFG.defaultBackground || 'auto');
  }

  function cycleBg() {
    var list = bgList(), cur = html.getAttribute('data-anime-bg'), idx = 0, i;
    for (i = 0; i < list.length; i++) if (list[i].id === cur) idx = i;
    var next = list[(idx + 1) % list.length];
    paintBg(next);
    try { localStorage.setItem(BG_KEY, next.id); } catch (e) {}
    showToast('\u5df2\u5207\u6362\u80cc\u666f\uff1a' + (next.label || next.id));
  }

  function updateThemeMeta() {
    var m = $('meta[name="theme-color"]');
    if (!m) {
      m = doc.createElement('meta');
      m.setAttribute('name', 'theme-color');
      doc.head.appendChild(m);
    }
    m.setAttribute('content', isDark() ? '#0b0a16' : '#fff6fb');
  }

  function watchTheme() {
    if (!window.MutationObserver) return;
    new MutationObserver(function () {
      updateThemeMeta();
      var saved = null;
      try { saved = localStorage.getItem(BG_KEY); } catch (e) {}
      if (!saved || saved === 'auto') applyBg('auto');
    }).observe(html, { attributes: true, attributeFilter: ['data-color-mode'] });

    if (window.matchMedia) {
      var mq = window.matchMedia('(prefers-color-scheme: dark)');
      var onChange = function () {
        var saved = null;
        try { saved = localStorage.getItem(BG_KEY); } catch (e) {}
        if ((!saved || saved === 'auto') && themeMode() === 'auto') applyBg('auto');
      };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  /* ---------------------------------------------------------------- 页头装饰 */
  function enhanceHeader() {
    var title = $('.blogTitle');
    if (title) {
      title.setAttribute('href', ROOT);
      title.setAttribute('title', '\u56de\u5230\u9996\u9875');
    }

    var img = doc.getElementById('avatarImg');
    if (img) {
      var fallback = img.getAttribute('src');
      var avatarSrc = (CFG.site && CFG.site.avatar) || 'anime/avatar-kurisu.png';
      img.setAttribute('src', asset(avatarSrc));
      img.setAttribute('alt', (CFG.site && CFG.site.name) || 'avatar');
      var onErr = function () {
        img.removeEventListener('error', onErr);
        img.setAttribute('src', asset('anime/avatar.png'));
      };
      img.addEventListener('error', onErr);
      if ((!CFG.effects || CFG.effects.avatarRing !== false) && !img.parentNode.classList.contains('anime-avatar')) {
        var wrap = el('span', 'anime-avatar');
        img.parentNode.insertBefore(wrap, img);
        wrap.appendChild(img);
      }
    }

    // 樱花 favicon
    var fav = doc.createElement('link');
    fav.setAttribute('rel', 'icon');
    fav.setAttribute('type', 'image/svg+xml');
    fav.setAttribute('href', asset('anime/favicon.svg'));
    doc.head.appendChild(fav);

    var apple = doc.createElement('link');
    apple.setAttribute('rel', 'apple-touch-icon');
    apple.setAttribute('href', asset(((CFG.site && CFG.site.avatar) || 'anime/avatar-kurisu.png')));
    doc.head.appendChild(apple);

    // 给纯图标按钮补上无障碍标签（Gmeek 已带 title）
    [].forEach.call(doc.querySelectorAll('.title-right .btn[title]'), function (b) {
      b.setAttribute('aria-label', b.getAttribute('title'));
    });
  }

  /* ------------------------------------------------------------------ 首页 */
  function buildHero(content) {
    if (!CFG.hero || CFG.hero.enabled === false) return;
    var site = CFG.site || {};
    var hero = el('section', 'anime-hero');

    var body = el('div', 'anime-hero-body');
    body.appendChild(el('p', 'anime-hero-eyebrow', site.eyebrow || '\u2726 WELCOME \u2726'));

    var title = el('h2', 'anime-hero-title', site.name || (doc.title || ''));
    body.appendChild(title);

    var desc = el('p', 'anime-hero-desc');
    var typed = el('span', 'anime-typed');
    var caret = el('span', 'anime-caret');
    desc.appendChild(typed);
    desc.appendChild(caret);
    body.appendChild(desc);

    if (CFG.hero.chips !== false) {
      var chips = el('div', 'anime-chips');
      var items = content.querySelectorAll('.SideNav-item');
      var labelNames = content.querySelectorAll('.LabelName');
      var tags = {};
      [].forEach.call(labelNames, function (n) { tags[(n.textContent || '').trim()] = 1; });
      var days = 0;
      if (site.startDate) {
        var start = new Date(site.startDate.replace(/-/g, '/'));
        if (!isNaN(start.getTime())) days = Math.max(1, Math.floor((Date.now() - start.getTime()) / 86400000) + 1);
      }
      addChip(chips, '\uD83C\uDF38', '\u6587\u7ae0', items.length);
      addChip(chips, '\uD83C\uDFF7\uFE0F', '\u6807\u7B7E', Object.keys(tags).length);
      if (days) addChip(chips, '\u23F3', '\u5DF2\u8FD0\u884C', days + ' \u5929');
      body.appendChild(chips);
    }

    var actions = (CFG.hero.actions || []).slice(0, 4);
    if (actions.length) {
      var box = el('div', 'anime-hero-actions');
      actions.forEach(function (a) {
        var node;
        if (a.href !== undefined) {
          node = doc.createElement('a');
          node.href = resolveHref(a.href);
          if (a.blank) { node.target = '_blank'; node.rel = 'noopener noreferrer'; }
        } else {
          node = doc.createElement('button');
          node.type = 'button';
        }
        node.className = 'anime-btn' + (a.primary ? ' anime-btn-primary' : '');
        if (a.icon) node.innerHTML = icon(a.icon);
        node.appendChild(el('span', null, a.label || ''));
        if (a.action) {
          node.addEventListener('click', function (ev) {
            ev.preventDefault();
            doAction(a.action);
          });
        }
        box.appendChild(node);
      });
      body.appendChild(box);
    }

    hero.appendChild(body);

    if (CFG.hero.showMascot !== false) {
      var art = el('div', 'anime-hero-art');
      var mascotImg = doc.createElement('img');
      var heroFallback = false;
      mascotImg.src = asset((CFG.mascot && CFG.mascot.image) || 'anime/mascot.png');
      mascotImg.addEventListener('error', function () {
        if (heroFallback) return;
        heroFallback = true;
        mascotImg.src = asset('anime/mascot.svg');
      });
      mascotImg.alt = (CFG.mascot && CFG.mascot.name) || '\u770B\u677F\u5A18';
      mascotImg.loading = 'lazy';
      art.appendChild(mascotImg);
      hero.appendChild(art);
    }

    content.insertBefore(hero, content.firstElementChild);

    var lines = (site.typed || []).filter(Boolean);
    if (lines.length) typewriter(typed, lines);
  }

  function addChip(parent, emoji, label, value) {
    var chip = el('span', 'anime-chip');
    chip.appendChild(el('i', null, emoji + ' ' + label + ' '));
    chip.appendChild(el('b', null, String(value)));
    parent.appendChild(chip);
  }

  function typewriter(node, lines) {
    if (REDUCED) { node.textContent = lines[0]; return; }
    var li = 0, ci = 0, deleting = false;
    node.textContent = '';
    function step() {
      var line = lines[li % lines.length];
      if (!deleting) {
        ci++;
        node.textContent = line.slice(0, ci);
        if (ci >= line.length) { deleting = true; return setTimeout(step, 2200); }
      } else {
        ci--;
        node.textContent = line.slice(0, Math.max(0, ci));
        if (ci <= 0) { deleting = false; li++; return setTimeout(step, 400); }
      }
      setTimeout(step, deleting ? 28 : 68);
    }
    setTimeout(step, 350);
  }

  function enhanceIndex() {
    var content = doc.getElementById('content');
    if (!content) return;
    if (doc.getElementById('postBody') || doc.getElementById('taglabel')) return;
    var nav = content.querySelector('.SideNav');
    if (!nav) return;

    var sub = content.firstElementChild;
    if (sub && sub !== nav && sub.tagName === 'DIV') sub.classList.add('anime-subtitle');

    buildHero(content);

    var items = nav.querySelectorAll('.SideNav-item');
    var head = el('div', 'anime-list-head');
    head.appendChild(el('span', 'anime-list-title', '\u6700\u65B0\u6587\u7AE0'));
    head.appendChild(el('span', 'anime-list-sub', '\u5171 ' + items.length + ' \u7BC7 \u00B7 \u6162\u6162\u770B'));
    nav.parentNode.insertBefore(head, nav);

    decorateDescriptions(items);

    var emojis = (CFG.thumbEmojis && CFG.thumbEmojis.length) ? CFG.thumbEmojis :
      ['\uD83C\uDF38', '\u2B50', '\uD83C\uDF19', '\uD83C\uDF80'];
    [].forEach.call(items, function (item) {
      if (item.querySelector('.anime-thumb')) return;
      var t = item.querySelector('.listTitle');
      var text = t ? t.textContent : '';
      var emoji = emojis[hash(text) % emojis.length];
      var thumb = el('span', 'anime-thumb', emoji);
      thumb.setAttribute('aria-hidden', 'true');
      item.insertBefore(thumb, item.firstChild);
    });
  }

  function decorateDescriptions(items) {
    if (!window.fetch) return;
    var rss = fetch(asset('rss.xml'), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.text() : ''; })
      .catch(function () { return ''; });
    Promise.all([loadPosts().catch(function () { return []; }), rss]).then(function (res) {
      var posts = res[0] || [], xml = res[1], descByPath = {}, byPath = {};
      if (xml && window.DOMParser) {
        var feed = new DOMParser().parseFromString(xml, 'text/xml');
        [].forEach.call(feed.querySelectorAll('item'), function (it) {
          var linkEl = it.querySelector('link'), descEl = it.querySelector('description');
          if (!linkEl || !descEl) return;
          var path;
          try { path = new URL(linkEl.textContent, location.href).pathname; }
          catch (e) { path = linkEl.textContent; }
          descByPath[path] = descEl.textContent;
        });
      }
      posts.forEach(function (p) {
        try { byPath[new URL(p.postUrl, location.href).pathname] = p; } catch (e) {}
      });
      [].forEach.call(items, function (item) {
        var href = item.getAttribute('href') || '', path;
        try { path = new URL(href, location.href).pathname; }
        catch (e) { path = href; }
        var info = byPath[path];
        var text = descByPath[path];
        var title = item.querySelector('.listTitle');
        if (!title || title.closest('.anime-title-wrap')) return;
        if (!text && !(info && info.wordCount)) return;

        var wrap = el('div', 'anime-title-wrap');
        title.parentNode.insertBefore(wrap, title);
        wrap.appendChild(title);

        var desc = el('span', 'anime-item-desc');
        desc.appendChild(doc.createTextNode(text || ''));
        if (info && info.wordCount) desc.appendChild(el('b', null, (text ? ' · ' : '') + info.wordCount + ' 字'));
        wrap.appendChild(desc);
      });
    }).catch(function () {});
  }

  /* ------------------------------------------------------------ 文章页增强 */
  function postKey() {
    var p = location.pathname || '';
    if (ROOT !== '/' && p.indexOf(ROOT) === 0) p = p.slice(ROOT.length);
    else p = p.replace(/^\//, '');
    return p;
  }

  function enhancePost() {
    var body = doc.getElementById('postBody');
    if (!body) return;
    var conf = CFG.post || {};

    var pageTitle = doc.querySelector('#header .postTitle');
    if (pageTitle && !doc.querySelector('.anime-post-mark')) {
      var mark = el('span', 'anime-post-mark', '✿');
      mark.setAttribute('aria-hidden', 'true');
      pageTitle.parentNode.insertBefore(mark, pageTitle);
    }

    if (conf.progress !== false) initProgress();

    if (conf.meta !== false) {
      var meta = buildPostMeta(body, conf);
      loadPostInfo(function (info) { fillPostInfo(meta, info); });
    }

    if (conf.toc !== false) buildToc(body, conf);
    if (conf.lightbox !== false) initLightbox(body);
  }

  function initProgress() {
    var bar = el('div', 'anime-progress');
    var fill = el('i');
    bar.appendChild(fill);
    doc.body.appendChild(bar);

    var ticking = false;
    function update() {
      ticking = false;
      var st = window.pageYOffset || doc.documentElement.scrollTop || 0;
      var max = (doc.documentElement.scrollHeight - window.innerHeight) || 1;
      var pct = Math.min(100, Math.max(0, (st / max) * 100));
      fill.style.width = pct + '%';
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame ? window.requestAnimationFrame(update) : setTimeout(update, 60);
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function buildPostMeta(body, conf) {
    var text = body.textContent || '';
    var cjk = (text.match(/[\u3400-\u9fff]/g) || []).length;
    var latin = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9_'-]+/g) || []).length;
    var words = cjk + latin;
    var minutes = Math.max(1, Math.round(words / (conf.wordsPerMinute || 380)));

    var meta = el('div', 'anime-meta');
    meta.appendChild(el('span', 'anime-chip', '\uD83D\uDCD6 \u7EA6 ' + words + ' \u5B57'));
    meta.appendChild(el('span', 'anime-chip', '\u23F1 \u9605\u8BFB\u7EA6 ' + minutes + ' \u5206\u949F'));

    if (conf.copyLink !== false) {
      var copy = doc.createElement('button');
      copy.type = 'button';
      copy.className = 'anime-chip';
      copy.appendChild(el('span', null, '\uD83D\uDD17 \u590D\u5236\u94FE\u63A5'));
      copy.addEventListener('click', copyCurrentLink);
      meta.appendChild(copy);
    }

    body.parentNode.insertBefore(meta, body);
    return meta;
  }

  function metaChip(iconName, text) {
    var chip = el('span', 'anime-chip');
    chip.innerHTML = icon(iconName);
    chip.appendChild(el('span', null, text));
    return chip;
  }

  function loadPostInfo(cb) {
    if (!window.fetch) return;
    fetch(asset('postList.json'), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        var key = postKey(), info = null, k;
        for (k in data) {
          if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
          var p = data[k];
          if (p && typeof p === 'object' && p.postUrl === key) { info = p; break; }
        }
        if (info) cb(info);
      })
      .catch(function () {});
  }

  function fillPostInfo(meta, info) {
    if (!meta || !info) return;
    var copyBtn = meta.querySelector('button.anime-chip');
    if (info.createdDate) {
      var date = el('span', 'anime-chip', '\uD83D\uDD4A ' + info.createdDate);
      meta.insertBefore(date, copyBtn || null);
    }
    (info.labels || []).forEach(function (label) {
      var tag = el('a', 'anime-chip');
      tag.href = ROOT + 'tag.html#' + encodeURIComponent(label);
      tag.textContent = '\uD83C\uDFF7\uFE0F ' + label;
      meta.insertBefore(tag, copyBtn || null);
    });
  }

  function buildToc(body, conf) {
    var heads = [].slice.call(body.querySelectorAll('h2, h3'));
    if (heads.length < (conf.tocMinHeadings || 2)) return;

    var toc = el('nav', 'anime-toc');
    toc.setAttribute('aria-label', '\u76EE\u5F55');
    var head = el('div', 'anime-toc-head');
    head.appendChild(el('span', null, '\u672C\u6587\u76EE\u5F55'));
    var toggle = doc.createElement('button');
    toggle.type = 'button';
    toggle.className = 'anime-toc-toggle';
    toggle.textContent = '\u6536\u8D77';
    head.appendChild(toggle);
    toc.appendChild(head);

    var ol = doc.createElement('ol');
    var links = [];
    heads.forEach(function (h, i) {
      if (!h.id) h.id = 'anime-sec-' + (i + 1);
      var li = el('li', h.tagName === 'H3' ? 'lv3' : 'lv2');
      var a = doc.createElement('a');
      a.href = '#' + h.id;
      a.textContent = (h.textContent || '').trim();
      li.appendChild(a);
      ol.appendChild(li);
      links.push({ id: h.id, a: a });
    });
    toc.appendChild(ol);
    body.parentNode.insertBefore(toc, body);

    toggle.addEventListener('click', function () {
      var collapsed = toc.classList.toggle('collapsed');
      toggle.textContent = collapsed ? '\u5C55\u5F00' : '\u6536\u8D77';
    });

    if (!('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (l) { map[l.id] = l.a; });
    var current = null;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          if (current) current.classList.remove('active');
          current = map[en.target.id];
          current.classList.add('active');
        }
      });
    }, { rootMargin: '-10% 0px -75% 0px', threshold: 0 });
    heads.forEach(function (h) { io.observe(h); });
  }

  function initLightbox(body) {
    body.addEventListener('click', function (ev) {
      var img = ev.target;
      if (!img || img.tagName !== 'IMG') return;
      if (img.closest('a')) return;
      if (img.classList.contains('g-emoji') || (img.getAttribute('src') || '').indexOf('emoji') > -1) return;
      ev.preventDefault();
      openLightbox(img.getAttribute('src'), img.getAttribute('alt') || '');
    });
  }

  function openLightbox(src, alt) {
    if (!src) return;
    var box = el('div', 'anime-lightbox');
    var img = doc.createElement('img');
    img.src = src;
    img.alt = alt;
    box.appendChild(img);
    doc.body.appendChild(box);
    doc.body.style.overflow = 'hidden';
    function close() {
      box.remove();
      doc.body.style.overflow = '';
      doc.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }
    box.addEventListener('click', close);
    doc.addEventListener('keydown', onKey);
  }

  function copyCurrentLink() {
    var url = location.href;
    function done() { showToast('\u94FE\u63A5\u5DF2\u590D\u5236\uFF0C\u53BB\u5206\u4EAB\u7ED9\u670B\u53CB\u5427\uFF5E'); }
    function fallback() {
      var ta = doc.createElement('textarea');
      ta.value = url;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
      doc.body.appendChild(ta);
      ta.select();
      try { doc.execCommand('copy'); done(); } catch (e) {}
      ta.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, fallback);
    } else {
      fallback();
    }
  }

  /* ------------------------------------------------------------------ 标签页 */
  function enhanceTag() {
    var taglabel = doc.getElementById('taglabel');
    if (!taglabel) return;

    var input = doc.querySelector('.subnav-search-input');
    if (input) {
      input.setAttribute('placeholder', '搜索文章标题…');
      input.setAttribute('aria-label', '搜索文章标题');
    }

    // Gmeek 会把标题写成 "Tag #xxx" / "Search #xxx"，这里换成中文
    var title = doc.querySelector('.tagTitle');
    if (title) {
      var applyTitle = function () {
        var raw = (title.textContent || '').replace(/\s+/g, ' ').trim();
        var m = /^(Tag|Search)\s*#\s*(.*)$/.exec(raw);
        if (!m) return;
        var label = m[2];
        var text = m[1] === 'Tag'
          ? (label === 'All' ? '标签云 · 全部' : '标签 · ' + label)
          : (label ? '搜索 · ' + label : '搜索');
        title.textContent = text;
      };
      applyTitle();
      if (window.MutationObserver) {
        new MutationObserver(applyTitle).observe(title, { childList: true, subtree: true, characterData: true });
      }
    }
    var nav = doc.querySelector('#content .SideNav');
    if (nav && !$('.anime-list-head')) {
      var head = el('div', 'anime-list-head');
      head.appendChild(el('span', 'anime-list-title', '\u6587\u7AE0\u5217\u8868'));
      head.appendChild(el('span', 'anime-list-sub', '\u70B9\u51FB\u4E0A\u65B9\u6807\u7B7E\u7B5B\u9009'));
      nav.parentNode.insertBefore(head, nav);
    }
  }

  /* ------------------------------------------------------------------ 按钮坞 */
  function buildDock() {
    var btns = (CFG.buttons || []).slice();
    if (!btns.length) return;
    var dock = el('div', 'anime-dock');
    dock.setAttribute('role', 'toolbar');
    dock.setAttribute('aria-label', '\u5FEB\u6377\u6309\u94AE');

    btns.forEach(function (b, i) {
      var node;
      if (b.href !== undefined) {
        node = doc.createElement('a');
        node.href = resolveHref(b.href);
        if (b.blank) { node.target = '_blank'; node.rel = 'noopener noreferrer'; }
      } else {
        node = doc.createElement('button');
        node.type = 'button';
      }
      node.className = 'anime-dock-btn';
      node.setAttribute('aria-label', b.label || '\u6309\u94AE');
      node.innerHTML = icon(b.icon || 'star');
      node.appendChild(el('span', 'anime-dock-tip', b.label || ''));
      node.style.animationDelay = (i * 40) + 'ms';
      if (b.action) {
        node.addEventListener('click', function (ev) {
          ev.preventDefault();
          doAction(b.action);
        });
      }
      dock.appendChild(node);
    });

    doc.body.appendChild(dock);
  }

  function doAction(action) {
    switch (action) {
      case 'random': randomPost(); break;
      case 'quote': showQuote(); break;
      case 'background': cycleBg(); break;
      case 'top':
        window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
        break;
      case 'theme':
        if (typeof window.modeSwitch === 'function') window.modeSwitch();
        else {
          var next = themeMode() === 'dark' ? 'light' : 'dark';
          html.setAttribute('data-color-mode', next);
          try { localStorage.setItem('meek_theme', next); } catch (e) {}
        }
        break;
      case 'mascot': mascotSay(); break;
      case 'share': copyCurrentLink(); break;
    }
  }

  /* ------------------------------------------------------------- 随机文章 */
  var postsCache = null;

  function loadPosts() {
    if (postsCache) return Promise.resolve(postsCache);
    if (!window.fetch) return Promise.reject();
    return fetch(asset('postList.json'), { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (data) {
        var arr = [], k;
        for (k in data) {
          if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
          var p = data[k];
          if (p && typeof p === 'object' && p.postUrl) arr.push(p);
        }
        postsCache = arr;
        return arr;
      });
  }

  function randomPost() {
    loadPosts().then(function (arr) {
      if (!arr.length) throw 0;
      var pick = arr[Math.floor(Math.random() * arr.length)];
      showToast('\uD83C\uDF38 \u5E26\u4F60\u53BB\u770B\u770B\u300A' + (pick.postTitle || '\u4E00\u7BC7\u968F\u7B14') + '\u300B', 1400);
      setTimeout(function () { location.href = ROOT + pick.postUrl; }, 520);
    }).catch(function () {
      var links = [].map.call(doc.querySelectorAll('#content .SideNav-item'), function (a) { return a.href; });
      if (links.length) location.href = links[Math.floor(Math.random() * links.length)];
      else location.href = ROOT;
    });
  }

  /* --------------------------------------------------------------- 看板娘 */
  var mascotApi = null;

  function buildMascot() {
    if (!CFG.mascot || CFG.mascot.enabled === false) return;
    var m = CFG.mascot;

    var wrap = el('div', 'anime-mascot');
    var img = doc.createElement('img');
    img.src = asset(m.image || 'anime/mascot.svg');
    img.alt = m.name || '\u770B\u677F\u5A18';
    img.title = '\u70B9\u6211\u4E00\u4E0B\uFF5E';
    img.loading = 'lazy';

    var bubble = el('div', 'anime-bubble');
    bubble.setAttribute('role', 'status');
    var nameEl = el('span', 'anime-bubble-name', m.name || '\u770B\u677F\u5A18');
    var textEl = el('span', 'anime-bubble-text');
    var close = doc.createElement('button');
    close.type = 'button';
    close.className = 'anime-bubble-close';
    close.setAttribute('aria-label', '\u5173\u95ED\u5BF9\u8BDD');
    close.textContent = '\u00D7';
    bubble.appendChild(nameEl);
    bubble.appendChild(textEl);
    bubble.appendChild(close);

    wrap.appendChild(bubble);
    wrap.appendChild(img);
    doc.body.appendChild(wrap);

    var hideTimer = null, lines = (m.greetings || []).slice(), idx = 0;

    function say(text) {
      if (!text) return;
      textEl.textContent = text;
      bubble.classList.add('show');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { bubble.classList.remove('show'); }, 8200);
    }

    function wave() {
      img.classList.remove('wave');
      void img.offsetWidth;
      img.classList.add('wave');
    }

    function nextLine() {
      if (!lines.length) return '\u4F60\u597D\u5440\uFF5E';
      idx = (idx + (Math.random() > .5 ? 1 : 0)) % lines.length;
      var line = lines[idx];
      idx = (idx + 1) % lines.length;
      return line;
    }

    img.addEventListener('click', function () {
      wave();
      say(nextLine());
      if (CFG.effects && CFG.effects.clickBurst !== false) {
        var r = img.getBoundingClientRect();
        burst(r.left + r.width * 0.55, r.top + r.height * 0.3, 8);
      }
    });

    close.addEventListener('click', function (ev) {
      ev.stopPropagation();
      bubble.classList.remove('show');
      clearTimeout(hideTimer);
    });

    mascotApi = {
      say: function () { wave(); say(nextLine()); },
      show: function () { say(lines[0] || '\u4F60\u597D\u5440\uFF5E'); }
    };

    // 只在首页自动打招呼，避免挡住正文；其他页面点击看板娘才会说话
    var isHome = !doc.getElementById('postBody') && !doc.getElementById('taglabel');
    if (isHome) setTimeout(function () { say(lines[0] || '你好呀～'); }, 1800);
  }

  function mascotSay() {
    if (mascotApi) mascotApi.say();
    else showQuote();
  }

  /* -------------------------------------------------------------- 樱花飘落 */
  function initPetals() {
    var fx = CFG.effects || {};
    if (fx.petals === false || REDUCED) return;
    if ($('.anime-petals')) return;

    var canvas = el('canvas', 'anime-petals');
    canvas.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(canvas);

    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    var colors = ['#ffb3d9', '#ffd1e6', '#f7a8cd', '#ffe0ef', '#ffc2da', '#f2b8ff'];
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0;
    var petals = [];
    var last = 0, raf = 0, running = false;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function make(seed) {
      return {
        x: rand(-20, w + 20),
        y: seed ? rand(-h, h) : rand(-80, -10),
        s: rand(4, 9),
        vy: rand(12, 32),
        sway: rand(10, 34),
        phase: rand(0, Math.PI * 2),
        spin: rand(-1.4, 1.4),
        angle: rand(0, Math.PI * 2),
        alpha: rand(.3, .7),
        color: colors[(Math.random() * colors.length) | 0]
      };
    }

    function targetCount() {
      var base = fx.petalCount || 26;
      return w < 720 ? Math.max(8, Math.round(base * 0.42)) : base;
    }

    function setup() {
      petals = [];
      for (var i = 0; i < targetCount(); i++) petals.push(make(true));
    }

    function draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.s * .95, -p.s * .65, -p.s * .8, p.s * .75, 0, p.s);
      ctx.bezierCurveTo(p.s * .8, p.s * .75, p.s * .95, -p.s * .65, 0, 0);
      ctx.fill();
      ctx.globalAlpha = p.alpha * .55;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = .7;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, p.s * .72);
      ctx.stroke();
      ctx.restore();
    }

    function frame(now) {
      if (!running) return;
      var dt = Math.min((now - last) / 1000 || .016, .05);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < petals.length; i++) {
        var p = petals[i];
        p.y += p.vy * dt;
        p.x += Math.sin(p.phase + p.y * .012) * p.sway * dt;
        p.angle += p.spin * dt;
        if (p.y > h + 24 || p.x < -40 || p.x > w + 40) petals[i] = make(false);
        draw(petals[i]);
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    setup();
    start();

    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () {
        resize();
        setup();
      }, 240);
    });

    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) stop();
      else start();
    });
  }

  /* ------------------------------------------------------------- 点击花瓣 */
  function burst(x, y, n) {
    if (REDUCED) return;
    for (var i = 0; i < (n || 7); i++) {
      var p = el('span', 'anime-petal-burst');
      var size = rand(7, 13);
      p.style.cssText = 'left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + (size * .7) + 'px;' +
        'background:' + ['#ffb3d9', '#ffd1e6', '#f2b8ff', '#ffc2da'][i % 4] + ';' +
        'border-radius:60% 60% 50% 50% / 70% 70% 40% 40%;';
      doc.body.appendChild(p);
      var dx = rand(-70, 70), dy = rand(-90, -30), rot = rand(-220, 220);
      if (p.animate) {
        var anim = p.animate([
          { transform: 'translate(-50%,-50%) rotate(0deg)', opacity: 1 },
          { transform: 'translate(calc(-50% + ' + dx + 'px),calc(-50% + ' + dy + 'px)) rotate(' + rot + 'deg)', opacity: 0 }
        ], { duration: rand(600, 1100), easing: 'cubic-bezier(.2,.7,.3,1)' });
        anim.onfinish = (function (node) { return function () { node.remove(); }; })(p);
      } else {
        setTimeout((function (node) { return function () { node.remove(); }; })(p), 900);
      }
    }
  }

  function initClickBurst() {
    var fx = CFG.effects || {};
    if (fx.clickBurst === false || REDUCED) return;
    doc.addEventListener('click', function (ev) {
      var t = ev.target;
      if (t && t.closest && t.closest('a,button,input,textarea,select,label,[role="button"]')) return;
      burst(ev.clientX, ev.clientY, 6);
    });
  }

  /* -------------------------------------------------------------- 鼠标星光 */
  function initCursor() {
    var fx = CFG.effects || {};
    if (fx.cursor === false || REDUCED) return;
    if (!window.matchMedia || !window.matchMedia('(pointer: fine)').matches) return;
    var last = 0;
    doc.addEventListener('pointermove', function (ev) {
      var now = performance.now();
      if (now - last < 70) return;
      last = now;
      var s = el('span', 'anime-spark');
      s.style.left = ev.clientX + 'px';
      s.style.top = ev.clientY + 'px';
      doc.body.appendChild(s);
      setTimeout(function () { s.remove(); }, 780);
    }, { passive: true });
  }

  /* -------------------------------------------------------------- 小彩蛋 */
  function initEasterEgg() {
    var seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    var pos = 0;
    doc.addEventListener('keydown', function (ev) {
      var key = ev.key;
      if (key === seq[pos] || key.toLowerCase() === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          pos = 0;
          var cx = window.innerWidth / 2, cy = window.innerHeight * 0.4;
          burst(cx, cy, 34);
          showToast('\uD83C\uDF38 \u6A31\u82B1\u66B4\u51FB\uFF01\u613F\u4F60\u4ECA\u5929\u4E5F\u6709\u597D\u5FC3\u60C5\uFF5E', 3200);
        }
      } else {
        pos = key === seq[0] ? 1 : 0;
      }
    });
  }

  /* ------------------------------------------------------------------ 启动 */
  var booted = false;

  function boot() {
    if (booted) return;
    booted = true;

    initBg();
    updateThemeMeta();
    watchTheme();

    enhanceHeader();
    enhanceIndex();
    enhanceTag();
    enhancePost();

    buildDock();
    buildMascot();
    initPetals();
    initCursor();
    initClickBurst();
    initEasterEgg();
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // 暴露少量接口，方便在控制台调试
  window.ANIME = {
    config: CFG,
    toast: showToast,
    quote: showQuote,
    background: cycleBg,
    random: randomPost,
    burst: burst
  };
})();
