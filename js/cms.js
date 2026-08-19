/**
 * RuffNeck Free CMS client – Google Apps Script + Sheet
 * Loads products & blog for all visitors (not localStorage-only)
 */
(function () {
  const CMS_URL = 'https://script.google.com/macros/s/AKfycby0mX6rqzDHVPy1deNqpHAnBC_f0QRL5f0jL5Bdwxfo4e4AFDO2flbCkV8fjIoT-1w/exec';

  function fetchJson(url) {
    return fetch(url, { method: 'GET', redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .catch(function (err) {
        console.warn('CMS fetch failed', err);
        return null;
      });
  }

  /** Responsive media helpers */
  window.rnMediaStyle = function (imageUrl) {
    if (!imageUrl) return '';
    return 'background-image:url(\'' + String(imageUrl).replace(/'/g, '%27') + '\');' +
      'background-size:cover;background-position:center;background-repeat:no-repeat;';
  };

  window.rnYoutubeEmbed = function (url) {
    if (!url) return '';
    var id = null;
    var m = String(url).match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
    if (m) id = m[1];
    if (!id) return '';
    return '<div class="rn-video-wrap"><iframe src="https://www.youtube.com/embed/' + id +
      '" title="Video" frameborder="0" allowfullscreen loading="lazy" ' +
      'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>';
  };

  /** Store: merge Sheet products into page */
  window.rnLoadCmsProducts = function () {
    return fetchJson(CMS_URL + '?action=products').then(function (data) {
      if (!data || data.status !== 'success' || !data.products || !data.products.length) return;

      var grid = document.getElementById('newArrivalsGrid');
      var section = document.getElementById('newArrivalsSection');
      if (!grid) return;

      if (section) section.style.display = '';

      data.products.forEach(function (p) {
        if (!p.id || !p.tiers || !p.tiers.length) return;

        if (typeof PRODUCTS !== 'undefined') {
          PRODUCTS[p.id] = {
            name: p.name,
            cat: p.cat,
            emoji: p.emoji || '📦',
            imageUrl: p.imageUrl || '',
            videoUrl: p.videoUrl || '',
            tiers: p.tiers
          };
        }

        if (grid.querySelector('[data-id="' + p.id + '"]')) return;

        var minPrice = Math.min.apply(null, p.tiers.map(function (t) { return t.price; }));
        var catSlug = (p.cat || 'other').toLowerCase().replace(/\s+/g, '-');
        var imgStyle = p.imageUrl
          ? window.rnMediaStyle(p.imageUrl)
          : 'background:linear-gradient(135deg,#0B1E3A,#0a2a4a);';

        var card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-cat', catSlug);
        card.setAttribute('data-name', p.name);
        card.setAttribute('data-id', p.id);
        card.innerHTML =
          '<div class="product-img rn-responsive-img" style="' + imgStyle + '">' +
          (!p.imageUrl ? '<span class="emoji-fallback">' + (p.emoji || '📦') + '</span>' : '') +
          '<span class="product-new">New</span></div>' +
          '<div class="product-body">' +
          '<div class="product-cat">' + escapeHtml(p.cat || '') + '</div>' +
          '<h3 class="product-name">' + escapeHtml(p.name) + '</h3>' +
          '<p class="product-desc">' + escapeHtml(p.desc || '') + '</p>' +
          '<div class="product-footer"><span class="product-price">From ₦' +
          Number(minPrice).toLocaleString() + '</span>' +
          '<button type="button" class="btn btn-primary" onclick="openModal(\'' + p.id + '\')">View</button></div>' +
          '</div>';
        grid.appendChild(card);
      });
    });
  };

  /** Blog: append CMS posts */
  window.rnLoadCmsBlog = function () {
    return fetchJson(CMS_URL + '?action=blog').then(function (data) {
      if (!data || data.status !== 'success' || !data.posts || !data.posts.length) return;

      var grid = document.getElementById('blogGrid');
      if (!grid) return;

      // Ensure global articles map exists for openArticle
      if (typeof window.articles === 'undefined') window.articles = {};
      if (typeof articles !== 'undefined' && articles !== window.articles) {
        // merge into existing
      }

      data.posts.forEach(function (post) {
        var id = post.id;
        var body = post.body || '';
        if (post.videoUrl) {
          body = window.rnYoutubeEmbed(post.videoUrl) + body;
        }
        if (post.imageUrl) {
          body = '<img class="rn-article-img" src="' + escapeAttr(post.imageUrl) + '" alt=""/>' + body;
        }

        var target = (typeof articles !== 'undefined') ? articles : window.articles;
        target[id] = {
          label: post.label || post.category || 'Article',
          title: post.title,
          meta: post.meta || (post.createdAt ? String(post.createdAt).slice(0, 10) : ''),
          body: body,
          tags: post.category ? [post.category] : []
        };

        if (grid.querySelector('[data-cms-id="' + id + '"]')) return;

        var thumbStyle = post.imageUrl
          ? window.rnMediaStyle(post.imageUrl)
          : '';

        var card = document.createElement('div');
        card.className = 'blog-card';
        card.setAttribute('data-cms-id', id);
        card.setAttribute('data-cat', (post.category || 'ai').toLowerCase());
        card.setAttribute('data-title', post.title);
        card.onclick = function () { openArticle(id); };
        card.innerHTML =
          '<div class="blog-thumb rn-responsive-img" style="' + (thumbStyle || 'background:linear-gradient(135deg,#0B1E3A,#0a2a4a)') + '">' +
          (!post.imageUrl ? '<span>📝</span>' : '') +
          '<span class="card-cat-badge">' + escapeHtml(post.label || 'Article') + '</span>' +
          '<span class="card-new">New</span></div>' +
          '<div class="blog-card-body">' +
          '<div class="card-meta"><span>RuffNeck Entertainment</span><span class="card-dot"></span><span>' +
          escapeHtml(post.meta || '2026') + '</span></div>' +
          '<h3>' + escapeHtml(post.title) + '</h3>' +
          '<p>' + escapeHtml(post.excerpt || '') + '</p></div>';
        grid.insertBefore(card, grid.firstChild);
      });
    });
  };

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escapeAttr(s) {
    return String(s || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  // Auto-run on correct pages
  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('newArrivalsGrid') || document.getElementById('productsGrid')) {
      window.rnLoadCmsProducts();
    }
    if (document.getElementById('blogGrid')) {
      window.rnLoadCmsBlog();
    }
  });
})();
