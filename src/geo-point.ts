const deg2rad = require('compute-deg2rad');
const rad2deg = require('compute-rad2deg');

const cos = Math.cos;
const asin = Math.asin;
const sin = Math.sin;
const acos = Math.acos;
const atan2 = Math.atan2;
const radius = 6371e3;

const isObject = (input) => typeof input === 'object' && input !== null;

export type Point = {
  type: 'Point';
  coordinates: [longitude: number, latitude: number];
};

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type Tile = {
  x: number;
  y: number;
};

export class GeoPoint {
  readonly latitude: number;
  readonly longitude: number;

  /**
   *
   * @param latitude
   * @param longitude
   */
  constructor(latitude: number, longitude: number) {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new RangeError('Bad geo point arguments');
    }

    if (latitude < -90 || latitude > 90) {
      throw new RangeError('bad latitude value');
    }

    if (longitude < -180 || longitude > 180) {
      throw new RangeError('bad longitude value');
    }

    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   *
   * @param point {{type: String, coordinates: Array}}
   * @returns {GeoPoint}
   */
  static fromGeoJSON(point: Point): GeoPoint {
    if (!isObject(point)) {
      throw new TypeError('GeoPoint: Argument must be an object');
    }

    if (!point.hasOwnProperty('type') || !point.hasOwnProperty('coordinates')) {
      throw new TypeError('Object must have type and coordinates');
    }

    if (point.type !== 'Point') {
      throw new TypeError('The value of type should be \'Point\'');
    }

    if (!Array.isArray(point.coordinates) || point.coordinates.length !== 2) {
      throw new TypeError('coordinates must be an array and contain 2 elements');
    }

    return this.fromLngLatArray(point.coordinates);
  }

  /**
   *
   * @param object {{latitude: Number, longitude: Number}}
   * @returns {GeoPoint}
   */
  static fromObject(object: LatLng): GeoPoint {
    if (!isObject(object)) {
      throw new TypeError('GeoPoint: Argument must be an object');
    }

    if (!object.hasOwnProperty('latitude') || !object.hasOwnProperty('longitude')) {
      throw new TypeError('Object must have latitude and longitude');
    }

    return new GeoPoint(object.latitude, object.longitude);
  }

  /**
   *
   * @param point1
   * @param point2
   * @returns {number}
   */
  static calculateDistance(point1: GeoPoint, point2: GeoPoint): number {
    const point1Rad = deg2rad(point1.latitude);
    const point2Rad = deg2rad(point2.latitude);
    const a = deg2rad(point2.longitude) - deg2rad(point1.longitude);
    const b = cos(point1Rad) * cos(point2Rad) * cos(a);
    const c = sin(point1Rad) * sin(point2Rad);
    const r = b + c;

    return acos(r > 1 ? 1 : r) * 6371392.896;
  }

  /**
   *
   * @param point1 {GeoPoint}
   * @param point2 {GeoPoint}
   * @returns {number}
   */
  static calculateBearing(point1: GeoPoint, point2: GeoPoint): number {
    const φ1 = deg2rad(point1.latitude), φ2 = deg2rad(point2.latitude);
    const Δλ = deg2rad(point2.longitude - point1.longitude);

    // see http://mathforum.org/library/drmath/view/55417.html
    const y = sin(Δλ) * cos(φ2);
    const x = cos(φ1) * sin(φ2) - sin(φ1) * cos(φ2) * cos(Δλ);
    const θ = atan2(y, x);

    return (rad2deg(θ) + 360) % 360;
  }

  /**
   *
   * @param coordinate {GeoPoint}
   * @param distance {Number} distance in meters
   * @param bearing {Number} bearing in degrees
   * @returns {GeoPoint}
   */
  static calculateDestination(coordinate: LatLng, distance: number, bearing: number): GeoPoint {
    // sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
    // tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
    // see http://williams.best.vwh.net/avform.htm#LL

    const δ = Number(distance) / radius; // angular distance in radians
    const θ = deg2rad(Number(bearing));

    const φ1 = deg2rad(coordinate.latitude);
    const λ1 = deg2rad(coordinate.longitude);

    const sinφ1 = sin(φ1), cosφ1 = cos(φ1);
    const sinδ = sin(δ), cosδ = cos(δ);
    const sinθ = sin(θ), cosθ = cos(θ);

    const sinφ2 = sinφ1 * cosδ + cosφ1 * sinδ * cosθ;
    const φ2 = asin(sinφ2);
    const y = sinθ * sinδ * cosφ1;
    const x = cosδ - sinφ1 * sinφ2;
    const λ2 = λ1 + atan2(y, x);

    const latitude = rad2deg(φ2);
    const longitude = (rad2deg(λ2) + 540) % 360 - 180; // normalise to −180..+180°

    return new GeoPoint(latitude, longitude);
  }

