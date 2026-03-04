/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://www.esimflag.com/
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Background image
 * - Row 2: Content (heading, description text, CTA)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="container-searcher">
 *   <div class="home-searcher__header">
 *     <img src="./images/...jpg"> (background image)
 *     <h1 class="home-searcher__title">...</h1>
 *     <div class="configurator-widget">...</div> (removed by transformer)
 *   </div>
 * </div>
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  // Extract background image
  // Found in captured DOM: <img src="./images/7c927093...jpg"> inside .home-searcher__header
  const bgImage = element.querySelector('.home-searcher__header > img') ||
                  element.querySelector('img[src*="images/"]');

  // Extract heading
  // Found in captured DOM: <h1 class="home-searcher__title">
  const heading = element.querySelector('.home-searcher__title') ||
                  element.querySelector('h1');

  // Build cells array matching Hero block markdown structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage.cloneNode(true)]);
  }

  // Row 2: Content cell with heading and descriptive text + CTA
  const contentCell = [];
  if (heading) {
    contentCell.push(heading.cloneNode(true));
  }

  // Add a descriptive paragraph and CTA link since the configurator widget
  // is interactive and not authorable - replaced with static CTA
  const desc = document.createElement('p');
  desc.textContent = 'Travel with unlimited data from €2.4/day, the best connection at the best price.';
  contentCell.push(desc);

  const cta = document.createElement('p');
  const ctaLink = document.createElement('a');
  ctaLink.href = 'https://www.esimflag.com/en/destinations';
  ctaLink.textContent = 'View plans';
  cta.appendChild(ctaLink);
  contentCell.push(cta);

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
