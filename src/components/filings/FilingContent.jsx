import React from "react";

function getHighlightedHtml(content, chunkHtml, isBeingHighlighted) {
  if (!chunkHtml || !isBeingHighlighted) return content;
  const cleanedChunk = chunkHtml.trim();
  if (!cleanedChunk) return content;

  const idx = content.indexOf(cleanedChunk);
  if (idx === -1) return content;

  const before = content.slice(0, idx);
  const match = content.slice(idx, idx + chunkHtml.length);
  const after = content.slice(idx + chunkHtml.length);

  return `${before}<div class="highlighted-chunk" id="highlighted-chunk">${match}</div>${after}`;
}

const FilingContent = ({
  content,
  chunkHtml,
  isBeingHighlighted,
  setIsBeingHighlighted,
}) => {
  // Compute highlighted HTML synchronously
  const highlightedHtml = getHighlightedHtml(content, chunkHtml, isBeingHighlighted);

  // Scroll and then remove highlight after a short delay, only if isBeingHighlighted
  if (typeof window !== "undefined" && chunkHtml && isBeingHighlighted) {
    setTimeout(() => {
      const el = document.getElementById("highlighted-chunk");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          // Remove highlight by replacing the span with its inner HTML
          const parent = el.parentNode;
          if (parent) {
            parent.replaceChild(
              document.createRange().createContextualFragment(el.innerHTML),
              el
            );
          }
          // Notify parent that highlighting is done
          if (typeof setIsBeingHighlighted === "function") {
            setIsBeingHighlighted(false);
          }
        }, 5000);
      } else {
        // If not found, still notify parent to reset state
        if (typeof setIsBeingHighlighted === "function") {
          setIsBeingHighlighted(false);
        }
      }
    }, 0);
  }

  return (
    <div
      className="filling-content px-32"
      dangerouslySetInnerHTML={{ __html: highlightedHtml }}
    />
  );
};

import PropTypes from "prop-types";

FilingContent.propTypes = {
  content: PropTypes.string.isRequired,
  chunkHtml: PropTypes.string,
  isBeingHighlighted: PropTypes.bool,
  setIsBeingHighlighted: PropTypes.func,
};

export default FilingContent;
