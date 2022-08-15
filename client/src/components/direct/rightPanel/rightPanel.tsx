import { selectContactType } from "../../types/types";
import { HeaderRightPanel } from "./headerRightPanel/headerRightPanel";
import { MessageInput } from "./messageInput/messageInput";
import { MessageList } from "./messageList/messageList";
import "./rightPanel.css";

export function RightPanel({ selectContact }: selectContactType) {
  return (
    <div className="right_panel">
      {selectContact.username ? (
        <>
          <HeaderRightPanel selectContact={selectContact} />
          <MessageList selectContact={selectContact} />
          <MessageInput selectContact={selectContact} />
        </>
      ) : (
        <div className="choose_contacts">
          <p>Select Contact</p>
        </div>
      )}
    </div>
  );
}
