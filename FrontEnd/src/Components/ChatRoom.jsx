import CallIcon from "@mui/icons-material/Call";
import SearchIcon from "@mui/icons-material/Search";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import AccountBoxSharpIcon from "@mui/icons-material/AccountBoxSharp";
import SendIcon from "@mui/icons-material/Send";
//
import { useState, useRef, useEffect } from "react";
import "../Styles/ChatRoom.css";
import AuthStore from "../lib/Store/AuthStore.js";
import ChatStore from "../lib/Store/ChatStore.js";
import MessageGrid from "./MessageGrid.jsx";

//

const ChatRoom = () => {
  //

  const authUser = AuthStore((s) => s.authUser);
  const socket = AuthStore((s) => s.socket);
  const onlineUsers = AuthStore((s) => s.onlineUsers);

  const selectedUser = ChatStore((s) => s.selectedUser);
  const sendMessage = ChatStore((s) => s.sendMessage);
  const messages = ChatStore((s) => s.messages);

  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const scrollDiv = useRef();
  const messageRef = useRef();

  const HandleMessageSubmit = () => {
    socket.emit("send_group_message", {
      groupId: selectedUser._id,
      senderId: authUser._id,
      content: message,
    });
    const payload = {
      groupId: selectedUser._id,
      message: message,
      media: file,
    };
    sendMessage(payload);
    console.log(scrollDiv.current);

    scrollDiv.current?.scrollTo({
      top: scrollDiv.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    scrollDiv.current?.scrollTo({
      top: scrollDiv.current.scrollHeight,
      behavior: "smooth",
    });
    console.log(selectedUser, onlineUsers);
  }, [selectedUser, onlineUsers]);

  return (
    <>
      {selectedUser === null ? (
        <div>select a chat</div>
      ) : (
        <div id="chat_room_container">
          <header>
            <div id="ch_h_pfp_div">
              {selectedUser.Group_avatar === "" ? (
                <AccountBoxSharpIcon id="AccountBoxSharpIcon" />
              ) : (
                <img src={selectedUser.Group_avatar}></img>
              )}
            </div>
            <div id="ch_h_name_lastSeen_div">
              <h5>{selectedUser.name}</h5>
              <h6>
                {selectedUser.users.some((user) =>
                  onlineUsers.includes(user._id)
                ) == true
                  ? "online"
                  : "offline"}
              </h6>
            </div>
            <div id="ch_h_options_div">
              <div className="ch_h_option">
                <CallIcon color="string" id="CallIcon" />
              </div>
              <div className="ch_h_option">
                <SearchIcon id="SearchIcon" />
              </div>
              <div className="ch_h_option">
                <MoreHorizIcon id="MoreHorizoIcon" />
              </div>
            </div>
          </header>
          <div id="ch_main_div">
            <div id="ch_main_inner_div" ref={scrollDiv}>
              {/*  */}
              {messages.map((item) => (
                <MessageGrid ref={messageRef} message={item} />
              ))}
              {/*  */}
            </div>
          </div>
          <footer>
            <div id="ch_f_addButton">
              {/* <AddIcon id="AddIcon" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#ffffff"
              >
                <path d="M720-330q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5 21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
              </svg>
            </div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              id="ch_f_input"
              type="text"
              placeholder="write a message"
            ></input>
            <div className="hello"></div>

            <div
              id="ch_f_sendButton"
              onClick={() => HandleMessageSubmit()}
              type="submit"
            >
              <SendIcon id="SendIcon" />
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default ChatRoom;
