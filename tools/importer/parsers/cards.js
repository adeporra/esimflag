/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://www.esimflag.com/
 * Base Block: cards
 *
 * Handles three card variants on the homepage:
 * 1. Destination cards (.c-destinations) - flag image + country name + price + link
 * 2. Benefit cards (.c-carousel.c-carousel--bg) - text-only benefit items
 * 3. Feature cards (section.c-carousel without modifiers) - image + title + description
 *
 * Block Structure (from markdown example):
 * Each row = one card, with columns for image (optional) and text content
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Determine which card variant we're dealing with
  const isDestinations = element.classList.contains('c-destinations');
  const isBenefits = element.classList.contains('c-carousel--bg');

  if (isDestinations) {
    // DESTINATION CARDS
    // Found in captured DOM: .c-destinations > .c-destinations__content > section > a
    // Each card: a[href] > div > div > (img flag + h3 country + p price)
    const cardLinks = element.querySelectorAll('.c-destinations__content section > a');

    cardLinks.forEach((link) => {
      const img = link.querySelector('img[src*="images/"]');
      const title = link.querySelector('h3');
      const price = link.querySelector('p');

      const imageCell = [];
      if (img) {
        imageCell.push(img.cloneNode(true));
      }

      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.textContent = title.textContent.trim();
        strong.appendChild(anchor);
        const p = document.createElement('p');
        p.appendChild(strong);
        textCell.push(p);
      }
      if (price) {
        textCell.push(price.cloneNode(true));
      }

      cells.push([imageCell, textCell]);
    });
  } else if (isBenefits) {
    // BENEFIT CARDS (text-only, no images)
    // Found in captured DOM: .c-carousel.c-carousel--bg > ... > .c-carousel__content
    // Each benefit: section > div > div > ... > span with benefit text
    const benefitSections = element.querySelectorAll('.c-carousel__content section');

    benefitSections.forEach((section) => {
      const textSpan = section.querySelector('span');
      if (textSpan) {
        const strong = document.createElement('strong');
        strong.textContent = textSpan.textContent.trim();
        const textCell = document.createElement('div');
        textCell.appendChild(strong);
        cells.push([[textCell]]);
      }
    });
  } else {
    // FEATURE CARDS (image + title + description)
    // Found in captured DOM: section.c-carousel > ... > .c-carousel__content
    // Each card: section with img[src*="images/"], h2 title, p description
    const featureSections = element.querySelectorAll('.c-carousel__content section');

    featureSections.forEach((section) => {
      const img = section.querySelector('img[src*="images/"]');
      const title = section.querySelector('h2');
      const desc = section.querySelector('p');

      const imageCell = [];
      if (img) {
        imageCell.push(img.cloneNode(true));
      }

      const textCell = [];
      if (title) {
        const strong = document.createElement('p');
        const boldEl = document.createElement('strong');
        boldEl.textContent = title.textContent.trim();
        strong.appendChild(boldEl);
        textCell.push(strong);
      }
      if (desc) {
        textCell.push(desc.cloneNode(true));
      }

      cells.push([imageCell, textCell]);
    });
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
