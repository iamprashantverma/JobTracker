import React, { useCallback, useState } from 'react';
import Child from './Child';

const Parent = () => {
  const [count, setCount] = useState(0);

  const help =useCallback(() => {
    console.log("helped me");
  },[]);

  return (
    <div>
      <Child  help = {help}/>
      <h1>{count}</h1>
      <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
    </div>
  );
};

export default Parent;
