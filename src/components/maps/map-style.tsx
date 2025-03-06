"use client";

import MapProvider from "../MapProvider";

interface MapStylePreviewProps {
  styleUrl: string;
  name: string;
  isActive: boolean;
  onSelect: () => void;
}

export default function MapStylePreview({
  styleUrl,
  name,
  isActive,
  onSelect,
}: MapStylePreviewProps) {
  const defaultLocation = {
    latitude: -13.160441,
    longitude: -74.225832,
  };
  return (
    <div
      onClick={onSelect}
      className={`border-${
        isActive ? "4" : "1"
      } border-blue-500 rounded-lg cursor-pointer`}
      style={{ width: "100px", height: "100px", position: "relative" }}
    >
      <MapProvider
        defaultLocation={defaultLocation}
        mapStyle={styleUrl}
        width="100px"
        height="100px"
      />
      <div className="absolute top-0 left-0 right-0 px-2 text-center font-bold text-gray-900 bg-white bg-opacity-75 rounded-sm">
        {name}
      </div>
    </div>
  );
}
