import { Link, useNavigate } from "react-router-dom";
import "./navigation.css";
import { SiGooglemessages } from "react-icons/si";
import { users } from "../types/types";
import { CgFeed } from "react-icons/cg";
import { MdOutlinePostAdd } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
export function Navigation() {
  useNavigate();
  const userLogLs = localStorage.getItem("userLog");
  const userLog: users = userLogLs ? JSON.parse(userLogLs) : {};
  return (
    <div className="navigation">
      <li>
        <Link
          to="/"
          className={
            window.location.href[window.location.href.length - 1] === "/"
              ? "link active"
              : "link"
          }
        >
          <p className="icon-th-large">
            <CgFeed /> <span>Feed</span>
          </p>
        </Link>
      </li>
      <li>
        <Link
          to={"/direct/0"}
          className={
            window.location.href.indexOf("direct") > -1 ? "link active" : "link"
          }
        >
          <p>
            <SiGooglemessages />
            <span>Direct</span>
          </p>
        </Link>
      </li>
      <li>
        <Link
          to="/post"
          className={
            window.location.href.indexOf("post") > -1 ? "link active" : "link"
          }
        >
          <p className="icon-control_point">
            <MdOutlinePostAdd />
            <span>Post</span>
          </p>
        </Link>
      </li>
      <li>
        <Link
          to={`/user/${userLog.id}`}
          className={
            window.location.href.indexOf("user") > -1 ? "link active" : "link"
          }
        >
          <p className="icon-user">
            <FaUserAlt />
            <span>{userLog.username}</span>
          </p>
        </Link>
      </li>
    </div>
  );
}
