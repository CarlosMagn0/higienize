// Cliente HTTP compartilhado para a API REST.
const API_BASE = 'http://127.0.0.1:3000/api';
const AUTH_TOKEN_KEY = 'higienizeToken';
const AUTH_USER_KEY = 'higienizeUser';
let selectedRating = 5;

function currentUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null'); }
  catch { return null; }
}
function authHeaders() {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
async function apiRequest(path, options = {}) {
  const headers = { ...authHeaders(), ...(options.headers || {}) };
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
  let response;
  try { response = await fetch(API_BASE + path, { ...options, headers }); }
  catch { throw new Error('Não foi possível conectar à API. Verifique se o backend está ativo em localhost:3000.'); }
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || `Falha na API (${response.status}).`);
  return data;
}
function showFeedback(id, message, success = false) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = message;
  element.style.color = success ? '#18794e' : '#a33';
}
function safeText(value = '') {
  return String(value).replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[ch]);
}
function money(value) {
  return value == null ? 'A combinar' : Number(value).toLocaleString('pt-BR', { style:'currency', currency:'BRL' });
}
function dateTime(value) {
  return new Date(value).toLocaleString('pt-BR', { dateStyle:'short', timeStyle:'short' });
}
function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.location.href = 'login.html';
}

// Seleção visual de perfil, etapas, estrelas, mensagens e modal existentes.
function selPerfil(type) {
  ['c','d','s'].forEach(key => document.getElementById(`cc-${key}`)?.classList.toggle('on', key === type));
  localStorage.setItem('higienizeSignupRole', type === 'd' ? 'DIARISTA' : 'CLIENTE');
}
let step = 1;
const TOTAL = 4;
function updStep() {
  for (let i=1;i<=TOTAL;i++) {
    const dot=document.getElementById('d'+i), pane=document.getElementById('p'+i);
    if(dot) dot.className='sdot'+(i<step?' done':i===step?' act':'');
    if(pane) pane.className='spane'+(i===step?' on':'');
  }
  const back=document.getElementById('sbk'), next=document.getElementById('snxt');
  if(back) back.style.display=step>1?'block':'none';
  if(next) next.textContent=step===TOTAL?'Publicar solicitação ✓':'Próximo →';
  document.getElementById('slsa')?.scrollTo(0,0);
}
function sBack() { if(step>1){step--;updStep();} }
async function sNext() {
  if(step<TOTAL){ step++;updStep();return; }
  const feedback='requestFeedback';
  const user=currentUser();
  if(!user){showFeedback(feedback,'Entre como morador para publicar uma solicitação.');return;}
  const services=[...document.querySelectorAll('.sbtn.on')].map(el=>el.querySelector('.sbn')?.textContent.trim()).filter(Boolean);
  const date=document.getElementById('scheduleDate')?.value;
  const time=document.getElementById('scheduleTime')?.value.split(' ')[0];
  const address=[document.getElementById('requestAddress')?.value.trim(),document.getElementById('requestUnit')?.value.trim()].filter(Boolean).join(', ');
  if(!services.length||!date||!address){showFeedback(feedback,'Informe ao menos um serviço, a data e o endereço.');return;}
  const scheduledAt=new Date(`${date}T${time}:00`).toISOString();
  const button=document.getElementById('snxt'); button.disabled=true; button.textContent='Enviando...';
  try {
    const created=await apiRequest('/solicitacoes',{method:'POST',body:JSON.stringify({address,propertySize:document.getElementById('propertySize').value,notes:document.getElementById('requestNotes').value,scheduledAt,services,estimatedValue:null})});
    showFeedback(feedback,`Solicitação #${created.id} criada com sucesso.`,true);
    setTimeout(()=>window.location.href='home.html',900);
  } catch(error) { showFeedback(feedback,error.message);button.disabled=false;button.textContent='Publicar solicitação ✓'; }
}
function pickD(element) { document.querySelectorAll('.dbtn').forEach(item=>item.classList.remove('on'));element.classList.add('on'); }
function setStar(number) { selectedRating=number;document.querySelectorAll('#starrow .starbtn').forEach((button,index)=>button.classList.toggle('lit',index<number)); }
function openM(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }
function closeM(event,id) { if(event.target===document.getElementById(id)) closeModal(id); }

