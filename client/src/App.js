import './App.css'
import io from "socket.io-client";
import { useEffect, useState, useRef} from "react";

const socket = io.connect("http://localhost:3001");

function App() {  

  // Room State
  const [room, setRoom] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [existingRooms, setExistingRooms] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [dataWriting, setDataWriting] = useState("");


  // User State
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [listOfMessages, setListOfMessages] = useState([]);

  const ref = useRef();
  const sendMessage = () => {
    const messages = {
      message, room, username
    };
    setListOfMessages((prev) => [...prev, messages]);
    socket.emit("send_message", { message, room, username });
    setMessage("");
  }; 

  const checkWriting = () => {
    console.log("Writing");
    socket.emit("writing", { username, typing: true, room });
  };

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", { room, username });
    }
  };

  // const fetchExistingRooms = () => {
  //   socket.emit('get_rooms');
  // };

  const leaveRoom = () => {
    socket.emit("leave_room", { room, username });
    setRoom(""); // Reset the room in the state
    setUsersInRoom([]); // Clear the users in room
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.username + ": " + data.message);
    });

    socket.on('existing_rooms', (rooms) => {
      setExistingRooms(rooms);
    });

    socket.on("users_in_room", (users) => {
      setUsersInRoom(users);
    });


    socket.on("show_writing", (status) => {
      if (status.typing) {
        clearTimeout();
        setDataWriting(status.username);
        setIsWriting(true);
      }
    });

    socket.on("show_status", (status) => {
      if (!status) {
        clearTimeout();
        setTimeout(() => {
          setDataWriting("");
          setIsWriting(false);
        }, 3000);
      }
    });

    return () => {
      socket.removeListener("getMessages");
      socket.removeListener("showWriting");
      socket.removeListener("showStatus");
    };
  }, []);

  return (
    <div className="App">
      <div>
        <input
          placeholder="Username..."
          onChange={handleUsernameChange}
        />
        <input
          placeholder="Room..."
          onChange={(event) => {
            setRoom(event.target.value);
          }}
        />
        <button onClick={joinRoom}> Join this Room </button>
      </div>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
        onKeyDown={checkWriting}
            onKeyUp={() => {
              socket.emit("writing_status", { room, status: false });
            }}
      />
      <button onClick={sendMessage}> Send Message </button>
      <h1>Message</h1>
      <p>{messageReceived}</p>

      <div className="writing">
          {isWriting ? <p>{dataWriting} is writing..</p> : ""}
        </div>

      <br></br>
      <br></br>
      <button onClick={leaveRoom}> Leave Room </button>
      <h1>Users in Room:</h1>
      <ul>
        {usersInRoom.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
      <br></br>
      <br></br>
      <h1>Existing Rooms:</h1>
      <ul>
        {existingRooms.map((existingRoom, index) => (
          <li key={index}>{existingRoom}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
