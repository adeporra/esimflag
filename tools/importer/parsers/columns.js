/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://www.esimflag.com/
 * Base Block: columns
 *
 * Handles multiple columns layouts on the homepage:
 * 1. Single eSIM section (.unique-esim--card) - text left + image right
 * 2. 4 Steps section (.c-carousel--image with steps heading) - image left + steps right
 * 3. Return Policy section - image left + text right (identified by heading content)
 *
 * Block Structure (from markdown example):
 * Single row with 2 columns: [column1_content, column2_content]
 *
 * Source HTML Patterns (from captured DOM):
 * - Single eSIM: <section class="c-carousel c-carousel--image unique-esim--card">
 *     <div class="c-carosuel__title"><h2>A single eSIM...</h2><span>description</span><button>CTA</button></div>
 *     <div class="c-carousel__content"><img src="..." alt="..."></div>
 * - Steps: <section class="c-carousel c-carousel--image"> with h2#carosuel-title3 "4 steps"
 *     <div class="c-carosuel__title"><h2>4 steps...</h2></div>
 *     <div class="c-carousel__content"><img src="..."></div> + step items with h3/descriptions
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  const isSingleEsim = element.classList.contains('unique-esim--card');

  if (isSingleEsim) {
    // SINGLE ESIM COLUMNS
    // Found in captured DOM: .c-carosuel__title contains h2, span (description), button (CTA)
    // .c-carousel__content contains the image
    const heading = element.querySelector('.c-carosuel__title h2') ||
                    element.querySelector('h2');
    const description = element.querySelector('.c-carosuel__title span');
    const ctaButton = element.querySelector('.c-carosuel__title button');
    const image = element.querySelector('.c-carousel__content img') ||
                  element.querySelector('img.c-carosuel__content-image');

    // Column 1: Text content
    const col1 = [];
    if (heading) {
      col1.push(heading.cloneNode(true));
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      col1.push(p);
    }
    if (ctaButton) {
      const ctaText = ctaButton.textContent.trim().replace(/\s+/g, ' ');
      if (ctaText) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = 'https://www.esimflag.com/en/destinations';
        a.textContent = ctaText;
        p.appendChild(a);
        col1.push(p);
      }
    }

    // Column 2: Image
    const col2 = [];
    if (image) {
      col2.push(image.cloneNode(true));
    }

    cells.push([col1, col2]);
  } else {
    // STEPS or RETURN POLICY COLUMNS
    // Determine based on heading content
    const heading = element.querySelector('h2');
    const headingText = heading ? heading.textContent.trim() : '';
    const isSteps = headingText.toLowerCase().includes('steps') ||
                    headingText.toLowerCase().includes('step');

    if (isSteps) {
      // 4 STEPS COLUMNS
      // Found in captured DOM: section.c-carousel.c-carousel--image
      // Image on left (from .c-carousel__content), steps text on right
      const image = element.querySelector('.c-carousel__content img[src*="images/"]') ||
                    element.querySelector('img[src*="images/"]');

      // Column 1: Image
      const col1 = [];
      if (image) {
        col1.push(image.cloneNode(true));
      }

      // Column 2: Steps content
      // Found in captured DOM: h3 elements with step titles, followed by description text
      const col2 = [];
      const stepHeadings = element.querySelectorAll('h3');

      stepHeadings.forEach((stepH3, index) => {
        const stepTitle = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${index + 1}. ${stepH3.textContent.trim()}`;
        stepTitle.appendChild(strong);
        col2.push(stepTitle);

        // Look for description paragraph following the step heading
        const parentDiv = stepH3.closest('div');
        if (parentDiv) {
          const nextSibling = parentDiv.nextElementSibling;
          if (nextSibling) {
            const descP = nextSibling.querySelector('p') ||
                          nextSibling.querySelector('span');
            if (descP && descP.textContent.trim()) {
              const p = document.createElement('p');
              p.textContent = descP.textContent.trim();
              col2.push(p);
            }
          }
        }
      });

      // Add CTA for steps
      const ctaButton = element.querySelector('.c-carosuel__title button');
      if (ctaButton) {
        const ctaText = ctaButton.textContent.trim().replace(/\s+/g, ' ');
        if (ctaText) {
          const p = document.createElement('p');
          const a = document.createElement('a');
          a.href = 'https://www.esimflag.com/en/destinations';
          a.textContent = 'How to set up my eSIM';
          p.appendChild(a);
          col2.push(p);
        }
      }

      cells.push([col1, col2]);
    } else {
      // RETURN POLICY COLUMNS (or generic 2-column layout)
      // Image on left, text + CTA on right
      const image = element.querySelector('img[src*="images/"]');
      const description = element.querySelector('p');
      const ctaLink = element.querySelector('a[href]');

      // Column 1: Image
      const col1 = [];
      if (image) {
        col1.push(image.cloneNode(true));
      }

      // Column 2: Heading + description + CTA
      const col2 = [];
      if (heading) {
        col2.push(heading.cloneNode(true));
      }
      if (description) {
        col2.push(description.cloneNode(true));
      }
      if (ctaLink) {
        const p = document.createElement('p');
        const a = document.createElement('a');
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim().replace(/\s+/g, ' ');
        p.appendChild(a);
        col2.push(p);
      }

      cells.push([col1, col2]);
    }
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
