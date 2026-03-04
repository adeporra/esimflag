/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for eSimFLAG website cleanup
 * Purpose: Remove non-content elements, navigation chrome, and interactive widgets
 * Applies to: www.esimflag.com (all templates)
 * Generated: 2026-03-04
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page migration workflow
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove chat widget - Found in captured DOM: <chat-widget>
    WebImporter.DOMUtils.remove(element, [
      'chat-widget',
    ]);

    // Remove default-theme element - Found in captured DOM: <default-theme>
    WebImporter.DOMUtils.remove(element, [
      'default-theme',
    ]);

    // Remove header and footer - handled by separate navigation/footer skills
    // Found in captured DOM: <header class="v16_17_..."> and <footer class="footer">
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
    ]);

    // Remove interactive configurator widget (non-authorable search form)
    // Found in captured DOM: <div class="configurator-widget">
    WebImporter.DOMUtils.remove(element, [
      '.configurator-widget',
    ]);

    // Remove carousel navigation buttons (left/right arrows)
    // Found in captured DOM as siblings of carousel slide containers
    // These are obfuscated class buttons with prev/next SVG arrows
    const carouselNavButtons = element.querySelectorAll(
      '[class*="v16_17_1abcu711"], [class*="v16_17_1abcu712"]'
    );
    carouselNavButtons.forEach((btn) => btn.remove());

    // Remove carousel pagination dots
    // Found in captured DOM: <div class="v16_17_1abcu714 ..."> containing dot buttons
    const paginationContainers = element.querySelectorAll('[class*="v16_17_1abcu714"]');
    paginationContainers.forEach((container) => container.remove());

    // Remove banner promo carousel wrapper (promotions are default content)
    // Found in captured DOM: <div class="banner__promo-verano">
    WebImporter.DOMUtils.remove(element, [
      '.banner__promo-verano',
    ]);

    // Re-enable scrolling if body has overflow hidden
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining standard non-content elements
    WebImporter.DOMUtils.remove(element, [
      'noscript',
      'link',
    ]);

    // Remove inline SVG images (base64 data URIs used for icons)
    // Found in captured DOM: many <img src="data:image/svg+xml;base64,...">
    const svgImages = element.querySelectorAll('img[src^="data:image/svg+xml"]');
    svgImages.forEach((img) => img.remove());
  }
}
