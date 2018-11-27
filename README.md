# GeoPoint
## Installation
`$ npm install geo-point`

## Constructor
##### `new GeoPoint(latitude: Number, longitude: Number)`

## Instance methods

#### `calculateBearing(point: GeoPoint): Number`

Calculates bearing to destination point in degrees.

```js
const startPoint = new GeoPoint(51.5, -0.15);
const endPoint = new GeoPoint(52.5, -1.15);
const bearing = startPoint.calculateBearing(endPoint);
```

#### `calculateDestination(distance: Number, bearing: Number): GeoPoint`

Caculates destination point using start point, bearing and dintace in meters.

```js
const startPoint = new GeoPoint(51.5, -0.15);
const endPoint = startPoint.calculateDestination(1000, 90);
```

#### `calculateDistance(point: GeoPoint): Number`

Calculates distance to the destination point in meters.

```js
const startPoint = new GeoPoint(51.5, -0.15);
const endPoint = new GeoPoint(52.5, -1.15);
const distance = startPoint.calculateDistance(endPoint);

```
#### `toTile(zoom: number): TileObject`

Calculates the tile

```js
const startPoint = new GeoPoint(51.5, -0.15);
const { x, y } = startPoint.toTile(7);
```

##### `toString(): String`
returns **lat,lng** string

##### `toGeoJSON(): Object`
returns a GeoJSON representation

```js
const point = new GeoPoint(51.5, -0.15);
const geoJson = point.toGeoJSON();

geoJson.should.have.keys(['type', 'coordinates']);
geoJson.type.should.equals('Point');
geoJson.coordinates.should.deep.equals([-0.15, 51.5]);
```

##### `toObject(): Object`
returns a plain `{latitude: Number, longitude: Number}` Object

```js
const point = new GeoPoint(51.5, -0.15);
point.toPlainObject().should.have.keys(['latitude', 'longitude']);
```

##### `toLatLngArray(): Array`
returns `[lat, lng]`

```js
const point = new GeoPoint(51.5, -0.15);
point.toLatLngArray().should.deep.equals([51.5, -0.15]);
```

##### `toLngLatArray(): Array`

```js
const point = new GeoPoint(51.5, -0.15);
point.toLngLatArray().should.deep.equals([-0.15, 51.5]);
```

returns `[lng, lat]`

## Static methods
#### `caculateBearing(point1: GeoPoint, point2: GeoPoint): Number`
Returns a bearing between two points

#### `caculateDestination(startPoint: GeoPoint, distance: Number: Bearing: Number): GeoPoint`
Returns destination point

##### `calculateDistance(p1: GeoPoint, p2: GeoPoint): Number`
Returns a distance between points in meters

```js
const point1 = new GeoPoint(51.5, -0.15);
const point2 = new GeoPoint(51.6, -0.15);

const distanceInMeters = GeoPoint.calculateDistance(point1, point2);
```

##### `fromGeoJSON({type: String, coordinates: [longitude: Number, latitude: Number]}): GeoPoint`
factory function

```js
const point = GeoPoint.fromGeoJSON({
  type: 'Point',
  coordinates: [-0.15, 51.5]
});
```

##### `fromObject({latitude: Number, longitude: Number}): GeoPoint`
factory function

```js
const point = GeoPoint.fromObject({
  latitude: 51.5,
  longitude: -0.15
});
```

##### `fromLatLngArray([latitude: Number, longitude: Number]): GeoPoint`
factory function

```js
const point = GeoPoint.fromLatLngArray([51.5, -0.15]);
```

##### `fromLngLatArray([longitude: Number, longitude: Number]): GeoPoint`
factory function

```js
const point = GeoPoint.fromLngLatArray([-0.15, 51.5]);
```
