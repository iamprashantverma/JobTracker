import React from 'react';

const Child = () => {
  console.log("clicke hua ");
  return <div></div>;
};

export default React.memo(Child);
