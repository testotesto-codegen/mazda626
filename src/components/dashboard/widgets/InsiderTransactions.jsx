import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWidgetsByScreen,
  updateWidgetSize,
} from "../../../redux/slices/widgetSlice";
import { MdInfoOutline, MdSearch } from "react-icons/md";
import { useGetInsiderTransactionsQuery } from "../../../api/endpoints/widgetDataApi";
import WidgetConfiguration from "../WidgetConfiguration/WidgetConfiguration";
import ClipLoader from "react-spinners/ClipLoader";

const InsiderTransactionsSize = {
  small: { width: "900", height: "230" },
  medium: { width: "1050", height: "250" },
  large: { width: "1350", height: "300" },
};

const InsiderTransactions = ({ widgetId, screen }) => {
  const [edit, setEdit] = useState(false);
  const [size, setSize] = useState("");
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("ticker"); // 'ticker' or 'person'
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const selectedWidgets = useSelector((state) =>
    selectWidgetsByScreen(state, screen),
  );
  const activeWidget = selectedWidgets?.find(
    (widget) => widget.id === widgetId,
  );

  // Always fetch latest transactions if no search, otherwise fetch search results
  const { data, isLoading, isError, error, refetch } =
    useGetInsiderTransactionsQuery(
      search ? { search, type: searchType } : {}, // If no search, fetch latest
      { skip: false },
    );

  useEffect(() => {
    if (activeWidget?.size) {
      setSize(activeWidget.size);
    } else {
      setSize("small");
    }
  }, [setSize, activeWidget?.size]);

  const handleSaveBtnClick = () => {
    setEdit(false);
    dispatch(updateWidgetSize({ screen, widgetId, size }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(input.trim());
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#2151C0",
  };

  return (
    <div
      className="rounded-xl bg-[#2D3133] dark:border-none border border-lightSilver"
      style={{ width: InsiderTransactionsSize[size]?.width }}
    >
      {isLoading ? (
        <div className="h-full flex items-center justify-center bg-[#1F2023]">
          <ClipLoader
            color="#fff"
            loading={isLoading}
            cssOverride={override}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : edit ? (
        <WidgetConfiguration
          size={size}
          setSize={setSize}
          isResizable={true}
          edit={edit}
          setEdit={setEdit}
          isInputBased={false}
          screen={screen}
          widgetId={widgetId}
          handleSaveBtnClick={handleSaveBtnClick}
        />
      ) : (
        <>
          <div
            className={`${
              size === "small"
                ? "text-sm"
                : size === "medium"
                  ? "text-base"
                  : "text-xl"
            } font-semibold text-[#D2DDE5] px-4 py-3 flex justify-between items-center bg-[#191B1D] rounded-t-xl`}
          >
            <h2>Insider Transactions</h2>
            <div
              className="cursor-pointer text-xl text-[#D2DDE5] relative z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEdit(!edit);
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <MdInfoOutline size={20} />
            </div>
          </div>
          <form
            className="flex items-center gap-2 px-4 py-2 bg-[#232527]"
            onSubmit={handleSearch}
          >
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="rounded bg-[#232527] border border-[#3D4042] text-[#D2DDE5] px-2 py-1 text-xs focus:outline-none"
            >
              <option value="ticker">Ticker</option>
              <option value="person">Person</option>
            </select>
            <input
              type="text"
              placeholder={`Search by ${searchType}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded bg-[#232527] border border-[#3D4042] text-[#D2DDE5] px-2 py-1 text-xs focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#2151C0] hover:bg-[#173a85] text-white px-2 py-1 rounded flex items-center"
            >
              <MdSearch size={18} />
            </button>
          </form>
          <div className="pb-2">
            {isError && (
              <div className="text-red-500 px-4 py-2">
                Error:{" "}
                {error?.data?.message ||
                  "Failed to fetch insider transactions."}
              </div>
            )}
            {!isLoading &&
              !isError &&
              Array.isArray(data) &&
              data.length === 0 && (
                <div className="text-[#B5BCBF] px-4 py-4 text-center">
                  No insider transactions found.
                </div>
              )}
            {/* Table header */}
            <div
              className={`px-4 py-2 font-semibold text-[#B5BCBF] flex justify-between items-center border-b border-[#3D4042] ${size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"}`}
            >
              <div className="w-1/6 text-left">Ticker</div>
              <div className="w-1/4 text-left">Company</div>
              <div className="w-1/6 text-left">Person</div>
              <div className="w-1/6 text-center">Date</div>
              <div className="w-1/12 text-right">Shares</div>
              <div className="w-1/12 text-right">Price</div>
              <div className="w-1/6 text-right">Value</div>
            </div>
            {Array.isArray(data) &&
              data.map((item, i) => (
                <div
                  key={i}
                  className={`${
                    size === "small"
                      ? "py-3"
                      : size === "medium"
                        ? "py-3"
                        : "py-4"
                  } px-4 flex justify-between items-center font-medium text-[#B5BCBF] ${i !== 0 && "border-t"} border-[#3D4042]`}
                >
                  <div
                    className={`w-1/6 text-left ${size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"}`}
                  >
                    <span className="text-white font-medium">
                      {item?.ticker || "-"}
                    </span>
                  </div>
                  <div
                    className={`w-1/4 text-left truncate ${size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"}`}
                  >
                    <span>{item?.companyName || "-"}</span>
                  </div>
                  <div
                    className={`w-1/6 text-left truncate ${size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"}`}
                  >
                    <span>{item?.person || "-"}</span>
                  </div>
                  <div
                    className={`w-1/6 text-center ${size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"}`}
                  >
                    <span>{item?.date || "-"}</span>
                  </div>
                  <div
                    className={`w-1/12 text-right ${size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"}`}
                  >
                    <span
                      className={`${item?.shares > 0 ? "text-green-500" : "text-[#BB231B]"}`}
                    >
                      {item?.shares?.toLocaleString() ?? "-"}
                    </span>
                  </div>
                  <div
                    className={`w-1/12 text-right ${size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"}`}
                  >
                    <span>
                      $
                      {item?.sharePrice?.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) ?? "-"}
                    </span>
                  </div>
                  <div
                    className={`w-1/6 text-right ${size === "small" ? "text-xs" : size === "medium" ? "text-sm" : "text-base"}`}
                  >
                    <span className="text-white">
                      ${item?.value?.toLocaleString() ?? "-"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export { InsiderTransactionsSize };
export default InsiderTransactions;
