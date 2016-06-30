# GeoPoint
## Installation
`$ npm install geo-point`

## Constructor
###### `new GeoPoint(latitude: Number, longitude: Number)`

## Static methods
###### `fromGeoJSON({type: String, coordinates: [longitude: Number, latitude: Number]}): GeoPoint`
factory function

```js
const point = GeoPoint.fromGeoJSON({
  type: 'Point',
  coordinates: [-0.15, 51.5]
});
```

###### `fromObject({latitude: Number, longitude: Number}): GeoPoint`
factory function

```js
const point = GeoPoint.fromObject({
  latitude: 51.5,
  longitude: -0.15
});
```

###### `fromLatLngArray([latitude: Number, longitude: Number]): GeoPoint`
factory function

```js
const point = GeoPoint.fromLatLngArray([51.5, -0.15]);
```

###### `fromLngLatArray([longitude: Number, longitude: Number]): GeoPoint`
factory function

```js
const point = GeoPoint.fromLngLatArray([-0.15, 51.5]);
```

###### `calculateDistance(p1: GeoPoint, p2: GeoPoint): Number`
Returns a distance between points in meters

```js
const point1 = new GeoPoint(51.5, -0.15);
const point2 = new GeoPoint(51.6, -0.15);

const distanceInMeters = GeoPoint.calculateDistance(point1, point2);
```

## Instance methods
###### `toString(): String`
returns a string representation of coordinate pair

```js
const point = new GeoPoint(51.5, -0.15);
point.toString(); // String(51.5,-0.15)
```

###### `toGeoJSON(): Object`
returns a GeoJSON representation

```js
const point = new GeoPoint(51.5, -0.15);
const geoJson = point.toGeoJSON();

geoJson.should.have.keys(['type', 'coordinates']);
geoJson.type.should.equals('Point');
geoJson.coordinates.should.deep.equals([-0.15, 51.5]);
```

###### `toPlainObject(): Object`
returns a plain `{latitude: Number, longitude: Number}` object

```js
const point = new GeoPoint(51.5, -0.15);
point.toPlainObject().should.have.keys(['latitude', 'longitude']);
```

###### `toLatLngArray(): Array`
returns latitude, longitude pairs array

```js
const point = new GeoPoint(51.5, -0.15);
point.toLatLngArray().should.deep.equals([51.5, -0.15]);
```

###### `toLngLatArray(): Array`
returns longitude, latitude pairs array

```js
const point = new GeoPoint(51.5, -0.15);
point.toLngLatArray().should.deep.equals([-0.15, 51.5]);
```
