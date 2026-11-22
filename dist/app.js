(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-nav');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Abrir menú');
    navigation.classList.remove('is-open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    navigation.classList.toggle('is-open', open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menu.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });

  const cards = Array.from(document.querySelectorAll('.resource-card'));
  const filters = document.querySelectorAll('[data-filter]');
  const search = document.querySelector('#source-search');
  const resultCount = document.querySelector('#results-count');
  const empty = document.querySelector('#empty-state');
  let activeFilter = 'todas';
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function filterSources() {
    const words = normalize(search.value.trim()).split(/\s+/).filter(Boolean);
    let count = 0;
    cards.forEach(card => {
      const matchingCategory = activeFilter === 'todas' || card.dataset.category.split(' ').includes(activeFilter);
      const text = normalize(card.textContent + ' ' + card.dataset.search);
      const matchingWords = words.every(word => text.includes(word));
      card.hidden = !(matchingCategory && matchingWords);
      if (!card.hidden) count++;
    });
    resultCount.textContent = count + (count === 1 ? ' fuente disponible' : ' fuentes disponibles');
    empty.hidden = count > 0;
    document.querySelector('#resources-grid').hidden = count === 0;
  }
  function setFilter(filter) {
    activeFilter = filter;
    filters.forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    filterSources();
  }
  filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
  search.addEventListener('input', filterSources);
  document.querySelector('#reset-search').addEventListener('click', () => {
    search.value = '';
    setFilter('todas');
    search.focus();
  });
  document.querySelectorAll('[data-filter-link]').forEach(link => link.addEventListener('click', () => {
    search.value = '';
    setFilter(link.dataset.filterLink);
  }));

  document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.open);
    dialog.showModal();
    dialog.scrollTop = 0;
  }));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  });
  document.querySelectorAll('[data-close-and-go]').forEach(button => button.addEventListener('click', () => {
    button.closest('dialog').close();
    const target = document.getElementById(button.dataset.closeAndGo);
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#' + target.id);
  }));

  const form = document.querySelector('#contribution-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const get = name => String(fields.get(name) || '').trim();
    for (const name of ['titulo', 'resumen']) {
      if (!get(name)) {
        form.elements[name].setCustomValidity('Escribe contenido; el campo no puede contener solo espacios.');
        form.elements[name].reportValidity();
        return;
      }
    }
    if (get('enlace')) {
      const url = new URL(get('enlace'));
      if (!['https:', 'http:'].includes(url.protocol)) {
        form.elements.enlace.setCustomValidity('Utiliza un enlace que comience por https:// o http://.');
        form.elements.enlace.reportValidity();
        return;
      }
    }
    const date = new Intl.DateTimeFormat('es-DO', {dateStyle: 'long',timeZone: 'America/Santo_Domingo'}).format(new Date());
    const content = [
      'CONFLUENCIA — FICHA DE APORTE',
      'confluencia.do',
      '',
      'Fecha de preparación: ' + date,
      'Tipo: ' + get('tipo'),
      'Título: ' + get('titulo'),
      'Tema: ' + get('tema'),
      'Lugar: ' + (get('lugar') || 'No especificado'),
      'Fuente o autor: ' + (get('fuente') || 'Por identificar'),
      'Enlace: ' + (get('enlace') || 'No indicado'),
      '',
      'QUÉ APORTA Y QUÉ FALTA VERIFICAR',
      get('resumen'),
      '',
      'SEGUIMIENTO',
      'Documentos pendientes:',
      'Persona o equipo que revisará:',
      'Próxima revisión:',
      '',
      'Ficha preparada en el navegador. No enviada ni recibida por Confluencia.',
      'Revisa el contenido y compártelo solo con las personas a quienes corresponda.'
    ].join('\n');
    const blob = new Blob(['\uFEFF' + content], {type: 'text/plain;charset=utf-8'});
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'confluencia-aporte-' + normalize(get('titulo')).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0,60) + '.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    document.querySelector('#contribution-status').textContent = 'Tu ficha está lista y se inició la descarga. Puedes revisarla y compartirla; no se ha enviado a Confluencia.';
  });
  form.elements.enlace.addEventListener('input', () => form.elements.enlace.setCustomValidity(''));
  ['titulo', 'resumen'].forEach(name => form.elements[name].addEventListener('input', () => form.elements[name].setCustomValidity('')));
  form.addEventListener('input', () => document.querySelector('#contribution-status').textContent = '');
})();