  /**
   *
   * @param array
   * @returns {GeoPoint}
   */
  static fromLatLngArray(array: [latitude: number, longitude: number]): GeoPoint {
    return new GeoPoint(array[0], array[1]);
  }

  /**
   *
   * @param array
   * @returns {GeoPoint}
   */
  static fromLngLatArray(array: [longitude: number, latitude: number]): GeoPoint {
    return new GeoPoint(array[1], array[0]);
  }

  static toTile(coordinate: LatLng, zoom: number): Tile {
    // retrieved from: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
    const x = Math.floor((coordinate.longitude + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(coordinate.latitude * Math.PI / 180) + 1 / Math.cos(coordinate.latitude * Math.PI / 180)) / Math.PI) / 2 * Math.pow(
      2,
      zoom,
    ));

    return { x, y };
  }

  /**
   *
   * @param distance {Number} distance in meters
   * @param bearing {Number} bearing in degrees
   * @returns {GeoPoint} destination point
   */
  calculateDestination(distance: number, bearing: number): GeoPoint {
    return GeoPoint.calculateDestination(this, distance, bearing);
  }

  /**
   *
   * @param point {GeoPoint} destination geo point
   * @returns {number} bearing in degrees
   */
  calculateBearing(point: GeoPoint): number {
    return GeoPoint.calculateBearing(this, point);
  }

  /**
   *
   * @param point {GeoPoint}
   * @returns {number} distance in meters
   */
  calculateDistance(point: GeoPoint): number {
    return GeoPoint.calculateDistance(this, point);
  }

  /**
   *
   * @returns {string}
   */
  toString(): string {
    return `${ this.latitude },${ this.longitude }`;
  }

  /**
   *
   * @returns {{type: string, coordinates: *[]}}
   */
  toGeoJSON(): Point {
    return {
      type: 'Point',
      coordinates: [
        this.longitude,
        this.latitude,
      ],
    };
  }

  /**
   *
   * @returns {{latitude: *, longitude: *}}
   */
  toObject(): LatLng {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  /**
   *
   * @returns {*[]}
   */
  toLatLngArray(): [latitude: number, longitude: number] {
    return [this.latitude, this.longitude];
  }

  /**
   *
   * @returns {*[]}
   */
  toLngLatArray(): [longitude: number, latitude: number] {
    return [this.longitude, this.latitude];
  }

  toTile(zoom: number): Tile {
    return GeoPoint.toTile(this, zoom);
  }

  /**
   *
   * https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
   *       The sign tells us whether we are north or south, east or west on the globe.
   *       A nonzero hundreds digit tells us we're using longitude, not latitude!
   *       The tens digit gives a position to about 1,000 kilometers. It gives us useful information about what continent or ocean we are on.
   *       The units digit (one decimal degree) gives a position up to 111 kilometers (60 nautical miles, about 69 miles). It can tell us roughly what large state or country we are in.
   *       The first decimal place is worth up to 11.1 km: it can distinguish the position of one large city from a neighboring large city.
   *       The second decimal place is worth up to 1.1 km: it can separate one village from the next.
   *       The third decimal place is worth up to 110 m: it can identify a large agricultural field or institutional campus.
   *       The fourth decimal place is worth up to 11 m: it can identify a parcel of land. It is comparable to the typical accuracy of an uncorrected GPS unit with no interference.
   *       The fifth decimal place is worth up to 1.1 m: it distinguish trees from each other. Accuracy to this level with commercial GPS units can only be achieved with differential correction.
   *       The sixth decimal place is worth up to 0.11 m: you can use this for laying out structures in detail, for designing landscapes, building roads. It should be more than good enough for tracking movements of glaciers and rivers. This can be achieved by taking painstaking measures with GPS, such as differentially corrected GPS.
   *       The seventh decimal place is worth up to 11 mm: this is good for much surveying and is near the limit of what GPS-based techniques can achieve.
   *       The eighth decimal place is worth up to 1.1 mm: this is good for charting motions of tectonic plates and movements of volcanoes. Permanent, corrected, constantly-running GPS base stations might be able to achieve this level of accuracy.
   *       The ninth decimal place is worth up to 110 microns: we are getting into the range of microscopy. For almost any conceivable application with earth positions, this is overkill and will be more precise than the accuracy of any surveying device.
   *       Ten or more decimal places indicates a computer or calculator was used and that no attention was paid to the fact that the extra decimals are useless. Be careful, because unless you are the one reading these numbers off the device, this can indicate low quality processing!
   *
   * @param {number} precision
   * @returns {GeoPoint}
   */
  adjustPrecision(precision: number) {
    const adjust = (input: number) => parseFloat(input.toFixed(precision));

    return new GeoPoint(adjust(this.latitude), adjust(this.longitude));
  }
}
