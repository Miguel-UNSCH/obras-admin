import * as turf from "@turf/turf";

function medidaTotal(points: [number, number][], projectType: string): string {
  let areaOrLength = "";
  if (projectType === "Superficie") {
    const polygon = turf.polygon([points.concat([points[0]])]);
    const area = turf.area(polygon).toFixed(2);
    areaOrLength = `${area} m²`;
  } else if (projectType === "Carretera") {
    const line = turf.lineString(points);
    const length = turf.length(line, { units: "meters" }).toFixed(2);
    areaOrLength = `${length} m`;
  }

  return areaOrLength;
}

export default medidaTotal;
