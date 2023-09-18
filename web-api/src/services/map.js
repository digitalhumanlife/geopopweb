// const fullGroundList = require('../resources/full-ground-list.json');
const groundList = require('../resources/ground-list.json');

// const polygons = fullGroundList.map(polygonData => {
//   return polygonData.coordinates.map(element => {
//     return [element.lat, element.lng];
//   });
// });

const getSupportedPolygons = () => {
  return groundList;
};

const getPolygonContainPoint = point => {
  for (let i = 0; i < groundList.length; i++) {
    if (isPointInsidePolygon(point, groundList[i].coordinates)) {
      return groundList[i];
    }
  }
  return null;
};

const isPointInsidePolygon = (point, polygons) => {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  const x = point[0];
  const y = point[1];

  let inside = false;
  for (let i = 0, j = polygons.length - 1; i < polygons.length; j = i++) {
    const xi = polygons[i].lat;
    const yi = polygons[i].lng;
    const xj = polygons[j].lat;
    const yj = polygons[j].lng;

    const yiy = yi > y;
    const yjy = yj > y;

    const intersect = yiy !== yjy && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

module.exports = {
  getPolygonContainPoint,
  getSupportedPolygons,
};
