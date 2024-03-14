export type Position = number[];
export type CoordinatesPoint = Position;
export type CoordinatesLineString = Position[];
export type CoordinatesLinearRing = Position[];
export type CoordinatesPolygon = Position[][];
export type CoordinatesMultiPolygon = Position[][][];

export type CoordinatesGeometryType =
  | CoordinatesPoint
  | CoordinatesLineString
  | CoordinatesPolygon
  | CoordinatesMultiPolygon;
