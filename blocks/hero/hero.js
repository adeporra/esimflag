const DESTINATIONS = [
  { name: 'France', slug: 'france/esim-france' },
  { name: 'Italy', slug: 'italy/esim-italy' },
  { name: 'Japan', slug: 'japan/esim-japan' },
  { name: 'Mexico', slug: 'mexico/esim-mexico' },
  { name: 'Spain', slug: 'spain/esim-spain' },
  { name: 'United States of America', slug: 'united-states-of-america/esim-united-states-of-america' },
  { name: 'Germany', slug: 'germany/esim-germany' },
  { name: 'United Kingdom', slug: 'united-kingdom/esim-united-kingdom' },
  { name: 'Thailand', slug: 'thailand/esim-thailand' },
  { name: 'Turkey', slug: 'turkey/esim-turkey' },
  { name: 'Portugal', slug: 'portugal/esim-portugal' },
  { name: 'Greece', slug: 'greece/esim-greece' },
  { name: 'Brazil', slug: 'brazil/esim-brazil' },
  { name: 'Australia', slug: 'australia/esim-australia' },
  { name: 'Canada', slug: 'canada/esim-canada' },
];

function buildSearchForm(block) {
  const form = document.createElement('div');
  form.className = 'hero-search';

  // Destination input with autocomplete
  const destWrapper = document.createElement('div');
  destWrapper.className = 'hero-search-field hero-search-destination';

  const destInput = document.createElement('input');
  destInput.type = 'text';
  destInput.placeholder = 'Where are you travelling to?';
  destInput.setAttribute('aria-label', 'Where are you travelling to?');
  destInput.autocomplete = 'off';

  const destIcon = document.createElement('span');
  destIcon.className = 'hero-search-icon';
  destIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="3"/><path d="M12 2C7.6 2 4 5.4 4 9.5C4 14.3 12 22 12 22s8-7.7 8-12.5C20 5.4 16.4 2 12 2z"/></svg>';

  const dropdown = document.createElement('ul');
  dropdown.className = 'hero-search-dropdown';
  dropdown.hidden = true;

  destWrapper.append(destInput, destIcon, dropdown);

  // Days selector
  const daysWrapper = document.createElement('div');
  daysWrapper.className = 'hero-search-field hero-search-days';

  const daysBtn = document.createElement('button');
  daysBtn.type = 'button';
  daysBtn.className = 'hero-search-days-btn';

  const daysLabel = document.createElement('span');
  daysLabel.className = 'hero-search-days-label';
  daysLabel.textContent = 'Nº days';

  const daysIcon = document.createElement('span');
  daysIcon.className = 'hero-search-icon';
  daysIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';

  daysBtn.append(daysLabel, daysIcon);

  const daysDropdown = document.createElement('ul');
  daysDropdown.className = 'hero-search-dropdown hero-search-days-dropdown';
  daysDropdown.hidden = true;

  for (let i = 1; i <= 30; i += 1) {
    const li = document.createElement('li');
    li.textContent = `${i} day${i > 1 ? 's' : ''}`;
    li.dataset.value = i;
    li.addEventListener('click', () => {
      daysLabel.textContent = `${i} day${i > 1 ? 's' : ''}`;
      daysBtn.dataset.selected = i;
      daysDropdown.hidden = true;
    });
    daysDropdown.append(li);
  }

  daysWrapper.append(daysBtn, daysDropdown);

  // eSIM quantity selector
  const esimWrapper = document.createElement('div');
  esimWrapper.className = 'hero-search-field hero-search-esims';

  const esimBtn = document.createElement('button');
  esimBtn.type = 'button';
  esimBtn.className = 'hero-search-days-btn';

  const esimLabel = document.createElement('span');
  esimLabel.className = 'hero-search-days-label';
  esimLabel.textContent = 'Nº eSIM';

  const esimIcon = document.createElement('span');
  esimIcon.className = 'hero-search-icon';
  esimIcon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 6h6M9 10h6M9 14h6"/></svg>';

  esimBtn.append(esimLabel, esimIcon);

  const esimDropdown = document.createElement('ul');
  esimDropdown.className = 'hero-search-dropdown hero-search-esims-dropdown';
  esimDropdown.hidden = true;

  for (let i = 1; i <= 10; i += 1) {
    const li = document.createElement('li');
    li.textContent = `${i} eSIM`;
    li.dataset.value = i;
    li.addEventListener('click', () => {
      esimLabel.textContent = `${i} eSIM`;
      esimBtn.dataset.selected = i;
      esimDropdown.hidden = true;
    });
    esimDropdown.append(li);
  }

  esimWrapper.append(esimBtn, esimDropdown);

  // View plan button
  const viewBtn = document.createElement('a');
  viewBtn.className = 'hero-search-submit';
  viewBtn.textContent = 'View plan';
  viewBtn.href = 'https://www.esimflag.com/en/destinations';

  form.append(destWrapper, daysWrapper, esimWrapper, viewBtn);

  // Destination autocomplete logic
  let selectedSlug = '';

  function updateLink() {
    if (selectedSlug) {
      viewBtn.href = `https://www.esimflag.com/en/configurator/${selectedSlug}`;
    }
  }

  destInput.addEventListener('input', () => {
    const query = destInput.value.toLowerCase().trim();
    dropdown.innerHTML = '';
    if (query.length < 1) {
      dropdown.hidden = true;
      return;
    }
    const matches = DESTINATIONS.filter((d) => d.name.toLowerCase().includes(query));
    if (matches.length === 0) {
      dropdown.hidden = true;
      return;
    }
    matches.forEach((d) => {
      const li = document.createElement('li');
      li.textContent = d.name;
      li.addEventListener('click', () => {
        destInput.value = d.name;
        selectedSlug = d.slug;
        dropdown.hidden = true;
        updateLink();
      });
      dropdown.append(li);
    });
    dropdown.hidden = false;
  });

  destInput.addEventListener('focus', () => {
    if (destInput.value.length >= 1) {
      destInput.dispatchEvent(new Event('input'));
    }
  });

  daysBtn.addEventListener('click', () => {
    daysDropdown.hidden = !daysDropdown.hidden;
    dropdown.hidden = true;
    esimDropdown.hidden = true;
  });

  esimBtn.addEventListener('click', () => {
    esimDropdown.hidden = !esimDropdown.hidden;
    dropdown.hidden = true;
    daysDropdown.hidden = true;
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!destWrapper.contains(e.target)) dropdown.hidden = true;
    if (!daysWrapper.contains(e.target)) daysDropdown.hidden = true;
    if (!esimWrapper.contains(e.target)) esimDropdown.hidden = true;
  });

  // Remove existing subtitle and button, keep only h1
  const contentDiv = block.querySelector(':scope > div:last-child > div');
  if (contentDiv) {
    const h1 = contentDiv.querySelector('h1');
    if (h1) {
      contentDiv.innerHTML = '';
      contentDiv.append(h1, form);
    }
  }
}

export default function decorate(block) {
  buildSearchForm(block);
}
