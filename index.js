'use strict';

const _ = require('lodash');
const deg2rad = require('compute-deg2rad');

const cos = Math.cos;
const sin = Math.sin;
const acos = Math.acos;

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
        this.latitude
      ]
    };
  }

  /**
   *
   * @returns {{latitude: *, longitude: *}}
   */
  toPlainObject() {
    return {
      latitude: this.latitude,
      longitude: this.longitude
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
};