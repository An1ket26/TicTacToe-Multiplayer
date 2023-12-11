import React from 'react'

const Grid = ({val,handleClick}) => {
  return (
    <>
    {val===0 && <div className='empty' onClick={handleClick}></div>}
    {val===1 && <div className='empty cross'></div>}
    {val===2 && <div className='empty circle'></div>}
    </>
    
  )
}

export default Grid