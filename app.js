const state={assets:[],plan:null};const $=s=>document.querySelector(s);const assetInput=$("#assetInput"),assetList=$("#assetList"),assetCount=$("#assetCount"),timeline=$("#timeline"),log=$("#agentLog"),progress=$("#progress"),progressBar=progress.querySelector("div"),downloadPlan=$("#downloadPlan");function renderAssets(){assetCount.textContent=state.assets.length+" asset"+(state.assets.length===1?"":"s");if(!state.assets.length){assetList.innerHTML='<div class="empty">AÃ±ade vÃ­deos, imÃ¡genes, audio o mÃºsica.</div>';return}assetList.innerHTML=state.assets.map((a,i)=>'<div class="asset"><div><strong>'+escapeHtml(a.name)+'</strong><small>'+a.kind+' â¢ '+formatBytes(a.size)+'</small></div><button class="ghost" data-remove="'+i+'">Ã</button></div>').join("")}function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}function formatBytes(n){if(n<1024)return n+" B";if(n<1048576)return Math.round(n/1024)+" KB";return (n/1048576).toFixed(1)+" MB"}function kind(file){if(file.type.startsWith("video/"))return"video";if(file.type.startsWith("audio/"))return"audio";if(file.type.startsWith("image/"))return"image";return"file"}assetInput.addEventListener("change",e=>{state.assets.push(...[...e.target.files].map(f=>({name:f.name,size:f.size,type:f.type,kind:kind(f)})));renderAssets();assetInput.value=""});assetList.addEventListener("click",e=>{const i=e.target.dataset.remove;if(i!==undefined){state.assets.splice(Number(i),1);renderAssets()}});async function runEditorAgent() {
  const projectTitle = $("#projectTitle").value.trim() || "Nuevo video de Chileno";
  const brief = $("#brief").value.trim();
  const assets = state.assets.map(a => ({name:a.name,kind:a.kind,size:a.size}));

  const response = await fetch("https://TU-WORKER.workers.dev", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"openai/gpt-oss-120b:free",
      messages:[
        {role:"system",content:"Eres el Editor Director de Chileno AI Studio. Devuelve SOLO JSON válido con version, title, brief, duration, segments y notes. Cada segment debe tener type, asset, start, duration y transition. Si falta un asset, indícalo en notes y no inventes un archivo local."},
        {role:"user",content:JSON.stringify({title:projectTitle,brief,assets})}
      ]
    })
  });

  if (!response.ok) throw new Error("El Worker respondió con HTTP " + response.status);
  const result = await response.json();
  const content = result?.choices?.[0]?.message?.content;
  if (!content) throw new Error("OpenRouter no devolvió contenido.");

  try { return JSON.parse(content.trim()); }
  catch { throw new Error("El agente devolvió una respuesta que no es JSON válido."); }
}

function renderPlan(){const p=state.plan;if(!p){timeline.innerHTML='<div class="empty">Genera una ediciÃ³n para ver la timeline.</div>';downloadPlan.disabled=true;return}timeline.innerHTML=p.segments.map(s=>'<div class="clip"><div class="type">'+s.type+'</div><div><div class="name">'+escapeHtml(s.asset)+'</div><small>'+s.start+'s â '+(s.start+s.duration)+'s â¢ '+(s.transition||("volumen "+Math.round((s.volume||1)*100)+"%"))+'</small></div><small>'+s.duration+'s</small></div>').join("");downloadPlan.disabled=false}$("#generateBtn").addEventListener("click",async()=>{
  progress.classList.remove("hidden");
  progressBar.style.width="10%";
  log.textContent="Enviando proyecto al Editor Director…";
  try{
    progressBar.style.width="45%";
    log.textContent+=" Analizando briefing y assets…";
    state.plan=await runEditorAgent();
    progressBar.style.width="100%";
    log.textContent+=" Timeline recibida desde OpenRouter.";
    renderPlan();
    setTimeout(()=>progress.classList.add("hidden"),500);
  }catch(error){
    progressBar.style.width="100%";
    log.textContent+=" Error: "+error.message+" Comprueba que el Worker esté desplegado y que OPENROUTER_API_KEY exista como Secret.";
  }
});$("#demoBtn").addEventListener("click",()=>{$("#projectTitle").value="Â¿QuÃ© es JEV?";$("#brief").value="VÃ­deo tecnolÃ³gico de aproximadamente 2 minutos. Explica JEV de forma clara y visual. Usa ritmo dinÃ¡mico, capturas de la web/documentaciÃ³n cuando sean apropiadas, grÃ¡ficos para conceptos y mÃºsica discreta.";window.scrollTo({top:document.body.scrollHeight/2,behavior:"smooth"})});downloadPlan.addEventListener("click",()=>{const blob=new Blob([JSON.stringify(state.plan,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="chileno-ai-edit-plan.json";a.click();URL.revokeObjectURL(a.href)});function wait(ms){return new Promise(r=>setTimeout(r,ms))}renderAssets();