import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { users } from "../../types/types";
import loadingImg from "../../../img/Loading_icon.gif";
import "./leftPanel.css";
type selectConatct = {
  callSelectConatct: any;
};

export function LeftPanel({ callSelectConatct }: selectConatct) {
  const userLogLs = localStorage.getItem("userLog");
  const userLog: users = userLogLs ? JSON.parse(userLogLs) : {};
  const [users, setUsers] = useState<any>([]);
  useEffect(() => {
    async function getUsers() {
      const url = await fetch("http://192.168.68.122:8080/user-list");
      const response = await url.json();
      setUsers(response);
    }

    getUsers();
  }, []);

  const username = useParams();

  return (
    <div className="left_panel">
      <div className="header_left_panel">
        <p>{userLog.username}</p>
      </div>
      <div className="contacts_container">
        {users.length > 0 ? (
          users.map((e: users, i: any) => (
            <div key={i}>
              <Link to={`/direct/${e.username}`}>
                {userLog.username !== e.username && (
                  <div
                    className={
                      e.username === username.username
                        ? "contact_item active"
                        : "contact_item"
                    }
                    onClick={() => callSelectConatct(e)}
                  >
                    <div className="img_contact_left_panel">
                      <span>{e.username[0]}</span>
                    </div>
                    <div className="name_contact">
                      <p>{e.username}</p>
                    </div>
                  </div>
                )}
              </Link>
            </div>
          ))
        ) : (
          <div className="img_loading">
            <img src={loadingImg} alt="loding" width={"25px"} height={"25px"} />
          </div>
        )}
      </div>
    </div>
  );
}
