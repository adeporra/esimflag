import { createOptimizedPicture } from '../../scripts/aem.js';

function addCarouselArrows(block, ul) {
  const nav = document.createElement('div');
  nav.className = 'cards-carousel-nav';

  const prev = document.createElement('button');
  prev.className = 'cards-carousel-prev';
  prev.setAttribute('aria-label', 'Previous');
  prev.innerHTML = '&#8249;';

  const next = document.createElement('button');
  next.className = 'cards-carousel-next';
  next.setAttribute('aria-label', 'Next');
  next.innerHTML = '&#8250;';

  const scrollByCard = (direction) => {
    const card = ul.querySelector('li');
    if (!card) return;
    const gap = parseFloat(window.getComputedStyle(ul).gap) || 0;
    const distance = card.offsetWidth + gap;
    ul.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));

  nav.append(prev, next);
  block.append(nav);
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.replaceChildren(ul);

  if (block.closest('.section.steps')) {
    addCarouselArrows(block, ul);
  }
}
