const Point = ({
  index,
  pointSize,
  pointActiveSize,
  size,
  selected,
  pop,
  isDark
}) => {
  const percentPerItem = 100 / size;

  return (
    <div
      className={`react-pattern-lock__point-wrapper${selected ? " selected" : ""}`}
      style={{
        width: `${percentPerItem}%`,
        height: `${percentPerItem}%`,
        flex: `1 0 ${percentPerItem}%`
      }}
      data-index={index}
    >
      <div
        className="react-pattern-lock__point"
        style={{
          width: pointActiveSize,
          height: pointActiveSize
        }}
      >
        <div
          className={`react-pattern-lock__point-inner-${isDark ? "dark" : "light"}${pop ? " active" : ""}`}
          style={{
            minWidth: pointSize,
            minHeight: pointSize
          }}
        />
      </div>
    </div>
  );
};

export default Point;
