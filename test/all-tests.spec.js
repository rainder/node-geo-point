'use strict';

const chai = require('chai');
const GeoPoint = require('./..');
chai.should();

describe('all-tests', function () {
  it('should create an instance', function () {
    const gp1 = new GeoPoint(1, 2);
    gp1.toLatLngArray().should.deep.equals([1, 2]);
    gp1.toLngLatArray().should.deep.equals([2, 1]);
  });

  it('should calculate distance', function () {
    const p1 = new GeoPoint(51.5, -0.15);
    const p2 = new GeoPoint(51.6, -0.16);

    const distance = GeoPoint.calculateDistance(p1, p2);
    Math.round(distance).should.equals(11142);
  });

  it('should convert to GeoJSON', function () {
    const p1 = new GeoPoint(51.5, -0.15);
    const geoJson = p1.toGeoJSON();
    geoJson.should.have.keys(['type', 'coordinates']);
    geoJson.type.should.equals('Point');
    geoJson.coordinates.length.should.equals(2);
    geoJson.coordinates[0].should.equals(p1.longitude)
    geoJson.coordinates[1].should.equals(p1.latitude)
  });

  it('should convert to string', function () {
    const p1 = new GeoPoint(51.5, -0.15);
    p1.toString().should.equals('51.5,-0.15');
  });

  it('should convert to a plain object', function () {
    const p1 = GeoPoint.fromObject({
      latitude: 51.5,
      longitude: -0.15
    });
    const o = p1.toObject();
    o.should.have.keys(['latitude', 'longitude']);

    o.latitude.should.equals(51.5);
    o.longitude.should.equals(-0.15);
  });

  it('should construct from GeoJSON', function () {
    const p1 = GeoPoint.fromGeoJSON({
      type: 'Point',
      coordinates: [-0.15, 51.5]
    });

    p1.toObject().should.deep.equals({
      latitude: 51.5,
      longitude: -0.15
    });
  });

  it('should calculate bearing', function () {
    Math.round(GeoPoint.calculateBearing(
      new GeoPoint(51.5, -0.15),
      new GeoPoint(51.5, 1.15)
    )).should.equals(89);

    GeoPoint.calculateBearing(
      new GeoPoint(51, 0),
      new GeoPoint(52, 0)
    ).should.equals(0);

    Math.round(GeoPoint.calculateBearing(
      new GeoPoint(-6.231624, 106.802569),
      new GeoPoint(-6.22063, 106.61694)
    )).should.equals(273);
  });

  it('should calculate destination', function () {
    const point = new GeoPoint(51, 0);

    const d1 = point.calculateDestination(10000, 360);

    d1.longitude.should.equals(0);
    Math.round(d1.latitude).should.equals(51);
  });

  it('should return tile coordinates', function () {
    const zoom = 18;
    const point = new GeoPoint(51.5218054, -0.1172997);

    const tile = point.toTile(zoom);

    tile.x.should.equals(130986);
    tile.y.should.equals(87152);
  });
});