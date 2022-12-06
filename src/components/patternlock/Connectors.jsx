import { useState, useEffect, useMemo } from 'react';

import Box from '@mui/material/Box';

import { getAngle, getDistance, getConnectorPoint } from './utilities';

const Connectors = ({
  path,
  points,
  wrapperPosition,
  pointActiveSize,
  connectorThickness,
  connectorRoundedCorners,
  initialMousePosition
}) => {
  const [mouse, setMouse] = useState(null);

  useEffect(() => setMouse(initialMousePosition), [initialMousePosition])

  const {
    setMousePosition,
    setTouchPosition
  } = useMemo(() => ({
    setMousePosition: ({ clientX, clientY }) =>
      setMouse({ x: clientX - wrapperPosition.x + window.scrollX, y: clientY - wrapperPosition.y + window.scrollY }),
    setTouchPosition: ({ touches }) =>
      setMouse({ x: touches[0].clientX - wrapperPosition.x + window.scrollX, y: touches[0].clientY - wrapperPosition.y + window.scrollY })
  }), [wrapperPosition]);

  useEffect(() => {
    if (!initialMousePosition) return;
    window.addEventListener('mousemove', setMousePosition);
    window.addEventListener('touchmove', setTouchPosition);
    return () => {
      window.removeEventListener('mousemove', setMousePosition);
      window.removeEventListener('touchmove', setTouchPosition);
    };
  });

  const connectors = [];
  for (let i = 0; i < path.length - 1; i += 1) {
    const current = points[path[i]];
    const next = points[path[i + 1]];
    connectors.push({
      from: getConnectorPoint(current, pointActiveSize, connectorThickness),
      to: getConnectorPoint(next, pointActiveSize, connectorThickness)
    });
  }
  if (mouse && path.length) {

    connectors.push({
      from: getConnectorPoint(points[path[path.length - 1]], pointActiveSize, connectorThickness),
      to: mouse
    });
  }

  return (
    // <div className="react-pattern-lock__connector-wrapper">
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >{
        connectors.map(({ from, to }, i) => (
          <div
            className="react-pattern-lock__connector"
            key={i}
            style={{
              transform: `rotate(${getAngle(from, to)}rad)`,
              width: `${getDistance(from, to)}px`,
              left: `${from.x}px`,
              top: `${from.y}px`,
              height: connectorThickness,
              borderRadius: connectorRoundedCorners ? Math.round(connectorThickness / 2) : 0
            }}
          />
        ))
      }
    </Box>
    // </div>
  );
};

export default Connectors;
