// main.js — Comportements côté client
// - menu mobile, défilement fluide, modals de projet, animations 'reveal', effet de saisie et soumission AJAX du formulaire
// Les commentaires sont courts et en français pour faciliter la lecture
document.addEventListener('DOMContentLoaded', function(){ 
  // Menu mobile : bascule l'affichage des liens quand l'utilisateur appuie sur le bouton burger
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');
  if(toggle){
    toggle.addEventListener('click', ()=>{
      if(nav.style.display === 'flex') nav.style.display = '';
      else nav.style.display = 'flex';
    });
  }

  // Défilement fluide pour les ancres internes (navigation vers sections)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{ 
    a.addEventListener('click', function(e){
      const target = this.getAttribute('href');
      if(target.startsWith('#')){
        e.preventDefault();
        const el = document.querySelector(target);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    })
  });

  // Animation 'reveal' : on observe les éléments et on déclenche leur apparition quand ils entrent dans le viewport
  const observer = new IntersectionObserver((entries)=>{ 
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        // If it's a skill-bar, animate width
        if(entry.target.classList && entry.target.classList.contains('skill-bar')){
          const fill = entry.target.querySelector('.bar-fill');
          const target = entry.target.getAttribute('data-percent') || '0';
          fill.style.width = target + '%';
        }
        // If contains counters, animate numbers
        if(entry.target.querySelectorAll){
          const nums = entry.target.querySelectorAll('.num[data-target]');
          nums.forEach(n=>{
            if(!n.dataset.animated){
              n.dataset.animated = 'true';
              const target = parseInt(n.getAttribute('data-target'),10) || 0;
              let current = 0;
              const step = Math.max(1, Math.floor(target/40));
              const iv = setInterval(()=>{
                current += step;
                if(current >= target){ n.textContent = target; clearInterval(iv); }
                else n.textContent = current;
              }, 18);
            }
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});

  document.querySelectorAll('.reveal, .project, .timeline li, .skill-bar, .stats, .stat').forEach(el=>observer.observe(el));

  // Effet de saisie dynamique (texte typé) : lit les chaînes dans data-strings et boucle
  const typedEl = document.querySelector('.typed'); 
  if(typedEl){
    const strings = (typedEl.getAttribute('data-strings')||'').split(';').map(s=>s.trim()).filter(Boolean);
    let idx = 0, pos = 0, typing = true;
    function tick(){
      const current = strings[idx] || '';
      if(typing){
        pos++;
        typedEl.textContent = current.slice(0,pos);
        if(pos >= current.length){ typing = false; setTimeout(tick, 1200); return; }
      } else {
        pos--;
        typedEl.textContent = current.slice(0,pos);
        if(pos <= 0){ typing = true; idx = (idx+1)%strings.length; }
      }
      setTimeout(tick, typing ? 80 : 30);
    }
    tick();
  }

  // Modal de projet : ouvre une fenêtre avec les détails du projet (contenu inline dans le JS)
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody'); 
  const closeBtn = modal.querySelector('.modal-close');

  function openModal(html){
    modalBody.innerHTML = html;
    modal.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    modalBody.innerHTML = '';
  }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });

  document.querySelectorAll('.open-project').forEach(btn=>{
    btn.addEventListener('click', function(){
      const card = this.closest('.project');
      const slug = card && card.dataset.slug;
      // Inline content mapping - détaillé
      const content = {
        'reco-ecommerce': `
          <h3>Plateforme e-commerce — Moteur de recommandation</h3>
          <p>Conception et intégration d'un moteur hybride (collaboratif + contenu) pour améliorer la pertinence des suggestions. Travaux: feature engineering, évaluation offline/online, tests A/B et intégration via API.</p>
          <p class="muted small"><strong>Tech:</strong> Python, scikit-learn, Surprise, Pandas, Flask, SQL</p>
        `,
        'visual-automation': `
          <h3>Automatisation des workflows d'analyse</h3>
          <p>Pipeline d'automatisation pour ETL, génération de rapports et dashboards destinés aux équipes métier. Mise en place de tests de qualité des données et orchestration simple.</p>
          <p class="muted small"><strong>Tech:</strong> Python, Pandas, Matplotlib, PowerBI</p>
        `,
        'moderation-nlp': `
          <h3>Plateforme IA de modération de contenus</h3>
          <p>Lauréate du 2ème Prix - Hackathon25 OpenData (2025). Pipeline de détection et modération de contenus toxiques avec modèle de NLP et système de règles, optimisation latence et intégration temps-réel.</p>
          <p class="muted small"><strong>Tech:</strong> Python, Transformers, NLP, Flask</p>
        `
      };
      openModal(content[slug]||'<p>Détails à venir.</p>');
    });
  });

  // Soumission AJAX du formulaire de contact (si activée) — renvoie notifications et reset du formulaire
  const form = document.getElementById('contactForm');
  const notif = document.getElementById('notif'); 
  if(form){
    form.addEventListener('submit', async function(e){
      e.preventDefault();
      const data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
      };
      if(!data.name || !data.email || !data.message){
        notif.textContent = 'Veuillez remplir tous les champs.';
        notif.style.display = 'block';
        setTimeout(()=>notif.style.display='none',3000);
        return;
      }
      try{
        const res = await fetch(form.action, {
          method: 'POST',
          headers: {'Content-Type':'application/json', 'Accept':'application/json'},
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if(res.ok){
          notif.textContent = json.message || 'Message envoyé.';
          notif.style.display = 'block';
          notif.classList.add('flash');
          form.reset();
          setTimeout(()=>notif.style.display='none', 5000);
        } else {
          notif.textContent = json.message || 'Erreur lors de l\'envoi.';
          notif.style.display = 'block';
          setTimeout(()=>notif.style.display='none', 4000);
        }
      } catch(err){
        notif.textContent = 'Erreur réseau. Réessayez.';
        notif.style.display = 'block';
        setTimeout(()=>notif.style.display='none', 4000);
      }
    });
  }

  // Barre de progression en haut de page : indique la position de scroll relative à la page
  const progress = document.getElementById('scrollProgress');
  function updateProgress(){
    const h = document.documentElement;
    const ratio = (h.scrollTop) / (h.scrollHeight - h.clientHeight);
    if(progress) progress.style.width = Math.max(0, Math.min(100, ratio*100)) + '%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

});