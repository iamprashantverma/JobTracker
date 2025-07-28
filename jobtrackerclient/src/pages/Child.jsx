import React from 'react'
import { useState } from 'react';

const Child = (props) => {
    const [count,setCount] = useState(0);
    const {sayHello} = props;

  return (
    <div>
            <p>{count}</p>
      <button onClick={()=>setCount(count + 1) } >increment</button>
      <button onClick={()=>setCount(count -1)}> decrement</button>
      <button onClick={()=> sayHello()}> sayHello</button>
    </div>
  )
}

export default Child
