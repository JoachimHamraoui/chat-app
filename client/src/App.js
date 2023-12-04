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

  useEffect(() => {
  
  }, []);

  return (

    <div className='w-full h-screen bg-black'>
        {!showChat && (
          <div className='w-4/12 h-screen flex items-center m-auto'>
          <div className='w-full flex flex-col'>
            <h1 className='font-display font-semibold text-green text-4xl mb-5'>Chat App.</h1>
            {/* <label htmlFor='username' className='text-white mb-2 px-4 font-mont'>Choose a Username</label> */}
            <input
              placeholder="Username..."
              ref={ref1}
              onChange={handleUsernameChange}
              className='bg-black border-2 border-green px-4 py-2 rounded-3xl font-mont focus:outline-none focus:shadow-outline text-white mb-4' name='username' id='username'
              />
              {/* <label htmlFor='room' className='text-white mb-2 px-4 font-mont'>Join a Room</label>  */}
            <input
              placeholder="Room..."
              ref={ref2}
              onChange={(event) => {
                setRoom(event.target.value);
              }}
              className='bg-black border-2 border-green px-4 py-2 rounded-3xl font-mont focus:outline-none focus:shadow-outline text-white mb-4' name='room' id='room'
            />
            <button onClick={joinRoom} className='bg-black border-2 border-white px-4 py-2 rounded-3xl font-mont font-semi focus:outline-none focus:shadow-outline text-white transition-bg duration-300 hover:bg-white hover:text-black'> Join this Room </button>
          </div>
          </div>
      )}

      {showChat && <Chat room={room} username={username} socket={socket} />}
      {/* {showChat && <button onClick={leaveRoom}> Leave Room </button>} */}
    </div>
  )
}

export default App
