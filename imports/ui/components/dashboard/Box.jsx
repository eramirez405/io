import React from 'react';
import { ResizableBox } from 'react-resizable';

export default function Box({
  children,
  width = 150,
  height = 250,
  resizable = true,
  style = {},
  className,
}) {
  return (
    <div>
      {resizable ? (
        <ResizableBox width={width} height={height}>
          <div
            style={{
              ...style,
              width: '100%',
              height: '100%',
            }}
            className={className}
          >
            {children}
          </div>
        </ResizableBox>
      ) : (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            ...style,
          }}
          className={className}
        >
          {children}
        </div>
      )}
    </div>
  );
}
