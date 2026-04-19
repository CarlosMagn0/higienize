// PERFIL CHOICE
function selPerfil(t) {
  const cc = document.getElementById('cc-c');
  const cd = document.getElementById('cc-d');
  const cs = document.getElementById('cc-s');
  if (cc) cc.classList.toggle('on', t === 'c');
  if (cd) cd.classList.toggle('on', t === 'd');
  if (cs) cs.classList.toggle('on', t === 's');
}

// STEPPER
let step = 1, TOTAL = 4;
function updStep() {
  for (let i = 1; i <= TOTAL; i++) {
    const d = document.getElementById('d' + i);
    const p = document.getElementById('p' + i);
    if (d) d.className = 'sdot' + (i < step ? ' done' : i === step ? ' act' : '');
    if (p) p.className = 'spane' + (i === step ? ' on' : '');
  }
  const bk = document.getElementById('sbk');
  const nx = document.getElementById('snxt');
  if (bk) bk.style.display = step > 1 ? 'block' : 'none';
  if (nx) nx.textContent = step === TOTAL ? 'Publicar solicitação ✓' : 'Próximo →';
  const sa = document.getElementById('slsa');
  if (sa) sa.scrollTop = 0;
}
function sNext() {
  if (step < TOTAL) { step++; updStep(); }
  else { window.location.href = 'home.html'; }
}
function sBack() {
  if (step > 1) { step--; updStep(); }
}

// DATE
function pickD(el) {
  document.querySelectorAll('.dbtn').forEach(d => d.classList.remove('on'));
  el.classList.add('on');
}

// STARS
function setStar(n) {
  document.querySelectorAll('#starrow .starbtn').forEach((b, i) => b.classList.toggle('lit', i < n));
}

// CHAT
function sendMsg() {
  const inp = document.getElementById('cinput');
  if (!inp) return;
  const txt = inp.value.trim();
  if (!txt) return;
  const box = document.getElementById('cmsgs');
  const now = new Date();
  const t = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  const d = document.createElement('div');
  d.className = 'msg s';
  d.innerHTML = `<div class="mb">${txt}</div><div class="mt">${t}</div>`;
  box.appendChild(d);
  inp.value = '';
  box.scrollTop = box.scrollHeight;
}

document.addEventListener('DOMContentLoaded', function () {
  const cinput = document.getElementById('cinput');
  if (cinput) {
    cinput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMsg(); });
  }
});

// MODAL
function openM(id) { const el = document.getElementById(id); if (el) el.classList.add('open'); }
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('open'); }
function closeM(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }
