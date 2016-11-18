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

##### `toString(): String`
returns **lat,lng** string

##### `toGeoJSON(): Object`
returns a GeoJSON representation
```js
{
  "type": "Point",
  "coordinates": [-0.15, 51.5]
}
```

##### `toObject(): Object`
returns a plain `{latitude: Number, longitude: Number}` object

##### `toLatLngArray(): Array`
returns `[lat, lng]`

##### `toLngLatArray(): Array`

returns `[lng, lat]`

## Static methods
#### `caculateBearing(point1: GeoPoint, point2: GeoPoint): Number`
Returns a bearing between two points

#### `caculateDestination(startPoint: GeoPoint, distance: Number: Bearing: Number): GeoPoint`
Returns destination point

##### `calculateDistance(p1: GeoPoint, p2: GeoPoint): Number`
Returns a distance between points in meters

##### `fromGeoJSON({type: String, coordinates: [longitude: Number, latitude: Number]}): GeoPoint`

##### `fromObject({latitude: Number, longitude: Number}): GeoPoint`

##### `fromLatLngArray([latitude: Number, longitude: Number]): GeoPoint`

##### `fromLngLatArray([longitude: Number, longitude: Number]): GeoPoint`