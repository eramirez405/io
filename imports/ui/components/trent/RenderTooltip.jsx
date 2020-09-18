import React from 'react';
import format from 'date-fns/format';

export default RenderTooltip = (props) => {
  const { payload } = props;
  if (!payload) return null;
  if (payload && payload.constructor === Array && payload.length === 0)
    return null;

  console.log(payload);

  const {
    payload: { dateOriginal },
    value,
    name,
  } = payload[0];

  // return <div />;

  return (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '5px 10px',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          color: 'rgb(7,71,166)',
          borderBottom: '1px solid #eee',
          marginBottom: 5,
        }}
      >
        {format(dateOriginal, 'EEEE, MMMM dd')}
      </div>
      <div
        style={{
          color: 'rgb(7,71,166)',
          borderBottom: '1px solid #eee',
          marginBottom: 5,
        }}
      >
        {format(dateOriginal, 'h:mm:s a')}
      </div>
      {payload.map((i) => (
        <div>
          {i.name}:{' '}
          <span style={{ fontWeight: 500, color: i.stroke }}>
            {i.value} {i.unit}
          </span>
        </div>
      ))}
    </div>
  );
};
