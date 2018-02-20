type TYPE_POINT = 'Point';

interface GeoJSON {
  type: TYPE_POINT,
  coordinates: number[];
}

interface GeoPointObject {
  latitude: number;
  longitude: number;
}

export default class GeoPoint {
  constructor(latitude: number, longitude: number);

  static fromGeoJSON(object: GeoJSON): GeoPoint;

  static fromObject(object: GeoPointObject): GeoPoint;

  static calculateDistance(point1: GeoPoint, point2: GeoPoint): number;

  static calculateBearing(point1: GeoPoint, point2: GeoPoint): number;

  static calculateDestination(point: GeoPoint, distance: number, bearing: number): GeoPoint;

  calculateDestination(distance: number, bearing: number): GeoPoint;

  calculateBearing(point: GeoPoint): number;

  calculateDistance(point: GeoPoint): number;

  static fromLatLngArray(array: number[]): GeoPoint;

  static fromLngLatArray(array: number[]): GeoPoint;

  toString(): string;

  toGeoJSON(): GeoJSON;

  toObject(): GeoPointObject;

  toLatLngArray(): number;

  toLngLatArray(): number;
}
