// highlightChunk.js
export function highlightChunkByContent(chunkHtml) {
  if (!chunkHtml) return;

  const cleanedChunkHtml = cleanChunkHtml(chunkHtml).trim();

  // Search all elements inside the content container
  const allElements = document.querySelectorAll('.filling-content *');
  let found = null;
  for (const el of allElements) {
    // Remove data-chunk-index from the element's innerHTML before comparing
    const elHtmlCleaned = cleanChunkHtml(el.innerHTML).trim();

    if (elHtmlCleaned === cleanedChunkHtml) {
      found = el;
      break;
    }
  }
  if (found) {
    console.log("Found element:", found);
    found.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    console.warn("No element found for chunk:", chunkHtml);
  }
}

// Helper function
function cleanChunkHtml(html) {
  return html.replace(/\s*data-chunk-index="[^"]*"/g, "");
}
