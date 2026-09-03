(function(){
  function formatBody(raw){
    if(raw==null)return'';
    var body=String(raw);
    if(/<[a-z][\s\S]*>/i.test(body))return body;
    var esc=body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    var parts=esc.split(/\n\s*\n/).filter(function(p){return p.trim();});
    if(!parts.length)return'<p>'+esc.replace(/\n/g,'<br>')+'</p>';
    return parts.map(function(p){return'<p>'+p.trim().replace(/\n/g,'<br>')+'</p>';}).join('');
  }
  function normTags(tags){
    if(Array.isArray(tags))return tags;
    if(typeof tags==='string'&&tags.trim())return tags.split(/[,;]/).map(function(t){return t.trim();}).filter(Boolean);
    return[];
  }
  function patchOpenArticle(){
    if(typeof window.openArticle!=='function'||window.openArticle.__rnPatched)return!!window.openArticle;
    var orig=window.openArticle;
    window.openArticle=function(id){
      try{
        window.articles=window.articles||{};
        var article=window.articles[id];
        if(!article){console.warn('[rn] missing article',id);return;}
        article.tags=normTags(article.tags);
        var bodyHtml=formatBody(article.body);
        var label=document.getElementById('articleLabel');
        var title=document.getElementById('articleTitle');
        var meta=document.getElementById('articleMeta');
        var bodyEl=document.getElementById('articleBody');
        var tagsEl=document.getElementById('articleTags');
        if(label)label.textContent=article.label||'';
        if(title)title.textContent=article.title||'';
        if(meta)meta.textContent=article.meta||'';
        if(bodyEl)bodyEl.innerHTML=bodyHtml||'<p></p>';
        if(tagsEl)tagsEl.innerHTML=article.tags.map(function(t){return'<span class="article-tag">'+String(t).replace(/</g,'')+'</span>';}).join('');
        if(typeof window.currentArticleId!=='undefined')window.currentArticleId=id;
        if(typeof window.renderComments==='function')window.renderComments(id);
        var overlay=document.getElementById('articleOverlay');
        if(overlay){overlay.classList.add('open');overlay.scrollTop=0;}
        document.body.style.overflow='hidden';
      }catch(err){
        console.error('[rn] openArticle',err);
        try{orig(id);}catch(e){}
      }
    };
    window.openArticle.__rnPatched=true;
    return true;
  }
  function bindExpand(){
    document.querySelectorAll('[data-rn-expand],.rn-expand-btn,[data-expand]').forEach(function(btn){
      if(btn.dataset.rnExpandBound)return;
      btn.dataset.rnExpandBound='1';
      btn.addEventListener('click',function(e){
        var card=btn.closest('.blog-card,.article-card,.service-card,article');
        var panel=card&&card.querySelector('.rn-expand-panel,.expand-content,.card-preview-full');
        if(!panel){
          var n=btn.nextElementSibling;
          while(n&&!(n.classList&&n.classList.contains('rn-expand-panel')))n=n.nextElementSibling;
          panel=n;
        }
        if(!panel)return;
        e.preventDefault();e.stopPropagation();
        var open=panel.classList.toggle('is-open');
        panel.hidden=!open;
        btn.setAttribute('aria-expanded',open?'true':'false');
      });
    });
  }
  function boot(){patchOpenArticle();bindExpand();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  var n=0,t=setInterval(function(){n++;patchOpenArticle();bindExpand();if(n>40)clearInterval(t);},250);
})();
