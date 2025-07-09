import { TodaysGainersSize } from "@/components/dashboard/widgets/TodaysGainers";
import { StockCardSize } from "@/components/dashboard/widgets/StockCard";
import { MostActiveStocksSize } from "@/components/dashboard/widgets/MostActiveStocks";
import { InsiderTransactionsSize } from "@/components/dashboard/widgets/InsiderTransactions";

const getComponentSize = (widget) => {
  switch (widget.content) {
    case "TodaysGainers":
      return TodaysGainersSize[widget.size] || TodaysGainersSize.small;
    case "StockCard":
      return StockCardSize[widget.size] || StockCardSize.small;
    case "MostActiveStocks":
      return MostActiveStocksSize[widget.size] || MostActiveStocksSize.small;
    case "InsiderTransactions":
      return (
        InsiderTransactionsSize[widget.size] || InsiderTransactionsSize.small
      );
    default:
      return { width: "320", height: "250" }; // Default size
  }
};

export const getWidgetDimensions = (widget, gridWidth) => {
  const size = widget.size || "small";

  // Extract width and height from Sizes.js
  const sizeConfig = getComponentSize(widget);
  const pixelWidth = parseInt(sizeConfig?.width);
  let pixelHeight = parseInt(sizeConfig?.height || 250);

  // Calculate grid units
  const columnWidth = gridWidth / 12;
  const rowHeight = 20;

  // Convert pixel dimensions to grid units
  const w = Math.round(pixelWidth / columnWidth);
  let h = Math.round(pixelHeight / rowHeight);

  return {
    x: widget.x || 0,
    y: widget.y || 0,
    w: w,
    h: h,
    i: widget.id,
  };
};
