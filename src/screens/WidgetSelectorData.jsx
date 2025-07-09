import { StockCardSize } from "@/components/dashboard/widgets/StockCard"
import { MostActiveStocksSize } from "@/components/dashboard/widgets/MostActiveStocks"
import { TodaysGainersSize } from "@/components/dashboard/widgets/TodaysGainers"
import { WatchlistSize } from "@/components/dashboard/widgets/Watchlist"
import { NewsFeedSize } from "@/components/dashboard/widgets/NewsFeed"
import { ConsensusSize } from "@/components/dashboard/widgets/Consensus"
import { EarningsCalendarSize } from "@/components/dashboard/widgets/EarningsCalendar/EarningsCalendar"
import { HeatmapSize } from "@/components/dashboard/widgets/Heatmap/HeatmapContainer"
import { EtfsSize } from "@/components/dashboard/widgets/Etfs"
import { InsiderTransactionsSize } from "@/components/dashboard/widgets/InsiderTransactions"
import { InsiderTransactionsSize } from "@/components/dashboard/widgets/InsiderTransactions";

export const widgetSelectorData = [
  {
    id: "widget-1",
    screen: screen,
    content: "GainerLoser",
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 1.7, h: 3.4 },
      medium: { w: 2.2, h: 4.2 },
      large: { w: 2.7, h: 4.5 },
    },
  },

  {
    id: "widget-3",
    screen: screen,
    content: "FiftyTwoWeeklyStats",
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 1.7, h: 3.7 },
      medium: { w: 2.2, h: 4.6 },
      large: { w: 2.7, h: 4.7 },
    },
  },
  {
    id: "widget-4",
    screen: screen,
    content: "SingleStockChart",
    isResizable: true,
    isStockBased: true,
    dimensions: {
      small: { w: 1.6, h: 2.8 },
      medium: { w: 1.9, h: 3.8 },
      large: { w: 2.1, h: 3.8 },
    },
  },
  {
    id: "widget-5",
    screen: screen,
    content: "ActiveStocks",
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 1.9, h: 2.9 },
      medium: { w: 2.2, h: 3.5 },
      large: { w: 2.4, h: 3.9 },
    },
  },
  {
    id: "widget-6",
    screen: screen,
    content: "MarketChart",
    isResizable: false,
    isStockBased: false,
    dimensions: {
      small: { w: 3.1, h: 3.0 },
    },
  },
  {
    id: "widget-7",
    screen: screen,
    content: "Heatmap",
    sizeConfig: HeatmapSize,
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 5.1, h: 6.1 },
      medium: { w: 6, h: 4.1 },
      large: { w: 6, h: 4.2 },
    },
  },
  {
    id: "widget-8",
    screen: screen,
    content: "FinancialTableFull",
    isResizable: false,
    isStockBased: false,
    dimensions: {
      small: { w: 2.6, h: 4.9 },
    },
  },
  {
    id: "widget-9",
    screen: screen,
    content: "SingleStockStackedChart",
    isResizable: true,
    isStockBased: true,
    dimensions: {
      small: { w: 3.1, h: 2.9 },
      medium: { w: 2.6, h: 3.4 },
      large: { w: 2.9, h: 4.0 },
    },
  },
  {
    id: "widget-10",
    screen: screen,
    content: "MostActiveStocks",
    sizeConfig: MostActiveStocksSize,
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 1.9, h: 2.9 },
      medium: { w: 2.2, h: 3.5 },
      large: { w: 2.4, h: 3.9 },
    },
  },
  {
    id: "widget-11",
    screen: screen,
    content: "NewsFeed",
    sizeConfig: NewsFeedSize,
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 1.9, h: 2.9 },
      medium: { w: 2.2, h: 3.5 },
      large: { w: 2.4, h: 3.9 },
    },
  },
  {
    id: "widget-12",
    screen: screen,
    content: "TodaysGainers",
    sizeConfig: TodaysGainersSize,
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 4.0, h: 8 },
      medium: { w: 2.2, h: 8 },
      large: { w: 2.4, h: 8 },
    },
  },
  {
    id: "widget-13",
    screen: screen,
    content: "Watchlist",
    sizeConfig: WatchlistSize,
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 1.9, h: 2.9 },
      medium: { w: 2.2, h: 3.5 },
      large: { w: 2.4, h: 3.9 },
    },
  },
  {
    id: "widget-14",
    screen: screen,
    content: "EarningsCalendar",
    sizeConfig: EarningsCalendarSize,
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 1.9, h: 2.9 },
      medium: { w: 2.2, h: 3.5 },
      large: { w: 2.4, h: 3.9 },
    },
  },
  {
    id: "widget-15",
    screen: screen,
    content: "Consensus",
    sizeConfig: ConsensusSize,
    isResizable: true,
    isStockBased: true,
    dimensions: {
      small: { w: 1.9, h: 2.9 },
      medium: { w: 2.2, h: 3.5 },
      large: { w: 2.4, h: 3.9 },
    },
  },
  {
    id: "widget-16",
    screen: screen,
    content: "ETFs",
    sizeConfig: EtfsSize,
    isResizable: true,
    isStockBased: true,
    dimensions: {
      small: { w: 1.9, h: 2.9 },
      medium: { w: 2.2, h: 3.5 },
      large: { w: 2.4, h: 3.9 },
    },
  },
  {
    id: "widget-18",
    screen: screen,
    content: "InsiderTransactions",
    sizeConfig: InsiderTransactionsSize,
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 3.5, h: 4.5 },
      medium: { w: 4.5, h: 5.5 },
      large: { w: 6, h: 6.5 },
    },
  },
  {
    id: "widget-17",
    screen: screen,
    content: "StockCard",
    sizeConfig: StockCardSize,
    isResizable: true,
    isStockBased: true,
    dimensions: {
      small: { w: 1.9, h: 2.9 },
      medium: { w: 2.2, h: 3.5 },
      large: { w: 2.4, h: 3.9 },
    },
  },
  {
    id: "widget-18",
    screen: screen,
    content: "InsiderTransactions",
    sizeConfig: InsiderTransactionsSize,
    isResizable: true,
    isStockBased: false,
    dimensions: {
      small: { w: 2.8, h: 3.5 },
      medium: { w: 3.4, h: 3.8 },
      large: { w: 4.0, h: 4.1 },
    },
  },
];
