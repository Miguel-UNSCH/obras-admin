export default function calculateHalfwayPoint(
  lista: [number, number][],
  type: string
): {
  longitude: number;
  latitude: number;
} {
  if (type === "Superficie") {
    let sumLat = 0;
    let sumLon = 0;

    lista.forEach(([lon, lat]) => {
      sumLat += lat;
      sumLon += lon;
    });

    return {
      latitude: sumLat / lista.length,
      longitude: sumLon / lista.length,
    };
  } else {
    const midIndex = Math.floor(lista.length / 2);
    return {
      latitude: lista[midIndex][1],
      longitude: lista[midIndex][0],
    };
  }
}
