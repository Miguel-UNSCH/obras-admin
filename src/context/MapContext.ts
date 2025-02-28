import { createContext, useContext } from "react";
import { MapRef, ViewState } from "react-map-gl";

export interface MapContextType {
  map: MapRef | null;
  viewState: Omit<ViewState, "width" | "height">;
  setViewState: React.Dispatch<
    React.SetStateAction<Omit<ViewState, "width" | "height">>
  >;
  isMapFullyLoaded: boolean;
  terrainLoaded: boolean;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export function useMapContext(): MapContextType {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
}

export default MapContext;
