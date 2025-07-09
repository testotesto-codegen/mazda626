import { MdInfoOutline } from "react-icons/md";
import { useGetWatchlistQuery } from "../../../api/endpoints/widgetDataApi";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import WidgetConfiguration from "../WidgetConfiguration/WidgetConfiguration";
import ClipLoader from "react-spinners/ClipLoader";
import {
  updateWidgetSize,
  selectWidgetsByScreen,
} from "../../../redux/slices/widgetSlice";
import { useSelector } from "react-redux";

// eslint-disable-next-line react/prop-types
const WatchlistSize = {
  small: { width: "350px", height: "270px" },
  medium: { width: "520px", height: "270px" },
  large: { width: "590px", height: "270px" },
};

const Watchlist = ({ widgetId, screen }) => {
  const [input, setInput] = useState(null);
  const [fetch, setFetch] = useState(false);
  // const [watchlistType, setWatchlistType] = useState(null);
  // const [customFetch, setCustomFetch] = useState(false);
  // const [prebuiltFetch, setPrebuiltFetch] = useState(false);
  const [customWatchlist, setCustomWatchlist] = useState("");
  const [size, setSize] = useState("small");
  const [edit, setEdit] = useState(true);
  const dispatch = useDispatch();
  const selectedWidgets = useSelector((state) =>
    selectWidgetsByScreen(state, screen),
  );
  const activeWidget = selectedWidgets?.find(
    (widget) => widget.id === widgetId,
  );

  const { data, isFetching, isError } = useGetWatchlistQuery(customWatchlist, {
    skip: !fetch,
  });

  useEffect(() => {
    if (activeWidget?.size) {
      setSize(activeWidget.size);
    } else {
      setSize("small");
    }
  }, [setSize, activeWidget?.size]);

  useEffect(() => {
    if (data !== undefined) {
      setFetch(false);
      setCustomWatchlist("");
      setInput("");
      dispatch(updateWidgetSize({ screen, widgetId, size, data }));
    }
  }, [data, dispatch, screen, size, widgetId]);

  const handleSaveBtnClick = () => {
    setCustomWatchlist(input);
    setFetch(true);
    setEdit(false);
    dispatch(updateWidgetSize({ screen, widgetId, size }));
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#2151C0",
  };

  const headings = [
    { id: 1, title: "Symbol" },
    { id: 2, title: "Company Name" },
    { id: 3, title: "Last Price" },
    { id: 4, title: "Change" },
    { id: 5, title: "% Change" },
    { id: 6, title: "Market Time" },
    { id: 7, title: "Volume" },
    { id: 9, title: "Market Cap" },
  ];

  return (
    <div
      className={`bg-[#2D3133] dark:border-none rounded-xl border border-lightSilver shadow-md ${
        size === "small"
          ? " w-[1050px]"
          : size === "medium"
            ? " w-[1150px]"
            : size === "large"
              ? " w-[1250px]"
              : ""
      } pb-2 `}
    >
      {isFetching ? (
        <div className="h-full flex items-center justify-center bg-[#1F2023]">
          <ClipLoader
            color="#fff"
            loading={isFetching}
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
          setInput={setInput}
          input={input}
          isWatchlist={true}
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
            }  font-semibold text-[#D2DDE5] px-4 py-3 flex justify-between items-center bg-[#191B1D] rounded-t-xl `}
          >
            <h2>Watchlist</h2>{" "}
            <MdInfoOutline
              onClick={() => setEdit(!edit)}
              size={20}
              className="cursor-pointer text-xl text-[#D2DDE5]"
            />
          </div>
          <div
            className={`${
              size === "small"
                ? "text-xs py-2"
                : size === "medium"
                  ? "text-sm py-3"
                  : size === "large"
                    ? "text-base py-4"
                    : ""
            }   custom-stripe  px-3 flex justify-between text-left items-center bg-[#191B1D] font-semibold text-[#667177]`}
          >
            {headings.map((heading) => (
              <span
                key={heading.id}
                className={`${heading.title === "Company Name" ? "w-[20%] text-left" : "w-[10%]"}`}
              >
                {heading.title}
              </span>
            ))}
          </div>
          <div className="watchlist-wrapper ">
            {data?.map((item, i) => (
              <div
                key={i}
                className={`flex justify-between px-3 text-center ${
                  size === "small"
                    ? "text-xs py-2"
                    : size === "medium"
                      ? "text-sm py-3"
                      : size === "large"
                        ? "text-base py-4"
                        : ""
                }`}
              >
                {Object.keys(item).map((key, i) => (
                  <span
                    key={i}
                    className={`text-left ${key === "name" ? "w-[20%] pr-4" : "w-[10%]"} ${key === "symbol" && "text-[#37CAA8]"} ${
                      key === "change" || key === "percentChange"
                        ? Math.sign(item[key]) === 1
                          ? "text-[#37CAA8]"
                          : "text-red-600"
                        : key !== "symbol"
                          ? "text-[#B5BCBF]"
                          : ""
                    }

                                        `}
                  >
                    {item[key]}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Watchlist;

/*
<div className="flex justify-between px-3 text-center">
							<span className="border border-green-600 w-[10%]">AAPL</span>
							<span className="border border-green-600 w-[20%]">Apple Inc Apple aplle pllelkas.</span>
							<span className="border border-green-600 w-[10%]">148.56</span>
							<span className="border border-green-600 w-[10%]">+0.56</span>
							<span className="border border-green-600 w-[10%]">+0.38%</span>
							<span className="border border-green-600 w-[10%]">4:00 PM</span>
							<span className="border border-green-600 w-[10%]">1.48M</span>
							<span className="border border-green-600 w-[10%]">1.48M</span>
							<span className="border border-green-600 w-[10%]">$2.5T</span>
						</div>

*/
