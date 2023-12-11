import './App.css';
import {useState} from "react";
import Playground from './components/Playground';
import {io} from "socket.io-client"

const socket = io("http://localhost:5000")
socket.on("connect",()=>{
  console.log(socket.id);
})

function App() {
  const [roomId,setRoomId]=useState();
  const [startGame,setStart]=useState(false);
  const handleClick=()=>{
    socket.emit("join_room",roomId);
    setStart(true);
  }
  return (
    <div className="App">
      {!startGame &&<> <label>Enter Room Id : </label>
      <input type="number" onChange={(e)=>setRoomId(e.target.value)} />
      <button onClick={handleClick}>Join</button>
      </>}
      {startGame && <Playground size={9} socket={socket} roomId={roomId}/>}
    </div>
  );
}

export default App;
