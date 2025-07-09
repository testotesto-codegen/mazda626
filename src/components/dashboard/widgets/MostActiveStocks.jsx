/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  selectWidgetsByScreen,
  updateWidgetSize,
} from "../../../redux/slices/widgetSlice";
import { MdInfoOutline, MdArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { useGetActiveStocksQuery } from "../../../api/endpoints/widgetDataApi";
import WidgetConfiguration from "../WidgetConfiguration/WidgetConfiguration";
import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from "react-redux";
import TinyLineChart from "../charts/TinyLineChart";

const MostActiveStocksSize = {
  small: { width: "450", height: "290" },
  medium: { width: "550", height: "310" },
  large: { width: "650", height: "390" },
};

const MostActiveStocks = ({ widgetId, screen }) => {
  const { data, isLoading, isError, error } = useGetActiveStocksQuery();
  const [edit, setEdit] = useState(false);
  const [size, setSize] = useState("");
  const dispatch = useDispatch();
  const selectedWidgets = useSelector((state) =>
    selectWidgetsByScreen(state, screen),
  );
  const activeWidget = selectedWidgets?.find(
    (widget) => widget.id === widgetId,
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

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#2151C0",
  };

  return (
    <div
      className="rounded-xl bg-[#2D3133] dark:border-none border border-lightSilver"
      style={{ width: MostActiveStocksSize[size]?.width }}
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
            }  font-semibold text-[#D2DDE5] px-4 py-3 flex justify-between items-center bg-[#191B1D] rounded-t-xl `}
          >
            <h2>Most Active Stocks </h2>{" "}
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
          <div className="pb-2">
            {data?.map((item, i) => (
              <div
                key={i}
                className={`${
                  size === "small"
                    ? "py-3"
                    : size === "medium"
                      ? "py-3"
                      : "py-4"
                } px-4 flex justify-between items-center font-medium text-[#B5BCBF] ${i != 0 && "border-t"} border-[#3D4042]`}
              >
                <div
                  className={`flex flex-col gap-1  px-1 w-1/3 text-left ${
                    size === "small"
                      ? "text-xs"
                      : size === "medium"
                        ? "text-sm"
                        : "text-base"
                  }`}
                >
                  <span className="text-white break-words font-medium w-2/3">
                    {item?.name}
                  </span>
                  <span className="font-normal">{item?.symbol} </span>
                </div>

                <div className="w-1/3 flex justify-center">
                  <TinyLineChart
                    data={item?.chartData}
                    change={item?.percentChange}
                    size={size}
                  />
                </div>

                <div className="flex flex-col gap-1 font-normal text-right w-1/3 ">
                  <span
                    className={`text-white ${size === "small" ? "text-sm" : size === "medium" ? "text-base" : "text-lg"}`}
                  >
                    ${item?.price.toFixed(2)}
                  </span>
                  <span
                    className={`${Math.sign(item?.percentChange) === 1 ? "text-green-500" : "text-[#BB231B]"}   ${
                      size === "small"
                        ? "text-xs"
                        : size === "medium"
                          ? "text-sm"
                          : "text-base"
                    } flex items-center justify-end`}
                  >
                    {item?.percentChange.toFixed(2)}%
                    {Math.sign(item?.percentChange) === 1 ? (
                      <MdArrowDropUp size={20} />
                    ) : (
                      <MdArrowDropDown size={20} />
                    )}
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
export { MostActiveStocksSize };
export default MostActiveStocks;
