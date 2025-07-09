import React from "react";
import GridLayout from "react-grid-layout";
import ClipLoader from "react-spinners/ClipLoader";

import { useState, useEffect, lazy, Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MdAdd } from "react-icons/md";

import {
  addWidget,
  setWidgets,
  selectWidgetsByScreen,
  selectModalState,
  openModal,
  closeModal,
  selectStockModalState,
} from "@/redux/slices";
import {getWidgetDimensions} from "@/utils/WidgetCalculator"
import WidgetSelectorModal from "./WidgetSelectorModal";
import Welcome from "@/components/dashboard/welcome/Welcome";

import StockDetailModal from "../components/dashboard/StockDetailModal/StockDetailModal";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./widgets.css";

const ComponentMap = {
  GainerLoser: lazy(
    () => import("../components/dashboard/GainerLoser/GainerLoser"),
  ),
  FiftyTwoWeeklyStats: lazy(
    () =>
      import("../components/dashboard/FiftyTwoWeeklyStats/FiftyTwoWeeklyStats"),
  ),
  SingleStockChart: lazy(
    () => import("../components/dashboard/SingleStockChart/SingleStockChart"),
  ),
  ActiveStocks: lazy(
    () => import("../components/dashboard/ActiveStocks/ActiveStocks"),
  ),
  MarketChart: lazy(
    () => import("../components/dashboard/MarketChart/MarketChart"),
  ),
  Heatmap: lazy(
    () => import("../components/dashboard/widgets/Heatmap/HeatmapContainer"),
  ),
  FinancialTableFull: lazy(
    () => import("../components/dashboard/FinancialTable/FinancialTableFull"),
  ),
  SingleStockStackedChart: lazy(
    () =>
      import(
        "../components/dashboard/SingleStockStackedChart/SingleStockStackedChart"
      ),
  ),
  MostActiveStocks: lazy(
    () => import("../components/dashboard/widgets/MostActiveStocks"),
  ),
  NewsFeed: lazy(() => import("../components/dashboard/widgets/NewsFeed")),
  TodaysGainers: lazy(
    () => import("../components/dashboard/widgets/TodaysGainers"),
  ),
  Watchlist: lazy(() => import("../components/dashboard/widgets/Watchlist")),
  EarningsCalendar: lazy(
    () =>
      import(
        "../components/dashboard/widgets/EarningsCalendar/EarningsCalendar"
      ),
  ),
  Consensus: lazy(() => import("../components/dashboard/widgets/Consensus")),
  ETFs: lazy(() => import("../components/dashboard/widgets/Etfs")),
  StockCard: lazy(() => import("../components/dashboard/widgets/StockCard")),
  InsiderTransactions: lazy(
    () => import("../components/dashboard/widgets/InsiderTransactions"),
  ),
};

