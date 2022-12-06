import { useRef, useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import classnames from 'classnames';

import Point from './Point';
import Connectors from './Connectors';

import { getPoints, getCollidedPointIndex, getPointsInTheMiddle } from './utilities';

const Styles = createGlobalStyle`
    * {
        user-select none
    }

    .react-pattern-lock__pattern-wrapper {
        touch-action: none;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }
    .react-pattern-lock__connector {
        background: white;
        position: absolute;
        transform-origin: center left;
    }
    .react-pattern-lock__point-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .react-pattern-lock__point {
        cursor pointer;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .react-pattern-lock__point-inner {
        background: white;
        border-radius: 50%;
    }
    .react-pattern-lock__point-inner.active {
        animation: pop 300ms ease;
    }
    .react-pattern-lock__pattern-wrapper.disabled,
    .react-pattern-lock__pattern-wrapper.disabled .react-pattern-lock__point {
        cursor: not-allowed;
    }
    .react-pattern-lock__pattern-wrapper.disabled .react-pattern-lock__point-inner,
    .react-pattern-lock__pattern-wrapper.disabled .react-pattern-lock__connector {
        background: grey;
    }

    .react-pattern-lock__pattern-wrapper.success .react-pattern-lock__point-inner,
    .react-pattern-lock__pattern-wrapper.success .react-pattern-lock__connector {
        background: #00ff00;
    }

    .react-pattern-lock__pattern-wrapper.error .react-pattern-lock__point-inner,
    .react-pattern-lock__pattern-wrapper.error .react-pattern-lock__connector {
        background: red;
    }

    @keyframes pop {
        from { transform scale(1); }
        50% { transform scale(2); }
        to { transform scale(1); }
    }
`;

const PatternLock = ({
  width = '100%',
  size = 5,
  pointActiveSize = 30,
  pointSize = 20,
  connectorThickness = 6,
  connectorRoundedCorners = false,
  disabled = false,
  error = false,
  success = false,
  allowOverlapping = false,
  noPop = false,
  invisible = false,
  allowJumping = false,
  className = '',
  style = {},
  onChange,
  onFinish,
  path
}) => {
  const wrapperRef = useRef(document.createElement('div'));
  const [height, setHeight] = useState(0);
  const [points, setPoints] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [initialMousePosition, setInitialMousePosition] = useState(null);

  const checkCollision = ({ x, y }) => {
    const { top, left } = wrapperRef.current.getBoundingClientRect();
    const mouse = { x: x - left, y: y - top }; // relative to the container as opposed to the screen
    const index = getCollidedPointIndex(mouse, points, pointActiveSize);
    if (~index && path[path.length - 1] !== index) {
      if (allowOverlapping || path.indexOf(index) === -1) {
        if (allowJumping || !path.length) {
          onChange([...path, index]);
        } else {
          let pointsInTheMiddle = getPointsInTheMiddle(path[path.length - 1], index, size);
          if (allowOverlapping) onChange([...path, ...pointsInTheMiddle, index]);
          else onChange([...path, ...pointsInTheMiddle.filter(point => path.indexOf(point) === -1), index]);
        }
      }
    }
  };

  const onResize = () => {
    const { top, left } = wrapperRef.current.getBoundingClientRect();
    setPosition({ x: left + window.scrollX, y: top + window.scrollY });
    return [top, left]
  };

  const onHold = ({ clientX, clientY }) => {
    if (disabled) return;
    const [top, left] = onResize();  // retrieve boundingRect and force setPosition
    setInitialMousePosition({ x: clientX - left, y: clientY - top });
    setIsMouseDown(true);
    checkCollision({ x: clientX, y: clientY });
  };

  const onTouch = ({ touches }) => {
    if (disabled) return;
    const [top, left] = onResize();  // retrieve boundingRect and force setPosition
    setInitialMousePosition({ x: touches[0].clientX - left, y: touches[0].clientY - top });
    setIsMouseDown(true);
    checkCollision({ x: touches[0].clientX, y: touches[0].clientY });
  };

  useEffect(() => {
    if (!isMouseDown) return;
    const onMouseMove = ({ clientX, clientY }) => checkCollision({ x: clientX, y: clientY });
    const onTouchMove = ({ touches }) => checkCollision({ x: touches[0].clientX, y: touches[0].clientY });
    const ref = wrapperRef.current;
    ref.addEventListener('mousemove', onMouseMove);
    ref.addEventListener('touchmove', onTouchMove);
    return () => {
      ref.removeEventListener('mousemove', onMouseMove);
      ref.removeEventListener('touchmove', onTouchMove);
    };
  });

  useEffect(() => setHeight(wrapperRef.current.offsetWidth), []);
  useEffect(() => {
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setPoints(getPoints({ pointActiveSize, height, size }));
      onResize();
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [pointActiveSize, height, size]);

  useEffect(() => {
    const onRelease = () => {
      setIsMouseDown(false);
      setInitialMousePosition(null);
      if (!disabled && path.length) onFinish();
    };

    window.addEventListener('mouseup', onRelease);
    window.addEventListener('touchend', onRelease);

    return () => {
      window.removeEventListener('mouseup', onRelease);
      window.removeEventListener('touchend', onRelease);
    };
  }, [onFinish, disabled, path]);

  return (
    <>
      <Styles />
      <div
        className={classnames(["react-pattern-lock__pattern-wrapper", { error, success, disabled }, className])}
        style={{ ...style, width, height }}
        onMouseDown={onHold}
        onTouchStart={onTouch}
        ref={wrapperRef}
      >
        {
          Array.from({ length: size ** 2 }).map((_, i) => (
            <Point
              key={i}
              index={i}
              size={size}
              pointSize={pointSize}
              pointActiveSize={pointActiveSize}
              pop={!noPop && isMouseDown && path[path.length - 1] === i}
              selected={path.indexOf(i) > -1}
            />
          ))
        }
        {
          !invisible && points.length &&
          <Connectors
            initialMousePosition={initialMousePosition}
            wrapperPosition={position}
            path={path}
            points={points}
            pointActiveSize={pointActiveSize}
            connectorRoundedCorners={connectorRoundedCorners}
            connectorThickness={connectorThickness}
          />
        }

      </div>
    </>
  );
};

PatternLock.propTypes = {
  path: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  size: PropTypes.number,
  pointActiveSize: PropTypes.number,
  connectorThickness: PropTypes.number,
  connectorRoundedCorners: PropTypes.bool,
  pointSize: PropTypes.number,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  success: PropTypes.bool,
  allowOverlapping: PropTypes.bool,
  allowJumping: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  noPop: PropTypes.bool,
  invisible: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onFinish: PropTypes.func.isRequired
};

export default PatternLock;
