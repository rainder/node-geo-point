# GeoPoint
## Installation
`$ npm install geo-point`

## Constructor
###### `new GeoPoint(latitude: Number, longitude: Number)`

## Static methods
###### `fromGeoJSON({type: String, coordinates: [longitude: Number, latitude: Number]}): GeoPoint`

###### `fromObject({latitude: Number, longitude: Number}): GeoPoint`

###### `calculateDistance(p1: GeoPoint, p2: GeoPoint): Number`
Returns a distance between points in meters

###### `fromLatLngArray([latitude: Number, longitude: Number]): GeoPoint`

###### `fromLngLatArray([longitude: Number, longitude: Number]): GeoPoint`

## Instance methods
###### `toString(): String`
returns `"51.5,-015"`

###### `toGeoJSON(): Object`
returns a GeoJSON representation
```js
{
  "type": "Point",
  "coordinates": [-0.15, 51.5]
}
```
###### `toPlainObject(): Object`
returns a plain `{latitude: Number, longitude: Number}` object

###### `toLatLngArray(): Array`

###### `toLngLatArray(): Array`