const WidgetsComponent = ({ screen }) => {
  const dispatch = useDispatch();
  const isModalOpen = useSelector(selectModalState);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWidgetSize, setSelectedWidgetSize] = useState({});
  const [isOverWhiteboard, setIsOverWhiteboard] = useState(false);
  const [selectedStock, setSelectedStock] = useState({});
  const [gridWidth, setGridWidth] = useState(Math.max(window.innerWidth, 1980));

  const isStockDetail = useSelector(selectStockModalState);
  const selectedWidgets = useSelector((state) =>
    selectWidgetsByScreen(state, screen),
  );

  // Load widgets data from local storage when component mounts
  useEffect(() => {
    const storedWidgets = loadWidgetsFromLocalStorage();
    if (storedWidgets.length > 0) {
      dispatch(setWidgets({ screen, widgets: storedWidgets }));
    }
    setIsLoading(false);
  }, [dispatch, screen]);

  // Save widgets data to local storage whenever it changes
  useEffect(() => {
    saveWidgetsToLocalStorage(selectedWidgets, screen);
  }, [selectedWidgets, screen]);

  // Save widgets data to local storage
  const saveWidgetsToLocalStorage = (widgets, screen) => {
    localStorage.setItem(`selectedWidgets_${screen}`, JSON.stringify(widgets));
  };

  // Load widgets data from local storage
  const loadWidgetsFromLocalStorage = () => {
    const storedWidgets = localStorage.getItem(`selectedWidgets_${screen}`);
    return storedWidgets ? JSON.parse(storedWidgets) : [];
  };

  const handleWhiteboardDrop = (e) => {
    e.preventDefault();
    setIsOverWhiteboard(false);

    const widgetId = e.dataTransfer.getData("widgetId");
    const widget = widgetSelectorData.find((widget) => widget.id === widgetId);

    if (widget && isOverWhiteboard) {
      handleWidgetDragStart(widget);
    }
    setSelectedWidgetSize(() => ({}));
    setSelectedStock(() => ({}));
  };

  const handleWhiteboardDragOver = (e) => {
    e.preventDefault();
    setIsOverWhiteboard(true);
  };

  const handleWhiteboardDragLeave = () => {
    setIsOverWhiteboard(false);
  };

  const handleWidgetDragStart = (widget) => {
    const newWidget = {
      ...widget,
      id: `${widget.id}-${Date.now()}`,
      size: selectedWidgetSize[widget.id],
      stock: selectedStock[widget.id],
    };
    dispatch(addWidget({ screen, widget: newWidget }));
    dispatch(closeModal());
  };

  const handleLayoutChange = (newLayout) => {
    dispatch(
      setWidgets({
        screen,
        widgets: selectedWidgets.filter((widget) => widget !== null && widget !== undefined).map((widget) => {
          const layout = newLayout.find(
            (layoutItem) => layoutItem.i === widget.id,
          );
          return {
            ...widget,
            x: layout.x,
            y: layout.y,
            w: layout.w,
            h: layout.h,
          };
        }),
      }),
    );
  };


  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#1F2023]">
          <ClipLoader
            color="#fff"
            loading={isLoading}
            cssOverride={{
              display: "block",
              margin: "0 auto",
              borderColor: "#813CF0",
            }}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : selectedWidgets.length === 0 && !isModalOpen ? (
        <Welcome />
      ) : (
        <div className="min-h-screen flex flex-col pl-10 no-select">
          <button
            className="fixed bottom-4 right-5 flex items-center justify-center bg-dashboardBlue w-16 h-16 rounded-full text-3xl text-white font-semibold cursor-pointer shadow-lg z-50"
            onClick={() => dispatch(openModal())}
          >
            <MdAdd />
          </button>
          <div
            className={`min-h-screen p-4 no-select ${isOverWhiteboard ? "custom-drag-over-bg" : "bg-[#121416]"}`}
            onDrop={handleWhiteboardDrop}
            onDragOver={handleWhiteboardDragOver}
            onDragLeave={handleWhiteboardDragLeave}
          >
            <GridLayout
              className="layout no-select"
              layout={selectedWidgets
                .map((widget) => getWidgetDimensions(widget, gridWidth))}
              cols={12}
              isResizable={false}
              rowHeight={20}
							width={gridWidth}
              onLayoutChange={handleLayoutChange}
            >
              {selectedWidgets
                .filter((widget) => widget !== null && widget !== undefined)
                .map((widget) => {
                  return (
                    <div
                      key={widget.id}
                      className="w-full h-full widget p-1 rounded-md relative no-select"
                    >
                      <div className="drag-handle absolute inset-0 cursor-move pointer-events-none"></div>
                      <Suspense fallback={<></>}>
                        {ComponentMap[widget.content] &&
                          React.createElement(ComponentMap[widget.content], {
                            widgetId: widget.id,
                            screen: screen,
                          })}
                      </Suspense>
                    </div>
                  );
                })}
            </GridLayout>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="select-none bg-[#1D2022] h-[400px] w-[600px] fixed top-1/2 bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 right-0 overflow-y-scroll rounded-xl shadow-xl z-50 no-select">
          <WidgetSelectorModal screen={screen} />
        </div>
      )}
      {isStockDetail && <StockDetailModal />}
    </>
  );
};

export default WidgetsComponent;
