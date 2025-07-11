/**
 * Widget Configuration Registry
 * Centralized configuration for all widget types and their size mappings
 */

import { TodaysGainersSize } from "@/components/dashboard/widgets/TodaysGainers";
import { StockCardSize } from "@/components/dashboard/widgets/StockCard";
import { MostActiveStocksSize } from "@/components/dashboard/widgets/MostActiveStocks";
import { InsiderTransactionsSize } from "@/components/dashboard/widgets/InsiderTransactions";

/**
 * Default widget dimensions
 */
export const DEFAULT_WIDGET_SIZE = {
  width: "320",
  height: "250"
};

/**
 * Widget size configuration registry
 * Maps widget types to their size configurations
 */
export const WIDGET_SIZE_REGISTRY = {
  TodaysGainers: {
    sizeConfig: TodaysGainersSize,
    defaultSize: 'small'
  },
  StockCard: {
    sizeConfig: StockCardSize,
    defaultSize: 'small'
  },
  MostActiveStocks: {
    sizeConfig: MostActiveStocksSize,
    defaultSize: 'small'
  },
  InsiderTransactions: {
    sizeConfig: InsiderTransactionsSize,
    defaultSize: 'small'
  }
};

/**
 * Grid layout constants
 */
export const GRID_CONFIG = {
  COLUMNS: 12,
  ROW_HEIGHT: 20,
  DEFAULT_POSITION: { x: 0, y: 0 }
};

/**
 * Widget size calculation strategies
 */
export class WidgetSizeStrategy {
  /**
   * Get size configuration for a widget type
   * @param {string} widgetType - The widget content type
   * @param {string} size - The requested size (small, medium, large)
   * @returns {Object} Size configuration object
   */
  static getSizeConfig(widgetType, size = 'small') {
    const registry = WIDGET_SIZE_REGISTRY[widgetType];
    
    if (!registry) {
      console.warn(`Unknown widget type: ${widgetType}. Using default size.`);
      return DEFAULT_WIDGET_SIZE;
    }

    const sizeConfig = registry.sizeConfig[size] || registry.sizeConfig[registry.defaultSize];
    return sizeConfig || DEFAULT_WIDGET_SIZE;
  }

  /**
   * Register a new widget type
   * @param {string} widgetType - The widget type name
   * @param {Object} sizeConfig - Size configuration object
   * @param {string} defaultSize - Default size key
   */
  static registerWidget(widgetType, sizeConfig, defaultSize = 'small') {
    WIDGET_SIZE_REGISTRY[widgetType] = {
      sizeConfig,
      defaultSize
    };
  }

  /**
   * Check if a widget type is registered
   * @param {string} widgetType - The widget type to check
   * @returns {boolean} True if registered
   */
  static isRegistered(widgetType) {
    return widgetType in WIDGET_SIZE_REGISTRY;
  }

  /**
   * Get all registered widget types
   * @returns {string[]} Array of registered widget type names
   */
  static getRegisteredTypes() {
    return Object.keys(WIDGET_SIZE_REGISTRY);
  }
}

/**
 * Grid dimension calculator
 */
export class GridDimensionCalculator {
  /**
   * Convert pixel dimensions to grid units with float precision
   * @param {number} pixelWidth - Width in pixels
   * @param {number} pixelHeight - Height in pixels
   * @param {number} gridWidth - Total grid width
   * @returns {Object} Grid dimensions {w, h} as floats for precise positioning
   */
  static pixelsToGridUnits(pixelWidth, pixelHeight, gridWidth) {
    const columnWidth = gridWidth / GRID_CONFIG.COLUMNS;
    const w = pixelWidth / columnWidth; // Keep as float for precision
    const h = pixelHeight / GRID_CONFIG.ROW_HEIGHT; // Keep as float for precision
    
    return { w, h };
  }

  /**
   * Convert grid units to pixel dimensions
   * @param {number} gridW - Width in grid units
   * @param {number} gridH - Height in grid units
   * @param {number} gridWidth - Total grid width
   * @returns {Object} Pixel dimensions {width, height}
   */
  static gridUnitsToPixels(gridW, gridH, gridWidth) {
    const columnWidth = gridWidth / GRID_CONFIG.COLUMNS;
    const width = gridW * columnWidth;
    const height = gridH * GRID_CONFIG.ROW_HEIGHT;
    
    return { width, height };
  }
}
