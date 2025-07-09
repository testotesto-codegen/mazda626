/* eslint-disable react/prop-types */
import Switch from "react-switch";
import ClipLoader from "react-spinners/ClipLoader";
import { useState, useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { Link } from "react-router-dom";
import {
  MdInfoOutline,
  MdArrowForward,
  MdSouthEast,
  MdCallMade,
} from "react-icons/md";

import {
  selectWidgetsByScreen,
  updateWidgetData,
} from "@/redux/slices";
import WidgetConfiguration from "../WidgetConfiguration/WidgetConfiguration";
import { useGetStockCardQuery } from "../../../api/endpoints/widgetDataApi";


const StockCardSize = {
  small: {
    width: "350",
    height: "253",
  },
  medium: {
    width: "320",
    height: "200",
  },
  large: {
    width: "430",
    height: "200",
  },
};


const StockCard = ({ widgetId, screen }) => {
  const [input, setInput] = useState("");
  const [edit, setEdit] = useState(false);
  const [size, setSize] = useState("small");
  const [checked, setChecked] = useState(false);
  const [stockData, setStockData] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const dispatch = useDispatch();
  const selectedWidgets = useSelector((state) =>
    selectWidgetsByScreen(state, screen),
  );
  const activeWidget = selectedWidgets?.find(
    (widget) => widget.id === widgetId,
  );

  // Query will run when input changes and not in edit mode
  const { data, isFetching, isError } = useGetStockCardQuery(input, {
    skip: !input || edit || !isInitialized,
    refetchOnMountOrArgChange: true,
  });

  // Initialize from saved data
  useEffect(() => {
    if (activeWidget?.data && !isInitialized) {
      const savedData = activeWidget.data;
      if (savedData.ticker) {
        setInput(savedData.ticker);
      }
      if (savedData.stockData) {
        setStockData(savedData.stockData);
      }
      if (savedData.size) {
        setSize(savedData.size);
      }
      setIsInitialized(true);
    } else if (!activeWidget?.data && !isInitialized) {
      setIsInitialized(true);
    }
  }, [activeWidget?.data, isInitialized]);

  // Handle API response
  useEffect(() => {
    if (data && !edit && isInitialized) {
      setStockData(data);
      // Save both the ticker and the fetched data
      dispatch(
        updateWidgetData({
          screen,
          widgetId,
          data: {
            ticker: input,
            stockData: data,
            size: size,
          },
        }),
      );
    }
  }, [data, dispatch, screen, widgetId, input, size, edit, isInitialized]);

  const handleSaveBtnClick = () => {
    if (!input) return;

    // Save the configuration immediately
    const currentData = {
      ticker: input,
      stockData: stockData,
      size: size,
    };

    dispatch(
      updateWidgetData({
        screen,
        widgetId,
        data: currentData,
      }),
    );

    setEdit(false);
    setIsInitialized(true); // Ensure we're initialized after manual save
  };

  const handleEditClick = () => {
    setEdit(true);
  };

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#2151C0",
  };

  return (
    <>
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
      ) : isError ? (
        <div className="h-full flex items-center justify-center bg-[#1F2023] text-red-500">
          Error loading stock data. Please try again.
        </div>
      ) : edit ? (
        <WidgetConfiguration
          size={size}
          setSize={setSize}
          isResizable={true}
          edit={edit}
          setEdit={setEdit}
          isInputBased={true}
          input={input}
          setInput={setInput}
          screen={screen}
          widgetId={widgetId}
          handleSaveBtnClick={handleSaveBtnClick}
        />
      ) : (
        <div className={`w-[${StockCardSize[size].width}px] h-[${StockCardSize[size].height}px] rounded-xl bg-[#232729]`}>
          <div className="flex text-sm py-3 px-4 gap-2 bg-[#191B1D] rounded-t-xl">
            <span className="text-[#D2DDE5] font-semibold">
              {stockData?.symbol}
            </span>
            <span className="text-[#9EA7AE] font-normal">
              {stockData?.name}
            </span>
            <MdInfoOutline
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              size={20}
              className="ml-auto text-[#D2DDE5] cursor-pointer relative z-20"
            />
          </div>
          <div className="drag-handle flex flex-col bg-[#232729] p-4 gap-3">
            <span className="text-[#9EA7AE] text-xs">
              Updated: {stockData?.updatedAt}
            </span>
            <h2 className="text-[#D2DDE5] text-3xl font-semibold mt-3">
              {stockData?.price} USD
            </h2>
            <div className="flex gap-1 text-sm">
              <span className="text-[#9EA7AE]">{stockData?.change}</span>
              <span
                className={`${stockData?.changeType === "positive" ? "text-[#37CAA8]" : "text-[#BB231B]"}`}
              >
                ({stockData?.percentChange}%)
              </span>
              {stockData?.changeType === "positive" ? (
                <MdCallMade size={20} className="text-[#37CAA8]" />
              ) : (
                <MdSouthEast size={20} className="text-[#BB231B]" />
              )}
            </div>
          </div>
          <div
            className="w-11/12 mx-auto bg-[#232729] border-t border-[#2D3133] flex justify-between items-center py-3 rounded-b"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <span
              className="text-[#B3B3B3] font-medium text-xs flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Switch
                onChange={(checked) => setChecked(checked)}
                checked={checked}
                checkedIcon={false}
                uncheckedIcon={false}
                height={14}
                width={28}
                handleDiameter={16}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
              Notifications
            </span>
            <Link
              to={`/dashboard/chart?ticker=${stockData?.symbol}`}
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <span className="py-3 px-4 rounded-full bg-[#191B1D] text-xs flex items-center gap-2 text-[#808080]">
                Advance Chart <MdArrowForward size={20} />{" "}
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};


export { StockCardSize };
export default StockCard;
