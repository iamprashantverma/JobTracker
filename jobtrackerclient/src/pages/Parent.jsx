import React, { useMemo, useState } from 'react'
import Child from './Child';

const Parent = () => {
    const [count, setCount] = useState(0);
   const sayHello = useMemo(()=>{
        setCount(count + 1);
   },count);
  return (
    <div>
      <p>{count} - Parent</p>
      <Child  sayHello = {sayHello}/>
    </div>
  )
}

export default Parent
