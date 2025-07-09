import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  MdClose,
  MdPersonOutline,
  MdShowChart,
  MdTrendingUp,
} from "react-icons/md";
import { FaSearch, FaPlus, FaBars } from "react-icons/fa";

import { closeModal, addWidget } from "@/redux/slices";
import { StockCardSize } from "@/components/dashboard/widgets/StockCard";
import { MostActiveStocksSize } from "@/components/dashboard/widgets/MostActiveStocks";
import { InsiderTransactionsSize } from "@/components/dashboard/widgets/InsiderTransactions";
import { TodaysGainersSize } from "@/components/dashboard/widgets/TodaysGainers";

const leftSidebarOptions = [
  {
    name: "Screeners",
    icon: <div className="w-4 h-4 rounded-md border border-2" />,
  },
  {
    name: "Graphs",
    icon: <FaPlus />,
  },
  {
    name: "Insider",
    icon: <MdPersonOutline />,
  },
  {
    name: "Lists",
    icon: <FaBars />,
  },
];

const topSidebarOptions = [
  {
    name: "Popular",
    id: "popular",
  },
  {
    name: "Personal",
    id: "personal",
  },
  {
    name: "Recent",
    id: "recent",
  },
];

const availableWidgets = [
  {
    name: "Stock Card",
    icon: <MdShowChart size={24} />,
    type: "popular",
    category: "screeners",
  },
  {
    name: "Most Active Stocks",
    icon: <MdShowChart size={24} />,
    type: "popular",
    category: "screeners",
  },
  {
    name: "Today's Gainers",
    icon: <MdTrendingUp size={24} />,
    type: "popular",
    category: "screeners",
  },
  {
    name: "Insider Transactions",
    icon: <MdPersonOutline size={24} />,
    type: "popular",
    category: "insider",
  },
  {
    name: "Stock Graph",
    icon: <MdShowChart size={24} />,
    type: "popular",
    category: "graphs",
  },
];

const WidgetSelectorModal = ({ screen }) => {
  const dispatch = useDispatch();
  const [selectedTopItem, setSelectedTopItem] = useState("popular");
  const [selectedLeftItem, setSelectedLeftItem] = useState("Screeners");

  const setTopItem = (e) => {
    setSelectedTopItem(e);
  };

  const setLeftItem = (e) => {
    setSelectedLeftItem(e);
  };

  const handleWidgetClick = (widget) => {
    let widgetId, newWidget;

    if (widget.name === "Stock Card") {
      widgetId = `widget-stock-card-${Date.now()}`;
      newWidget = {
        id: widgetId,
        screen: screen,
        content: "StockCard",
        isResizable: true,
        sizeConfig: StockCardSize,
        isStockBased: true,
        dimensions: {
          small: { w: 1.9, h: 2.9 },
          medium: { w: 2.2, h: 3.5 },
          large: { w: 2.4, h: 3.9 },
        },
      };
    } else if (widget.name === "Most Active Stocks") {
      widgetId = `widget-most-active-stocks-${Date.now()}`;
      newWidget = {
        id: widgetId,
        screen: screen,
        content: "MostActiveStocks",
        isResizable: true,
        isStockBased: false,
        sizeConfig: MostActiveStocksSize,
        dimensions: {
          small: { w: 2.8, h: 3.5 },
          medium: { w: 3.4, h: 3.8 },
          large: { w: 4.0, h: 4.1 },
        },
      };
    } else if (widget.name === "Today's Gainers") {
      widgetId = `widget-todays-gainers-${Date.now()}`;
      newWidget = {
        id: widgetId,
        screen: screen,
        content: "TodaysGainers",
        isResizable: true,
        sizeConfig: TodaysGainersSize,
        isStockBased: false,
        dimensions: {
          small: { w: 2.8, h: 3.5 },
          medium: { w: 3.4, h: 3.8 },
          large: { w: 4.0, h: 4.1 },
        },
      };
    } else if (widget.name === "Insider Transactions") {
      widgetId = `widget-insider-transactions-${Date.now()}`;
      newWidget = {
        id: widgetId,
        screen: screen,
        content: "InsiderTransactions",
        isResizable: true,
        sizeConfig: InsiderTransactionsSize,
        isStockBased: false,
        dimensions: {
          small: { w: 2.8, h: 3.5 },
          medium: { w: 3.4, h: 3.8 },
          large: { w: 4.0, h: 4.1 },
        },
      };
    }

    dispatch(addWidget({ screen, widget: newWidget }));
    dispatch(closeModal());
  };

  return (
    <div className="no-select">
      <div className="flex border-b border-1 border-[#747474] p-4">
        <div className="text-white">Select a Widget</div>
        <div className="ml-auto">
          <button
            className=" bg-red-500 text-white p-1 rounded-full flex items-center justify-center hover:bg-red-600"
            onClick={() => dispatch(closeModal())}
          >
            <MdClose size={20} />
          </button>
        </div>
      </div>
      <div className="flex items-center border-b border-1 border-[#747474] p-1">
        <FaSearch className="text-[#747474] ml-2" />
        <input
          placeholder="Search"
          className="text-white bg-[#1D2022] w-full focus:outline-none p-2 ps-4"
        />
      </div>
      <div className="flex text-white h-[290px]">
        <div className="w-1/4 border-r border-1 border-[#747474] pt-2 no-select">
          {leftSidebarOptions.map((elem) => {
            return (
              <div
                key={`sidebar ${elem.name}`}
                className={`hover:bg-[#747474] px-2 mt-2 flex items-center no-select cursor-pointer ${
                  selectedLeftItem === elem.name ? "bg-[#747474]" : ""
                }`}
                onClick={() => setLeftItem(elem.name)}
              >
                <div className="p-2">{elem.icon}</div>
                <div>{elem.name}</div>
              </div>
            );
          })}
        </div>
        <div className="w-3/4 ml-2 mt-2 p-2 no-select">
          <div className="flex">
            {topSidebarOptions.map((elem) => {
              return (
                <button
                  key={`topbar ${elem.name}`}
                  className={`mr-4 no-select w-[100px] text-center px-2 py-1 rounded-full text-xs transition-colors duration-150
                                      ${
                                        selectedTopItem === elem.id
                                          ? "bg-white text-black font-semibold shadow"
                                          : "bg-[#23272a] text-[#D2DDE5] hover:bg-white hover:text-black border border-transparent hover:border-[#747474]"
                                      }`}
                  onClick={() => setTopItem(elem.id)}
                  aria-pressed={selectedTopItem === elem.id}
                >
                  {elem.name}
                </button>
              );
            })}
          </div>
          <div className="mt-4 ml-2 grid grid-cols-3 gap-4">
            {availableWidgets
              .filter(
                (widget) =>
                  widget.type === selectedTopItem &&
                  widget.category.toLowerCase() ===
                    selectedLeftItem.toLowerCase(),
              )
              .map((widget) => (
                <div
                  key={widget.name}
                  className="bg-[#2D3133] hover:bg-[#3D4143] p-4 rounded-lg cursor-pointer flex flex-col items-center justify-center no-select"
                  draggable={true}
                  onDragStart={(e) => {
                    e.dataTransfer.setData(
                      "widgetId",
                      `widget-${widget.name.toLowerCase().replace(/\s+/g, "-")}`,
                    );
                  }}
                  onClick={() => handleWidgetClick(widget)}
                >
                  <div className="text-[#D2DDE5] mb-2">{widget.icon}</div>
                  <h3 className="text-sm font-medium text-[#D2DDE5]">
                    {widget.name}
                  </h3>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetSelectorModal;
