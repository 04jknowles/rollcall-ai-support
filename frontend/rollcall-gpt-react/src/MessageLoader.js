import React from "react";
import ContentLoader from "react-content-loader";

const MessageLoader = ({ width = 988, height = 50, botMessageSize }) => {
  const windowWidth = window.innerWidth;
  const screenWidth = windowWidth * 0.78;

  console.log(botMessageSize);
  return (
    <ContentLoader
      speed={2}
      width={screenWidth}
      height={height}
      viewBox={`0 0 ${screenWidth} ${height}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect
        x="0"
        y={height * (1 / 6) - 4}
        rx="3"
        ry="3"
        width={screenWidth * 0.98}
        height="8"
      />
      <rect
        x="0"
        y={height * (3 / 6) - 4}
        rx="3"
        ry="3"
        width={screenWidth * 0.98}
        height="8"
      />
      <rect
        x="0"
        y={height * (5 / 6) - 4}
        rx="3"
        ry="3"
        width={screenWidth * 0.98}
        height="8"
      />
    </ContentLoader>
  );
};

export default MessageLoader;
