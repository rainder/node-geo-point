type TYPE_POINT = 'Point';

interface GeoJSON {
  type: TYPE_POINT,
  coordinates: number[];
}

interface TileObject {
  x: number;
  y: number;
}

interface GeoPointObject {
  latitude: number;
  longitude: number;
}

export default class GeoPoint {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number);

  static fromGeoJSON(object: GeoJSON): GeoPoint;

  static fromObject(object: GeoPointObject): GeoPoint;

  static calculateDistance(point1: GeoPoint, point2: GeoPoint): number;

  static calculateBearing(point1: GeoPoint, point2: GeoPoint): number;

  static calculateDestination(point: GeoPoint, distance: number, bearing: number): GeoPoint;

  calculateDestination(distance: number, bearing: number): GeoPoint;

  calculateBearing(point: GeoPoint): number;

  calculateDistance(point: GeoPoint): number;

  static fromLatLngArray(array: [number, number]): GeoPoint;

  static fromLngLatArray(array: [number, number]): GeoPoint;

  toString(): string;

  toGeoJSON(): GeoJSON;

  toObject(): GeoPointObject;

  toLatLngArray(): [number, number];

  toLngLatArray(): [number, number];

  static toTile(point: GeoPoint, zoom: number): TileObject;

  toTile(zoom: number): TileObject;
}