async function initLogin() {
  const form=document.getElementById('loginForm'); if(!form)return;
  form.addEventListener('submit',async event=>{
    event.preventDefault();const button=form.querySelector('[type="submit"]'),feedback=document.getElementById('loginFeedback');
    feedback.style.display='none';button.disabled=true;button.textContent='Entrando...';
    try {
      const result=await apiRequest('/auth/login',{method:'POST',body:JSON.stringify({email:form.elements.email.value,password:form.elements.password.value})});
      localStorage.setItem(AUTH_TOKEN_KEY,result.token);localStorage.setItem(AUTH_USER_KEY,JSON.stringify(result.user));
      window.location.href=result.user.role==='DIARISTA'?'dashboard.html':'home.html';
    } catch(error) { feedback.textContent=error.message;feedback.style.display='block'; }
    finally { button.disabled=false;button.textContent='Entrar'; }
  });
}
async function initSignup() {
  const form=document.getElementById('signupForm');if(!form)return;
  const role=localStorage.getItem('higienizeSignupRole')||'CLIENTE';form.elements.role.value=role;
  document.getElementById('diaristFields').hidden=role!=='DIARISTA';
  document.getElementById('signupTitle').textContent=role==='DIARISTA'?'Criar conta de diarista':'Criar conta de morador';
  form.addEventListener('submit',async event=>{
    event.preventDefault();const button=form.querySelector('[type="submit"]');button.disabled=true;
    try {
      const body=Object.fromEntries(new FormData(form).entries());body.experienceYears=Number(body.experienceYears||0);
      const result=await apiRequest('/auth/register',{method:'POST',body:JSON.stringify(body)});
      localStorage.setItem(AUTH_TOKEN_KEY,result.token);localStorage.setItem(AUTH_USER_KEY,JSON.stringify(result.user));
      window.location.href=result.user.role==='DIARISTA'?'dashboard.html':'home.html';
    } catch(error) { showFeedback('signupFeedback',error.message); }
    finally { button.disabled=false; }
  });
}
async function initDiarists() {
  const list=document.getElementById('diaristList');if(!list)return;
  try {
    const people=await apiRequest('/diaristas');
    list.innerHTML=people.length?people.map(person=>`<a href="diarista.html?id=${encodeURIComponent(person.id)}" class="pro-card"><div class="pro-mark profile-marcia" role="img" aria-label="Perfil de ${safeText(person.name)}"></div><div class="pro-info"><div class="pro-name">${safeText(person.name)} <span>Verificada</span></div><div class="pro-meta">${safeText(person.city)} · ${Number(person.experienceYears)||0} anos de experiência</div><div class="pro-rating">${person.averageRating??'—'} <small>${person.reviews} avaliações</small></div></div><span class="pro-arrow">→</span></a>`).join(''):'<p>Nenhuma profissional verificada disponível no momento.</p>';
  } catch(error) { list.innerHTML=`<p>${safeText(error.message)}</p>`; }
}
async function initClientRequests() {
  const list=document.getElementById('clientRequests');if(!list)return;
  try {
    const requests=await apiRequest('/solicitacoes');
    list.innerHTML=requests.length?'': '<p>Você ainda não possui solicitações.</p>';
    for(const request of requests) {
      const card=document.createElement('article');card.className='ritem';
      const services=(request.services||[]).join(', ');
      card.innerHTML=`<div class="rico">⌂</div><div class="rinf"><div class="rtitle">${safeText(services||'Serviço doméstico')}</div><div class="rdate">${safeText(request.address)} · ${dateTime(request.scheduled_at)}</div><div class="rdate">Status: ${safeText(request.status)} · ${money(request.estimated_value)}</div></div><div class="request-actions"></div>`;
      const actions=card.querySelector('.request-actions');
      if(request.status==='ABERTA') {
        const chat=document.createElement('a');chat.className='btn bo';chat.href=`chat.html?requestId=${request.id}`;chat.textContent='Mensagens';actions.append(chat);
        try {
          const applications=await apiRequest(`/solicitacoes/${request.id}/candidaturas`);
          for(const app of applications.filter(item=>item.status==='PENDENTE')){
            const button=document.createElement('button');button.className='btn bd';button.textContent=`Aceitar ${app.name} · ${money(app.proposedValue)}`;
            button.onclick=async()=>{button.disabled=true;try{await apiRequest(`/solicitacoes/${request.id}/candidaturas/${app.id}/aceitar`,{method:'PATCH'});await initClientRequests();}catch(error){alert(error.message);button.disabled=false;}};
            actions.append(button);
          }
        } catch(error) { actions.append(document.createTextNode(error.message)); }
      } else if(request.status==='AGENDADA') {
        const chat=document.createElement('a');chat.className='btn bo';chat.href=`chat.html?requestId=${request.id}`;chat.textContent='Mensagens';actions.append(chat);
        const button=document.createElement('button');button.className='btn bd';button.textContent='Concluir serviço';button.onclick=async()=>{try{await apiRequest(`/solicitacoes/${request.id}/concluir`,{method:'PATCH'});await initClientRequests();}catch(error){alert(error.message);}};actions.append(button);
      } else if(request.status==='CONCLUIDA') {
        const review=document.createElement('a');review.className='btn bd';review.href=`avaliacao.html?requestId=${request.id}`;review.textContent='Avaliar';actions.append(review);
      }
      list.append(card);
    }
  } catch(error) { list.innerHTML=`<p>${safeText(error.message)}</p>`; }
}
async function initDashboard() {
  const container=document.getElementById('opportunities');if(!container)return;
  const user=currentUser();if(user?.name){const heading=document.querySelector('.hname');if(heading)heading.textContent=user.name;}
  try {
    const requests=await apiRequest('/solicitacoes');
    container.innerHTML=requests.length?requests.map(request=>`<article class="oppcard"><div class="opprow"><div><div class="opptype">${safeText((request.services||[]).join(' + ')||'Serviço doméstico')}</div><div class="opploc">${safeText(request.address)}</div></div><div class="oppprice">${money(request.estimated_value)}</div></div><div class="opptags"><span class="opptag">${dateTime(request.scheduled_at)}</span><span class="opptag">${safeText(request.property_size)}</span></div><button class="btn bd apply-button" data-id="${request.id}" style="font-size:14px;padding:13px;">Candidatar-se</button><p class="api-feedback" role="status"></p></article>`).join(''):'<p>Nenhuma solicitação aberta no momento.</p>';
    container.querySelectorAll('.apply-button').forEach(button=>button.addEventListener('click',async()=>{const raw=prompt('Qual valor deseja propor (R$)?');if(raw===null)return;const value=Number(raw.replace(',','.'));try{await apiRequest(`/solicitacoes/${button.dataset.id}/candidaturas`,{method:'POST',body:JSON.stringify({proposedValue:value})});button.textContent='Candidatura enviada';button.disabled=true;const chat=document.createElement('a');chat.className='btn bo';chat.href='chat.html?requestId='+button.dataset.id;chat.textContent='Mensagens';button.after(chat);}catch(error){button.nextElementSibling.textContent=error.message;}}));
  } catch(error) { container.innerHTML=`<p>${safeText(error.message)}</p>`; }
}
async function initChat() {
  const box=document.getElementById('cmsgs');if(!box)return;
  const requestId=new URLSearchParams(location.search).get('requestId');
  if(!requestId){box.innerHTML='<p>Abra as mensagens a partir de uma solicitação.</p>';document.getElementById('cinput').disabled=true;return;}
  const user=currentUser();if(!user){window.location.href='login.html';return;}
  async function refresh(){
    const messages=await apiRequest(`/solicitacoes/${requestId}/mensagens`);box.innerHTML='';
    messages.forEach(message=>{const row=document.createElement('div');row.className='msg '+(message.senderId===user.id?'s':'r');row.innerHTML=`<div class="mb">${safeText(message.content)}</div><div class="mt">${new Date(message.createdAt).toLocaleString('pt-BR')}</div>`;box.append(row);});box.scrollTop=box.scrollHeight;
  }
  try { await refresh(); } catch(error) { box.innerHTML=`<p>${safeText(error.message)}</p>`; }
  const input=document.getElementById('cinput');
  async function send(){const content=input.value.trim();if(!content)return;try{await apiRequest(`/solicitacoes/${requestId}/mensagens`,{method:'POST',body:JSON.stringify({content})});input.value='';await refresh();}catch(error){alert(error.message);}}
  document.querySelector('.csend').onclick=send;input.addEventListener('keydown',event=>{if(event.key==='Enter')send();});
}
async function initReview() {
  const submit=document.getElementById('reviewSubmit');if(!submit)return;
  submit.onclick=async()=>{
    const requestId=new URLSearchParams(location.search).get('requestId');
    if(!requestId){showFeedback('reviewFeedback','Abra a avaliação pelo serviço concluído para enviar a nota.');return;}
    const tags=[...document.querySelectorAll('.tagbtn.on')].map(button=>button.textContent.trim());submit.disabled=true;
    try {await apiRequest(`/solicitacoes/${requestId}/avaliacoes`,{method:'POST',body:JSON.stringify({rating:selectedRating,comment:document.getElementById('reviewComment').value,tags})});showFeedback('reviewFeedback','Avaliação publicada com sucesso.',true);setTimeout(()=>location.href='home.html',900);}
    catch(error){showFeedback('reviewFeedback',error.message);submit.disabled=false;}
  };
}
async function initDiaristProfile() {
  if(!document.querySelector('.phero'))return;
  const id=new URLSearchParams(location.search).get('id');if(!id)return;
  try {
    const person=await apiRequest(`/diaristas/${id}`);
    document.querySelector('.pname').textContent=person.name;document.querySelector('.psub span:last-child').textContent=person.city;
    document.querySelector('.psv').textContent=person.averageRating??'—';document.querySelectorAll('.psv')[2].textContent=`${person.experienceYears} anos`;
    document.querySelector('.psbio').textContent=person.bio||'Profissional cadastrada no Higienize.';
    document.querySelectorAll('.rcard').forEach(card=>card.remove());
    const section=[...document.querySelectorAll('.psec')].find(item=>item.querySelector('.pslbl')?.textContent==='Avaliações');
    person.reviewList.forEach(review=>{const card=document.createElement('div');card.className='rcard';card.innerHTML=`<p class="rtxt">${'★'.repeat(review.rating)} ${safeText(review.comment||'Sem comentário.')}</p>`;section.append(card);});
  } catch(error) { document.querySelector('.pname').textContent=error.message; }
}
document.addEventListener('DOMContentLoaded',()=>{
  initLogin();initSignup();initDiarists();initClientRequests();initDashboard();initChat();initReview();initDiaristProfile();
  const user=currentUser();if(user?.name){const heading=document.querySelector('.hname');if(heading)heading.textContent=user.name;}
  const date=document.getElementById('scheduleDate');if(date){const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);date.min=tomorrow.toISOString().slice(0,10);date.value=date.min;}
});



