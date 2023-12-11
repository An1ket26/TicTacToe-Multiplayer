import React from 'react'
import { useState,useEffect } from 'react'
import Grid from './Grid';

const Playground = ({size,socket,roomId}) => {
    const [grid,setGrid]=useState(new Array(size).fill(0));
    const [turn,setTurn]=useState(false);
    const [symbol,setSymbol]=useState(0);
    const [winner,setWinner]=useState("");
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
    socket.on("winner",(data)=>{
        setWinner("player"+data);
    })
    const checkWin=()=>{
        var conditions = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        var win=false;
        conditions.forEach((e)=>{
            if(grid[e[0]]===grid[e[1]] && grid[e[1]]===grid[e[2]] && grid[e[0]]===symbol && grid[e[0]]!==0)
            {
                win=true;
            }
        })
        if(win===true)
        {
            setWinner("player"+symbol);
            socket.emit("winner",{"roomId":roomId,"symbol":symbol});
        }
        var draw=true;
        for(let i=0;i<9;i++)
        {
            if(grid[i]===0)
            {
                draw=false;
                break;
            }
        }
        if(draw)
        {
            setWinner("None");
            socket.emit("winner",{"roomId":roomId,"symbol":"None"});
        }
    }
    const resetGame=()=>{
        setGrid(new Array(size).fill(0));
        setWinner("");
    }

    useEffect(()=>{
        checkWin();
    },[grid])
  return (
    <>
    {(winner==="") && <div className='grid'>
        {grid.map((val,idx)=>{
            return <Grid key={idx} val={val} handleClick={()=>{handleClick(idx)}}/>
        })}
    </div>}
    {winner.length!==0 && 
        <div className='modal'>
            <h1>Winner is {winner}!!!!!!</h1>
            <button onClick={resetGame}>Play Again</button>
        </div>}
    </>
    
  )
}

export default Playground