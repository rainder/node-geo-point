'use strict';

const _ = require('lodash');
const deg2rad = require('compute-deg2rad');
const rad2deg = require('compute-rad2deg');

const cos = Math.cos;
const asin = Math.asin;
const sin = Math.sin;
const acos = Math.acos;
const atan2 = Math.atan2;
const radius = 6371e3;

module.exports = class GeoPoint {
  /**
   *
   * @param latitude
   * @param longitude
   */
  constructor(latitude, longitude) {
    if (_.isUndefined(latitude) || _.isUndefined(longitude)) {
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
   * @param object {{type: String, coordinates: Array}}
   * @returns {GeoPoint}
   */
  static fromGeoJSON(object) {
    if (!_.isObject(object)) {
      throw new TypeError('GeoPoint: Argument must be an object');
    }

    if (!object.hasOwnProperty('type') || !object.hasOwnProperty('coordinates')) {
      throw new TypeError('Object must have type and coordinates');
    }

    if (object.type !== 'Point') {
      throw new TypeError('The value of type should be \'Point\'');
    }

    if (!_.isArray(object.coordinates) || object.coordinates.length !== 2) {
      throw new TypeError('coordinates must be an array and contain 2 elements');
    }

    return this.fromLngLatArray(object.coordinates);
  }

  /**
   *
   * @param object {{latitude: Number, longitude: Number}}
   * @returns {GeoPoint}
   */
  static fromObject(object) {
    if (!_.isObject(object)) {
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
  static calculateDistance(point1, point2) {
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
  static calculateBearing(point1, point2) {
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
   * @param point {GeoPoint}
   * @param distance {Number} distance in meters
   * @param bearing {Number} bearing in degrees
   * @returns {GeoPoint}
   */
  static calculateDestination(point, distance, bearing) {
    // sinφ2 = sinφ1⋅cosδ + cosφ1⋅sinδ⋅cosθ
    // tanΔλ = sinθ⋅sinδ⋅cosφ1 / cosδ−sinφ1⋅sinφ2
    // see http://williams.best.vwh.net/avform.htm#LL

    const δ = Number(distance) / radius; // angular distance in radians
    const θ = deg2rad(Number(bearing));

    const φ1 = deg2rad(point.latitude);
    const λ1 = deg2rad(point.longitude);

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
   * @param distance {Number} distance in meters
   * @param bearing {Number} bearing in degrees
   * @returns {GeoPoint} destination point
   */
  calculateDestination(distance, bearing) {
    return GeoPoint.calculateDestination(this, distance, bearing);
  }

  /**
   *
   * @param point {GeoPoint} destination geo point
   * @returns {number} bearing in degrees
   */
  calculateBearing(point) {
    return GeoPoint.calculateBearing(this, point);
  }

  /**
   *
   * @param point {GeoPoint}
   * @returns {number} distance in meters
   */
  calculateDistance(point) {
    return GeoPoint.calculateDistance(this, point);
  }

  /**
   *
   * @param array
   * @returns {GeoPoint}
   */
  static fromLatLngArray(array) {
    return new GeoPoint(array[0], array[1]);
  }

  /**
   *
   * @param array
   * @returns {GeoPoint}
   */
  static fromLngLatArray(array) {
    return new GeoPoint(array[1], array[0]);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `${this.latitude},${this.longitude}`;
  }

  /**
   *
   * @returns {{type: string, coordinates: *[]}}
   */
  toGeoJSON() {
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
  toObject() {
    return {
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }

  /**
   *
   * @returns {*[]}
   */
  toLatLngArray() {
    return [this.latitude, this.longitude];
  }

  /**
   *
   * @returns {*[]}
   */
  toLngLatArray() {
    return [this.longitude, this.latitude];
  }

  static toTile(point, zoom) {
    // retrieved from: https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#ECMAScript_.28JavaScript.2FActionScript.2C_etc..29
    const x = Math.floor((point.longitude + 180) / 360 * Math.pow(2, zoom));
    const y = Math.floor((1 - Math.log(Math.tan(point.latitude * Math.PI / 180) + 1 / Math.cos(point.latitude * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

    return { x, y };
  }

  toTile(zoom) {
    return GeoPoint.toTile(this, zoom);
  }
};
