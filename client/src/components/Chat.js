// import './App.css'
import io from "socket.io-client";
import { useEffect, useState, useRef} from "react";

const socket = io.connect("http://localhost:3001");

const Chat = ({room, username, socket}) => {  

  // Room State
  // const [room, setRoom] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [existingRooms, setExistingRooms] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [dataWriting, setDataWriting] = useState("");

  // User State
  // const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [listOfMessages, setListOfMessages] = useState([]);

  // const [credentials, setCredentials] = useState({room: '', username: ''});

  const sendMessage = () => {
    const messageTemp = {
      message, room, username
    };
    setListOfMessages((prev) => [...prev, messageTemp]);
    socket.emit("send_message", { message, room, username });
    setMessage("");
  }; 

  const checkWriting = () => {
    console.log("Writing");
    socket.emit("writing", { username, typing: true, room });
  };


  // const fetchExistingRooms = () => {
  //   socket.emit('get_rooms');
  // };

  const leaveRoom = () => {
    socket.emit("leave_room", { room, username });
    // setRoom(""); // Reset the room in the state
    setUsersInRoom([]); // Clear the users in room
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.username !== username) {
        setListOfMessages((prevMessages) => [...prevMessages, data]);
      }
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
      socket.removeListener("receive_message");
      socket.removeListener("show_writing");
      socket.removeListener("show_status");
    };
  }, []);

  return (
    <div className="w-full h-screen flex items-center m-auto">
      <div className="w-3/12 h-screen bg-grey flex flex-col">

      </div>
      <div className="w-9/12 h-screen fkex flex-col">
        <div className=" w-full px-6 py-4 border-grey border-b-2">
          <h2 className="text-green font-display text-xl">Welcome to the "{room}" chatroom</h2>
        </div>
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
      <button className="text-white" onClick={sendMessage}> Send Message </button>
      <h1>Message</h1>
      {listOfMessages.map((message, index) => (
    <div key={index} className={message.username === username ? 'sent-message' : 'received-message'}>
    <p>{message.username}: {message.message}</p>
  </div>
  ))}
      <div className="writing text-white">
          {isWriting ? <p>{dataWriting} is writing..</p> : ""}
        </div>

      <br></br>
      <br></br>
      <button className="text-white" onClick={leaveRoom}> Leave Room </button>
      <h1 className="text-white">Users in Room:</h1>
      <ul>
        {usersInRoom.map((user, index) => (
          <li className="text-white" key={index}>{user}</li>
        ))}
      </ul>
      <br></br>
      <br></br>
      <h1 className="text-white">Existing Rooms:</h1>
      <ul>
        {existingRooms.map((existingRoom, index) => (
          <li key={index}>{existingRoom}</li>
        ))}
      </ul>
    </div>
  )
}

export default Chat
