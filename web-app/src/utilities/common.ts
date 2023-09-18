import { isString } from 'lodash';
import isEmpty from 'lodash/isEmpty';

const getValue = (value: any, defaultValue: any) => {
  return !isEmpty(value) ? value : defaultValue;
};

const isPointInsidePolygon = (point: any[], polygons: any[]) => {
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

    const yiy = yi >= y;
    const yjy = yj >= y;

    const intersect = yiy !== yjy && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
};

const isPointInsidePolygon2 = (point: any, polygons: any[]) => {
  // ray-casting algorithm based on
  // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html

  const x = point.x;
  const y = point.y;

  let inside = false;
  for (let i = 0, j = polygons.length - 1; i < polygons.length; j = i++) {
    const xi = polygons[i].x;
    const yi = polygons[i].y;
    const xj = polygons[j].x;
    const yj = polygons[j].y;

    const yiy = yi >= y;
    const yjy = yj >= y;

    const intersect = yiy !== yjy && x <= ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }

  return inside;
  // var isInside = false;
  // var minX = polygons[0].x,
  //   maxX = polygons[0].x;
  // var minY = polygons[0].y,
  //   maxY = polygons[0].y;
  // for (var n = 1; n < polygons.length; n++) {
  //   var q = polygons[n];
  //   minX = Math.min(q.x, minX);
  //   maxX = Math.max(q.x, maxX);
  //   minY = Math.min(q.y, minY);
  //   maxY = Math.max(q.y, maxY);
  // }

  // if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
  //   return false;
  // }

  // for (let i = 0, j = polygons.length - 1; i < polygons.length; j = i++) {
  //   if (
  //     polygons[i].y > point.y !== polygons[j].y > point.y &&
  //     point.x <
  //       ((polygons[j].x - polygons[i].x) * (point.y - polygons[i].y)) / (polygons[j].y - polygons[i].y) + polygons[i].x
  //   ) {
  //     isInside = !isInside;
  //   }
  // }

  // return isInside;
};

const toFormattedNumber = (value: number) => {
  if (isString(value)) return value;
  return new Intl.NumberFormat('ko-KR', {
    maximumFractionDigits: 3,
    minimumFractionDigits: 0,
  }).format(value);
};

const getPolygonArea = (points: any[]) => {
  let area = 0,
    i,
    j,
    point1,
    point2;

  for (i = 0, j = points.length - 1; i < points.length; j = i, i++) {
    point1 = points[i];
    point2 = points[j];
    area += point1[1] * point2[0];
    area -= point1[0] * point2[1];
  }
  area /= 2;

  return area;
};

const getPolygonCenter = (points: any[]) => {
  var x = 0,
    y = 0,
    i,
    j,
    f,
    point1,
    point2;

  for (i = 0, j = points.length - 1; i < points.length; j = i, i++) {
    point1 = points[i];
    point2 = points[j];
    f = point1[1] * point2[0] - point2[1] * point1[0];
    x += (point1[1] + point2[1]) * f;
    y += (point1[0] + point2[0]) * f;
  }

  f = getPolygonArea(points) * 6;

  return [x / f, y / f];
};

const getCentrePointFromListOfLocations = (coordList: any[]) => {
  const total = coordList.length;
  let X = 0;
  let Y = 0;
  let Z = 0;

  for (const location of coordList) {
    let lat = (location[1] * Math.PI) / 180;
    let lon = (location[0] * Math.PI) / 180;

    let x = Math.cos(lat) * Math.cos(lon);
    let y = Math.cos(lat) * Math.sin(lon);
    let z = Math.sin(lat);

    X += x;
    Y += y;
    Z += z;
  }

  X = X / total;
  Y = Y / total;
  Z = Z / total;

  let Lon = Math.atan2(Y, X);
  let Hyp = Math.sqrt(X * X + Y * Y);
  let Lat = Math.atan2(Z, Hyp);

  return [(Lat * 180) / Math.PI, (Lon * 180) / Math.PI];
};

export {
  getValue,
  isPointInsidePolygon,
  isPointInsidePolygon2,
  toFormattedNumber,
  getPolygonCenter,
  getCentrePointFromListOfLocations,
};
