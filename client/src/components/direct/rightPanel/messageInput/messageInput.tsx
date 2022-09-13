import { useState } from "react";
import { selectContactType, users } from "../../../types/types";
import "./messageInput.css";
import { IoMdSend } from "react-icons/io";
import { MdKeyboardVoice } from "react-icons/md";
export function MessageInput({ selectContact }: selectContactType) {
  const [textMessage, setTextMessage] = useState<string>("");
  const onTextMessageChange = (e: any) => {
    setTextMessage(e.target.value);
  };
  const userLogLs = localStorage.getItem("userLog");
  const userLog: users = userLogLs ? JSON.parse(userLogLs) : {};

  const sendMessage = () => {
    if (textMessage.trim()) {
      fetch(`http://localhost:8080/messages-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: userLog.id,
          receiver: selectContact.id,
          text: textMessage,
        }),
      });
      setTextMessage("");
    }
  };
  const onKeyPressFunc = (event: any) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="message_input">
      <div className="message_input_container">
        <input
          onKeyPress={onKeyPressFunc}
          type="text"
          placeholder="write a message"
          value={textMessage}
          onChange={onTextMessageChange}
        />

        <button className="send_button_message" onClick={sendMessage}>
          <span
            className={textMessage.trim() ? "icon-send" : "icon-keyboard_voice"}
          >
            {textMessage.trim() ? <IoMdSend /> : <MdKeyboardVoice />}
          </span>
        </button>
      </div>
    </div>
  );
}
