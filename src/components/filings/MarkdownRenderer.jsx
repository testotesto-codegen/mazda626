import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Utility to replace [citation:chunk_xxx] with <sup> tags and collect mapping
function processCitations(content) {
  const citationRegex = /\[citation:([^\]]+)\]/g;
  let citationMap = {};
  let citationOrder = [];
  let citationCounter = 1;

  // Replace citations with <sup> and build map
  const replaced = content.replace(citationRegex, (match, chunkId) => {
    if (!(chunkId in citationMap)) {
      citationMap[chunkId] = citationCounter++;
      citationOrder.push(chunkId);
    }
    const number = citationMap[chunkId];
    // Output a sup tag with Tailwind classes and a data attribute
    return `<sup data-citation="${chunkId}" class="text-blue-600 underline cursor-pointer select-none text-sm">[${number}]</sup>`;
  });

  return {
    content: replaced,
    citationMap,
    citationOrder,
  };
}

const MarkdownRenderer = ({ content, handleAnnotationClick, references }) => {
  // Preprocess content to replace citations and build mapping
  const { content: processedContent } = processCitations(content);

  // Event delegation for citation clicks
  const handleClick = (e) => {
    const sup = e.target.closest("sup[data-citation]");
    if (sup && handleAnnotationClick) {
      handleAnnotationClick(sup.getAttribute("data-citation"), references);
    }
  };

  return (
    <div className="markdown-content" onClick={handleClick}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" />
          ),
          p: ({ ...props }) => <p {...props} className="mb-2" />,
          code: ({ inline, ...props }) =>
            inline ? (
              <code {...props} className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" />
            ) : (
              <code {...props} className="block bg-gray-100 p-2 my-2 rounded text-sm font-mono overflow-x-auto" />
            ),
          pre: (props) => (
            <pre {...props} className="bg-gray-100 p-3 my-3 rounded overflow-x-auto" />
          ),
          h1: (props) => <h1 {...props} className="text-xl font-bold mt-3 mb-2" />,
          h2: (props) => <h2 {...props} className="text-lg font-bold mt-3 mb-2" />,
          h3: (props) => <h3 {...props} className="text-md font-bold mt-2 mb-1" />,
          ul: (props) => <ul {...props} className="list-disc pl-5 mb-3" />,
          ol: (props) => <ol {...props} className="list-decimal pl-5 mb-3" />,
          li: (props) => <li {...props} className="mb-1" />,
          blockquote: (props) => (
            <blockquote {...props} className="border-l-4 border-gray-300 pl-3 italic my-2" />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
