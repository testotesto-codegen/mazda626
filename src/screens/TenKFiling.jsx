import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  MdOutlineViewList,
  MdOutlineOpenInNew,
  MdOutlineChat,
} from "react-icons/md";

import { FallbackSpinner } from "@/components/common";
import { TableOfContents, FilingChat } from "@/components/filings";
import FilingContent from "@/components/filings/FilingContent";
import { useState } from "react";

import {
  useGetAllFilingsQuery,
  useGetContentByAccesionNumberQuery,
} from "@/api/endpoints";
import {
  selectActiveSessionData,
  updateActiveSessionData,
} from "@/redux/slices";
import { useTickerSession } from "@/hooks";

const TenKFiling = () => {
  const dispatch = useDispatch();
  const [isBeingHighlighted, setIsBeingHighlighted] = useState(false);
  const [highlightedChunkHtml, setHighlightedChunkHtml] = useState(null);
  const isChatOpen =
    useSelector((state) => selectActiveSessionData(state, "chat.isOpen")) ||
    false;
  const isTableOfContentsOpen =
    useSelector((state) => selectActiveSessionData(state, "toc.isOpen")) ||
    false;
  const selectedFiling =
    useSelector((state) =>
      selectActiveSessionData(state, "filing.selectedFiling"),
    ) || undefined;

  const { activeTicker } = useTickerSession({
    redirectToDashboard: true,
    updateDocumentTitle: true,
    titlePrefix: "accelno | Files",
  });

  const { data: filingData, isFetching: isLoadingFilingData } =
    useGetAllFilingsQuery(
      {
        ticker: activeTicker,
        filter: ["10-K", "10-Q"],
      },
      {
        skip: !activeTicker,
        refetchOnMountOrArgChange: true,
      },
    );

  const { data: fillingContentData, isFetching: isLoadingFillingContentData } =
    useGetContentByAccesionNumberQuery(
      {
        ticker: activeTicker,
        accession_number: selectedFiling?.accession_number,
      },
      {
        skip: !selectedFiling?.accession_number,
        refetchOnMountOrArgChange: true,
      },
    );

  const getMiddleWidth = () => {
    if (isChatOpen && isTableOfContentsOpen) return "w-1/2";
    if (isChatOpen || isTableOfContentsOpen) return "w-2/3";
    return "w-full";
  };

  if (!selectedFiling && !isLoadingFilingData && filingData.latest10K) {
    dispatch(
      updateActiveSessionData({
        dataPath: "filing.selectedFiling",
        value: filingData.latest10K,
      }),
    );
    return <FallbackSpinner />;
  }

  const handleReferenceClick = (citation, references) => {
    console.log(references);
    console.log(citation)
    const matchedReference = references.find(ref => ref.citation === citation);
    if (matchedReference) {
      setHighlightedChunkHtml(matchedReference.chunk_value?.html);
      setIsBeingHighlighted(true);
    }
  };

  if (isLoadingFilingData || !filingData) {
    return <FallbackSpinner />;
  }

  return (
    <div className="bg-[#1D2022] text-white p-6 min-h-screen flex flex-col h-screen">
      {/* Header section */}
      <TenKFilingHeader
        activeTicker={activeTicker}
        selectedFiling={selectedFiling}
        isChatOpen={isChatOpen}
        isTableOfContentsOpen={isTableOfContentsOpen}
      />

      {/* Main content area */}
      <div
        className="flex flex-grow h-full relative"
        style={{ height: "calc(100vh - 120px)" }}
      >
        {isTableOfContentsOpen && (
          <div className="w-1/3 bg-[#121416] rounded-lg shadow-lg overflow-auto transition-all duration-300">
            <TableOfContents data={filingData?.filings} />
          </div>
        )}

        {/* Middle Panel - Always visible */}
        <div
          className={`filing-container bg-white rounded-lg shadow-lg overflow-auto ${getMiddleWidth()}`}
        >
          {isLoadingFillingContentData ? (
            <div className="flex items-center justify-center h-full">
              <FallbackSpinner bgColor="white" />
            </div>
          ) : fillingContentData?.content ? (
            <FilingContent
              content={fillingContentData.content}
              chunkHtml={highlightedChunkHtml}
              isBeingHighlighted={isBeingHighlighted}
              setIsBeingHighlighted={setIsBeingHighlighted}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No filing content available</p>
            </div>
          )}
        </div>

        {/* Right Panel - Chat */}
        {isChatOpen && (
          <div className="w-1/3  rounded-lg shadow-lg overflow-auto transition-all duration-300">
            <FilingChat
              data={selectedFiling}
              isChatOpen={isChatOpen}
              handleReferenceClick={handleReferenceClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const TenKFilingHeader = ({
  selectedFiling,
  activeTicker,
  isChatOpen,
  isTableOfContentsOpen,
}) => {
  const dispatch = useDispatch();

  const toggleChat = () => {
    dispatch(
      updateActiveSessionData({
        dataPath: "chat.isOpen",
        value: !isChatOpen,
      }),
    );
  };

  const toggleTableOfContents = () => {
    dispatch(
      updateActiveSessionData({
        dataPath: "toc.isOpen",
        value: !isTableOfContentsOpen,
      }),
    );
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => toggleTableOfContents()}
        className={`bg-[#2A2B2D] p-2 rounded-lg hover:bg-[#393A3D] transition-colors ${
          isTableOfContentsOpen ? "bg-[#40FED1] text-[#121416]" : ""
        }`}
        title="Toggle Table of Contents"
      >
        <MdOutlineViewList size={20} />
      </button>

      <h1 className="text-2xl font-bold">
        {selectedFiling.form_type} Filing: {activeTicker}
      </h1>

      <div className="flex gap-2">
        <button
          onClick={() => window.open(selectedFiling.url, "_blank")}
          className="bg-[#2A2B2D] p-2 rounded-lg hover:bg-[#393A3D] transition-colors"
          title="Open in new tab"
        >
          <MdOutlineOpenInNew size={20} />
        </button>
        <button
          onClick={() => toggleChat()}
          className={`bg-[#2A2B2D] p-2 rounded-lg hover:bg-[#393A3D] transition-colors ${
            isChatOpen ? "bg-[#40FED1] text-[#121416]" : ""
          }`}
          title="Chat with AI"
        >
          <MdOutlineChat size={20} />
        </button>
      </div>
    </div>
  );
};

TenKFilingHeader.propTypes = {
  activeTicker: PropTypes.string.isRequired,
  selectedFiling: PropTypes.object.isRequired,
  isChatOpen: PropTypes.bool.isRequired,
  isTableOfContentsOpen: PropTypes.bool.isRequired,
};

export default TenKFiling;
