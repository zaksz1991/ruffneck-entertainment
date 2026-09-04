
(function(){
  function bindCardExpand(){
    var cards = document.querySelectorAll("#blog .blog-card, .blog-card, article.blog-card");
    cards.forEach(function(card){
      var popup = card.querySelector(".blog-popup, .rn-expand-panel, .expand-content, .card-preview-full");
      if(!popup) return;
      if(card.dataset.rnToggleBound) return;
      card.dataset.rnToggleBound = "1";
      var hint = card.querySelector(".rn-blog-hint, .expand-hint");
      if(!hint){
        hint = document.createElement("button");
        hint.type = "button";
        hint.className = "rn-blog-hint";
        hint.textContent = "Click to expand preview ▾";
        hint.setAttribute("aria-expanded","false");
        hint.style.cssText = "display:inline-flex;margin:10px 0 0;padding:6px 10px;border-radius:8px;border:none;background:#ECFEFF;color:#0891B2;font-weight:700;font-size:12px;cursor:pointer";
        (card.querySelector(".blog-card-body, .blog-body") || card).appendChild(hint);
      }
      function setOpen(open){
        card.classList.toggle("open", !!open);
        popup.classList.toggle("is-open", !!open);
        popup.hidden = !open;
        popup.style.setProperty("display", open ? "block" : "none", "important");
        hint.textContent = open ? "Click to collapse ▴" : "Click to expand preview ▾";
        hint.setAttribute("aria-expanded", open ? "true" : "false");
      }
      setOpen(false);
      function onToggle(e){
        if(e.target.closest("a")) return;
        e.preventDefault();
        e.stopPropagation();
        var willOpen = !card.classList.contains("open");
        cards.forEach(function(c){
          if(c !== card && c.classList.contains("open")){
            c.classList.remove("open");
            var p = c.querySelector(".blog-popup, .rn-expand-panel, .expand-content, .card-preview-full");
            if(p){ p.hidden = true; p.style.setProperty("display","none","important"); p.classList.remove("is-open"); }
            var h = c.querySelector(".rn-blog-hint, .expand-hint");
            if(h){ h.textContent = "Click to expand preview ▾"; h.setAttribute("aria-expanded","false"); }
          }
        });
        setOpen(willOpen);
      }
      hint.addEventListener("click", onToggle);
      card.addEventListener("click", function(e){
        if(e.target.closest("a")) return;
        onToggle(e);
      });
    });
  }
  function patchClose(){
    if(typeof window.closeArticle === "function" && !window.closeArticle.__rn){
      var orig = window.closeArticle;
      window.closeArticle = function(){
        try { orig(); } catch(e) {}
        document.body.style.overflow = "";
        var ov = document.getElementById("articleOverlay");
        if(ov) ov.classList.remove("open");
      };
      window.closeArticle.__rn = true;
    }
  }
  function boot(){ bindCardExpand(); patchClose(); }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  var n=0, t=setInterval(function(){ n++; bindCardExpand(); patchClose(); if(n>40) clearInterval(t); }, 250);
})();
