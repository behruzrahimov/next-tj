import { selectContactType } from "../../../types/types";
import "./headerRightPanel.css";
export function HeaderRightPanel({ selectContact }: selectContactType) {
  return (
    <div className="header_right_panel">
      <div className="username_select_conatct">
        <div className="contact_img_header_message">
          <p>{selectContact.username[0]}</p>
        </div>
        <h3>{selectContact.username}</h3>
      </div>
    </div>
  );
}
