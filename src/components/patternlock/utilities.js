import { useRef, useEffect } from "react";

export const usePrevious = (val) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = val
  }, [val]);
  return ref.current;
};

export const getPoints = ({
  pointActiveSize,
  height,
  size
}) => {
  const halfSize = pointActiveSize / 2;
  const sizePerItem = height / size;
  const halfSizePerItem = sizePerItem / 2;
  return Array.from({ length: size ** 2 }).map((x, i) => ({
    x: ((sizePerItem * (i % size)) + halfSizePerItem) - halfSize,
    y: ((sizePerItem * Math.floor(i / size)) + halfSizePerItem) - halfSize
  }));
};

export const getDistance = (p1, p2) => Math.sqrt(((p2.x - p1.x) ** 2) + ((p2.y - p1.y) ** 2));
export const getAngle = (p1, p2) => Math.atan2(p2.y - p1.y, p2.x - p1.x);

export const getCollidedPointIndex = (
  { x, y }, // Mouse position
  points, // Pattern points
  pointActiveSize // Point active diameter
) => {
  for (let i = 0; i < points.length; i += 1) {
    if (
      x > points[i].x
      && x < points[i].x + pointActiveSize
      && y > points[i].y
      && y < points[i].y + pointActiveSize
    ) return i;
  }
  return -1;
};

export const getConnectorPoint = (
  p,
  pointActiveSize,
  connectorThickness
) => ({
  x: p.x + Math.floor(pointActiveSize / 2),
  y: p.y + Math.floor(pointActiveSize / 2) - Math.floor(connectorThickness / 2)
});

export const exclusiveRange = (rawStart, stop) => {
  if (rawStart === stop) return [];
  const start = rawStart > stop ? rawStart - 1 : rawStart + 1;
  const step = start > stop ? -1 : 1;
  return Array.from({ length: Math.abs(start - stop) })
    .map((_, i) => start + i * step);
}

export const getPointsInTheMiddle = (index1, index2, size) => {
  const x1 = index1 % size;
  const x2 = index2 % size;

  const y1 = Math.floor(index1 / size);
  const y2 = Math.floor(index2 / size);
  const deltaX = Math.abs(x1 - x2);
  const deltaY = Math.abs(y1 - y2);

  if (y1 === y2) { // Horizontal
    return exclusiveRange(size * y1 + x1, size * y2 + x2);
  } else if (x1 === x2) { // Vertical
    return exclusiveRange(y1, y2).map(x => x * size + x1);
  } else if (deltaX === deltaY) { // Diagonal
    const m = x1 < x2 ? 1 : -1;
    return exclusiveRange(y1, y2).map((x, i) => x * size + x1 + ((i + 1) * m));
  }
  return [];
};
