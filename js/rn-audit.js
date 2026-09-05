
(function(){
  function nukeLang(){
    try {
      ['rnFixedLang','rnFixedLangBtn','rnFixedLangMenu','rnLang','rnLangMenu','google_translate_element'].forEach(function(id){
        var el=document.getElementById(id);
        if(el&&el.parentNode) el.parentNode.removeChild(el);
      });
      document.querySelectorAll('button[data-lang],.goog-te-combo,.goog-te-gadget').forEach(function(el){
        if(el&&el.parentNode) el.parentNode.removeChild(el);
      });
      document.cookie='googtrans=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
      try{ localStorage.removeItem('rn_lang'); localStorage.removeItem('rn_lang_label'); }catch(e){}
    } catch(e) {}
  }
  nukeLang();
  document.addEventListener('DOMContentLoaded', nukeLang);
  setTimeout(nukeLang, 400);
  setTimeout(nukeLang, 1500);
})();
