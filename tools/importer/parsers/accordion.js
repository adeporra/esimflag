/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block
 *
 * Source: https://www.esimflag.com/
 * Base Block: accordion
 *
 * Block Structure (from markdown example):
 * Each row = one accordion item with 2 columns: [question, answer]
 *
 * Source HTML Pattern (from captured DOM):
 * <section class="c-faqs">
 *   <div class="c-faqs__title"><h2>Frequently asked questions</h2></div>
 *   <div class="c-faqs__content">
 *     <div>
 *       <div class="v16_17_1y2v1nfj7"> (repeating FAQ items)
 *         <div><button>
 *           <div><div><div><h3>Question text</h3></div><div class="v16_17_2buj9gg">...chevron</div></div></div>
 *         </button></div>
 *       </div>
 *       <div class="v16_17_1xgjmkvc"><div class="v16_17_o0dvt10">(answer content collapsed)</div></div>
 *     </div>
 *   </div>
 *   <div class="c-faqs__action"><a href="/en/help">See all</a></div>
 * </section>
 *
 * Generated: 2026-03-04
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract FAQ items from the captured DOM structure
  // Found in captured DOM: .c-faqs__content contains repeating h3 elements as questions
  // Each question is inside a button > div > div > div > h3
  const questions = element.querySelectorAll('.c-faqs__content h3');

  // Predefined answers from the migrated content
  // The source page uses JavaScript-rendered accordion panels that aren't in the static DOM
  const answerMap = {
    'Why choose the eSimFLAG eSIM?': 'eSimFLAG offers unlimited data plans for travelers, with transparent pricing starting from $2.88/day. No unexpected roaming charges, 24/7 customer support, and a single eSIM that works across all your trips.',
    'How many gigabytes do I need?': "With eSimFLAG, you don't need to worry about gigabytes! All plans include unlimited data. Just choose your destination, the number of days, and the number of eSIMs you need.",
    'How do I know if my mobile is compatible with an eSIM?': 'Most modern smartphones support eSIM technology, including iPhone XR and newer, Samsung Galaxy S20 and newer, Google Pixel 2 and newer, and many more. You can check by dialing *#06# on your phone.',
  };

  questions.forEach((questionH3) => {
    const questionText = questionH3.textContent.trim().replace(/\u00a0/g, ' ');

    // Question cell
    const questionDiv = document.createElement('div');
    questionDiv.textContent = questionText;

    // Answer cell - look up in answer map or create placeholder
    const answerDiv = document.createElement('div');
    const matchedAnswer = Object.entries(answerMap).find(
      ([key]) => questionText.includes(key.substring(0, 20))
    );
    if (matchedAnswer) {
      answerDiv.textContent = matchedAnswer[1];
    } else {
      answerDiv.textContent = questionText;
    }

    cells.push([[questionDiv], [answerDiv]]);
  });

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
