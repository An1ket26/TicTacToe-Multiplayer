import React from 'react'
import { useState } from 'react'
import Grid from './Grid';

const Playground = ({size,socket,roomId}) => {
    const [grid,setGrid]=useState(new Array(size).fill(0));
    const [turn,setTurn]=useState(false);
    const [symbol,setSymbol]=useState(0);
    const handleClick=(idx)=>{
        console.log("yup");
        if(turn===false)
        {
            return;
        }
        
        setGrid(grid.map((val,ind)=>{
            return ind===idx?symbol:val;
        }))
        socket.emit("new_move",{"roomId":roomId,"idx":idx,"val":symbol});
        setTurn(false);
    }
    socket.on("update",(data)=>{
        console.log(data);
        setGrid(grid.map((val,idx)=>{
            return idx===data.idx?data.val:val;
        }));
        setTurn(true);
    })
    socket.on("symbol",(data)=>{
        console.log(data);
        setSymbol(data);
        if(data==1)
            setTurn(true);
    })
  return (
    <div className='grid'>
        {grid.map((val,idx)=>{
            return <Grid key={idx} val={val} handleClick={()=>{handleClick(idx)}}/>
        })}
    </div>
  )
}

export default Playground