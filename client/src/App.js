import './App.css'
import io from "socket.io-client";
import { useEffect, useState, useRef} from "react";
import Chat from './components/Chat';

const socket = io.connect("http://localhost:3001");

function App() {  

  // Room State
  const [room, setRoom] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [existingRooms, setExistingRooms] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [dataWriting, setDataWriting] = useState("");

  const [username, setUsername] = useState("");

  // const [credentials, setCredentials] = useState({room: "", username: ""});
  const [showChat, setShowChat] = useState(false)

  const ref1 = useRef();
  const ref2 = useRef();
  const joinRoom = () => {
    if (room !== "" && username !== "") {
      socket.emit("join_room", { room, username });
      setShowChat(true);
    } else {
      return alert('Please filll in both fields')
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  return (

    <div className="App">
      -{!showChat && (
        <div>
        <input
          placeholder="Username..."
          ref={ref1}
          onChange={handleUsernameChange}
        />
        <input
          placeholder="Room..."
          ref={ref2}
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={joinRoom}> Join this Room </button>
      </div>
      )}

      {showChat && <Chat room={room} username={username} socket={socket} />}
    </div>
  )
}

export default App
