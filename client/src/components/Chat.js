// import './App.css'
import { useEffect, useState} from "react";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { BiArrowToLeft } from "react-icons/bi";

// const socket = io.connect("http://localhost:3001");

const Chat = ({room, username, socket}) => {  

  // Room State
  // const [room, setRoom] = useState("");
  const [usersInRoom, setUsersInRoom] = useState([]);
  const [isWriting, setIsWriting] = useState(false);
  const [dataWriting, setDataWriting] = useState("");
  // const [countUsers, setCountUsers] = useState(0);

  // User State
  // const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  // const [messageReceived, setMessageReceived] = useState("");
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
    window.location.reload(); // This reloads the entire page
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Call your function here
      sendMessage();
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.username !== username) {
        setListOfMessages((prevMessages) => [...prevMessages, data]);
      }
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
  }, [socket, username]);

  return (
    <div className="w-full h-screen flex items-center m-auto" onKeyDown={handleKeyPress}>
      <div className="w-3/12 h-screen bg-grey flex flex-col">
        <div className='w-full h-screen'>
          <h2 className="font-display font-semibold text-white text-xl px-6 py-4">Chat App</h2>
          <div className="w-full px-6 py-4 flex flex-col">
            <ul>
              {usersInRoom.map((user, index) => (
                <li className="text-white text-lg font-mont mb-3 border-b-2 border-b-grey-2 pb-2 transition-text duration-300 hover:text-green hover:cursor-pointer" key={index}>{user}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className='w-full h-16 bg-black border-t-2 border-t-green px-4 py-2 flex flex-row'>
          <div className="flex-col w-5/6">
            <h3 className='text-white font-display text-lg transition-text duration-300 hover:text-green hover:cursor-pointer'>{username}</h3>
            <h3 className='text-white font-display text-sm text-grey-2 opacity-60'>@{socket.id}</h3>
          </div>
          <div className="w-1/6 flex items-center justify-end">
            <button className="text-white bg-grey-2 px-2 py-1 rounded-xl text-2xl font flex justify-center transition-bg transition-text duration-300 hover:text-black hover:bg-green" onClick={leaveRoom}> <BiArrowToLeft /> </button>
          </div>
        </div>
      </div>
      <div className="w-9/12 h-screen flex flex-col">
        <div className=" w-full px-6 py-4 border-grey border-b-2 fixed">
          <h2 className="text-green font-display font-bold text-xl bg-black">Welcome to the "{room}" chatroom</h2>
        </div>
        <div className="w-full h-screen flex flex-col px-6 py-4">
            <div className="w-full h-full flex flex-col mt-14 chatbox overflow-y-auto justify-end">
            {listOfMessages.map((message, index) => (
                <div key={index} className={message.username === username ? 'w-full flex justify-start flex-row-reverse' : 'w-full flex justify-start'}>
                  <div className="mx-3 avatar" ><InitialsAvatar name={message.username} /></div>
                  <div key={index} className={message.username === username ? 'bg-green text-black text-lg font-mont flex flex-col w-7/12 px-4 py-2 mb-2 rounded-3xl rounded-br-none items-end' : 'bg-grey-2 text-white text-lg font-mont flex flex-col w-7/12 px-4 py-2 mb-2 rounded-3xl rounded-bl-none items-start'}>
                    <p>{message.message}</p>
                    {/* <p className="text-sm">{message.username}</p> */}
                  </div>
                </div>
              ))}
            </div>
            <div className="writing text-white mb-1">
              {isWriting ? <p>{dataWriting} is writing..</p> : ""}
            </div>
            <div className="w-full h-10 border-2 border-green rounded-3xl px-4 py-2 flex items-center">
              <input placeholder="Message..."
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                onKeyDown={checkWriting}
                onKeyUp={() => {
                  socket.emit("writing_status", { room, status: false });
                }}
                className="bg-black w-10/12 font-mont focus:outline-none focus:shadow-outline text-white"
                />
                <button className="text-green w-2/12 ml-14" onClick={sendMessage}> Send Message </button>
            </div>
        </div>
      </div>
      {/* <br></br>
      <br></br>
      <br></br>
      <br></br> */}
      {/* <h1 className="text-white">Existing Rooms:</h1>
      <ul>
        {existingRooms.map((existingRoom, index) => (
          <li key={index}>{existingRoom}</li>
        ))}
      </ul> */}
    </div>
  )
}

export default Chat
