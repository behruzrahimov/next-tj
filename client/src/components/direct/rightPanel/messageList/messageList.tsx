import { useEffect, useState } from "react";
import { messages, selectContactType, users } from "../../../types/types";
import "./messageList.css";
export function MessageList({ selectContact }: selectContactType) {
  const [messages, setMessages] = useState<any>();
  const userLogLs = localStorage.getItem("userLog");
  const userLog: users = userLogLs ? JSON.parse(userLogLs) : {};
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      async function getMessages() {
        const url = await fetch("http://192.168.68.122:8080/messages-list");
        const response = await url.json();
        setMessages(response);
      }
      getMessages();
    }, 500);
    return () => {
      clearInterval(rotationInterval);
    };
  }, []);

  let cnt = 0;
  return (
    <div className="message_list">
      {messages &&
        messages.map((e: messages, index: any) => (
          <div className="message_index" key={index}>
            {(e.receiver === selectContact.id && e.sender === userLog.id) ||
            (e.sender === selectContact.id && e.receiver === userLog.id) ? (
              <div
                className="container_messages"
                style={
                  e.receiver === selectContact.id
                    ? { justifyContent: "flex-end" }
                    : { justifyContent: "flex-start" }
                }
              >
                <p style={{ display: "none" }}>{cnt++}</p>
                {e.sender === userLog.id ? (
                  <div className="message_show_list">
                    <p className="message_text">{e.text}</p>
                    <p
                      style={{
                        backgroundColor: "#20293C",
                        color: "white",
                        textTransform: "uppercase",
                        fontWeight: "700",
                      }}
                      className="user_message_img"
                    >
                      {userLog.username[0]}
                    </p>
                  </div>
                ) : (
                  <div className="message_show_list">
                    <p
                      style={{
                        backgroundColor: "#20293C",
                        color: "white",
                        textTransform: "uppercase",
                        fontWeight: "700",
                      }}
                      className="user_message_img"
                    >
                      {selectContact.username[0]}
                    </p>
                    <p className="message_text">{e.text}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}
      {!cnt && (
        <div className="no_message">
          <p>write a message...</p>
        </div>
      )}
    </div>
  );
}
