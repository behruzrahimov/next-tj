import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { Auth } from "./components/Auth/Auth";
import { Direct } from "./components/direct/direct";
import { Home } from "./components/home/Home";
import { Navigation } from "./components/Navigation/navigation";
import { Post } from "./components/Post/post";
import { follow, users } from "./components/types/types";
import loadingImg from "./img/Loading_icon.gif";
import { ImExit } from "react-icons/im";
import { Profile } from "./components/profile/profile";
import { PageNotFind } from "./components/404/404-page";
import { BsSearch } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
export default function App() {
  const loginedLS = localStorage.getItem("logined");
  const logined: boolean = loginedLS ? JSON.parse(loginedLS) : false;
  const userLogLS = localStorage.getItem("userLog");
  const userLog: users = userLogLS ? JSON.parse(userLogLS) : {};

  const exitLog = () => {
    localStorage.removeItem("userLog");
    localStorage.removeItem("logined");
    window.location.reload();
  };

  const [users, setUsers] = useState<any>();
  useEffect(() => {
    const getUsers = async () => {
      const url = await fetch("http://localhost:8080/user-list");
      const res = await url.json();
      setUsers(res);
    };
    getUsers();
  }, []);

  const [searchUser, setSearchUser] = useState<string>("");
  const [modalUser, setModalUser] = useState<boolean>(false);
  const onSearchChange = (e: any) => {
    setSearchUser(e.target.value);
    if (e.target.value !== "") {
      setModalUser(true);
    } else {
      setModalUser(false);
    }
  };

  const [follow, setFollow] = useState<any>();
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      async function getFollow() {
        const url = await fetch("http://localhost:8080/follow-list");
        const response = await url.json();
        setFollow(response);
      }
      getFollow();
    }, 1000);
    return () => {
      clearInterval(rotationInterval);
    };
  }, []);
  let followText: string = "";
  let cntUsers: number = 0;
  return (
    <div className="App">
      {logined && (
        <div className="header_app">
          <div className="logo">NEXT</div>
          <div className="search">
            <span className="icon-search">
              <BsSearch />
            </span>
            <input
              className="input_search"
              type="text"
              placeholder="Search users"
              onChange={onSearchChange}
              value={searchUser}
            />

            <div className={modalUser ? "modal_users active" : "modal_users"}>
              <div
                className="exit_modal_user"
                onClick={() => {
                  setModalUser(false);
                  setSearchUser("");
                }}
              >
                <p className="icon-close">
                  <AiOutlineCloseCircle />
                </p>
              </div>
              <div className="modal_user_container">
                <div className="header_container_modal_user">
                  <p>Users</p>
                </div>

                <div className="users_modal_user">
                  {users ? (
                    users.map(
                      (user: users) =>
                        user.username.indexOf(searchUser.toLocaleLowerCase()) >
                          -1 &&
                        user.id !== userLog.id && (
                          <div key={user.id} className="user_item_modal">
                            <p style={{ display: "none" }}>{cntUsers++}</p>
                            <div className="img_name_user_modal">
                              <p className="img_user_modal">
                                {user.username[0]}
                              </p>
                              <p className="name_user_modal">{user.username}</p>
                            </div>
                            <div className="flow">
                              <button
                                onClick={() => {
                                  fetch(`http://localhost:8080/follow-save`, {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      followerid: user.id,
                                      followerusername: user.username,
                                      followingid: userLog.id,
                                      followingusername: userLog.username,
                                      follow: true,
                                    }),
                                  });
                                }}
                              >
                                {follow &&
                                  follow.map((follow: follow) => {
                                    if (
                                      follow.followerid === user.id &&
                                      follow.followingid === userLog.id
                                    ) {
                                      return (
                                        <p key={follow.id}>
                                          {follow.follow
                                            ? (followText = "Following")
                                            : (followText = "Follow")}
                                        </p>
                                      );
                                    }
                                    return <div key={follow.id}></div>;
                                  })}
                                {followText ? null : "Follow"}
                              </button>
                            </div>
                          </div>
                        )
                    )
                  ) : (
                    <div className="loading_img">
                      <img
                        src={loadingImg}
                        alt="loading"
                        width={"25px"}
                        height={"25px"}
                      />
                    </div>
                  )}
                </div>
                <div
                  style={
                    cntUsers === 0 ? { display: "block" } : { display: "none" }
                  }
                >
                  User "{searchUser}" not find
                </div>
              </div>
            </div>
          </div>
          <div className="nav">
            <Navigation />
          </div>
          <div className="exit_user" onClick={exitLog}>
            <p>
              <ImExit /> <span>Exit</span>
            </p>
          </div>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={logined ? <Home /> : <Navigate to="/login" />}
        />

        <Route
          path={"/login"}
          element={!logined ? <Auth /> : <Navigate to="/" />}
        />

        <Route
          path={"/post"}
          element={logined ? <Post /> : <Navigate to="/login" />}
        />

        <Route path="/direct">
          <Route
            path=":username"
            element={logined ? <Direct /> : <Navigate to="/login" />}
          />
        </Route>

        <Route path="/user">
          <Route
            path=":id"
            element={logined ? <Profile /> : <Navigate to="/login" />}
          />
        </Route>

        <Route path="*" element={<PageNotFind />} />
        <Route path="/user/" element={<PageNotFind />} />
        <Route path="/direct/" element={<PageNotFind />} />
      </Routes>
    </div>
  );
}
