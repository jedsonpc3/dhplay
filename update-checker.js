(function(){
  const status=()=>document.getElementById("appUpdateStatus"),label=()=>document.getElementById("versionLabel");
  async function loadVersion(){try{const response=await fetch("./version.json?_="+Date.now(),{cache:"no-store"});return response.ok?response.json():null;}catch{return null;}}
  function show(version){if(!version?.version)return;label().textContent=`v${String(version.version).replace(/^v/,"")}`;if(version.deployedAt){const date=new Date(version.deployedAt);if(!Number.isNaN(date.getTime()))label().title=`Atualizado em ${date.toLocaleString("pt-BR")}`;}}
  async function check(manual=false){const version=await loadVersion();show(version);if(manual)status().textContent=version?.version?`Versão atual: ${version.version}`:"Não foi possível verificar a versão.";return version;}
  window.addEventListener("DOMContentLoaded",()=>{check();document.getElementById("checkUpdateBtn")?.addEventListener("click",()=>check(true));if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js?v=1.1.8",{updateViaCache:"none"}).then(()=>status().textContent="Offline ativo. Dados protegidos neste dispositivo.").catch(()=>status().textContent="Offline indisponível neste navegador.");});
})();
