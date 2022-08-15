import { useState } from "react";
import { users } from "../types/types";
import "./direct.css";
import { LeftPanel } from "./leftPanel/leftPanel";
import { RightPanel } from "./rightPanel/rightPanel";
export function Direct() {
  const [selectContact, setSelectContact] = useState<any>({});
  const callSelectContact = (contact: users) => {
    setSelectContact(contact);
  };
  return (
    <div className="direct">
      <div className="direct_all_container">
        <LeftPanel callSelectConatct={callSelectContact} />
        <RightPanel selectContact={selectContact} />
      </div>
    </div>
  );
}
