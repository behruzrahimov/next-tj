import { useState, useEffect } from "react";
import "./Auth.css";
import loadinggif from "../../img/Loading_icon.gif";
import { posts, users } from "../types/types";
export function Auth() {
  const [auth, setAuth] = useState<boolean>(true);
  const [reg, setReg] = useState<boolean>(false);
  const [modalRegAuth, setModalRegAuth] = useState<boolean>(true);
  const [users, setUsers] = useState<any>(0);
  const [errReg, setErrReg] = useState<string>("");
  const [errAuth, setErrAuth] = useState<string>("");
  const [logined, setLogined] = useState<boolean>(false);
  const [userReg, setUserReg] = useState<any>({
    name: "",
    firstname: "",
    date: "",
    number: "",
    usernameReg: "",
    passwordReg: "",
    rePassword: "",
  });

  const [userAuth, setUserAuth] = useState<any>({
    usernameAuth: "",
    passwordAuth: "",
  });
  const [posts, setPosts] = useState<any>();
  useEffect(() => {
    const getPost = async () => {
      const url = await fetch("http://localhost:8080/posts-list");
      const response = await url.json();
      setPosts(response);
    };
    getPost();
  }, []);

  useEffect(() => {
    async function getUsers() {
      const url = await fetch("http://localhost:8080/user-list");
      const response = await url.json();
      setUsers(response);
    }

    getUsers();
  }, [auth]);

  const onUsernameAuthChange = (e: any) => {
    setUserAuth({
      ...userAuth,
      usernameAuth: e.target.value,
    });
  };

  const onPasswordAuthChange = (e: any) => {
    setUserAuth({
      ...userAuth,
      passwordAuth: e.target.value,
    });
  };

  const onNameChange = (e: any) => {
    setUserReg({
      ...userReg,
      name: e.target.value,
    });
  };

  const onFirstnameChange = (e: any) => {
    setUserReg({
      ...userReg,
      firstname: e.target.value,
    });
  };

  const onNumberChange = (e: any) => {
    setUserReg({
      ...userReg,
      number: e.target.value,
    });
  };

  const onDateChange = (e: any) => {
    setUserReg({
      ...userReg,
      date: e.target.value,
    });
  };

  const onUsernameRegChange = (e: any) => {
    setUserReg({
      ...userReg,
      usernameReg: e.target.value,
    });
  };

  const onPasswordRegChange = (e: any) => {
    setUserReg({
      ...userReg,
      passwordReg: e.target.value,
    });
  };

  const onRePasswordChange = (e: any) => {
    setUserReg({
      ...userReg,
      rePassword: e.target.value,
    });
  };
  const sendUserReg = async () => {
    if (
      userReg.name.trim() &&
      userReg.firstname.trim() &&
      userReg.number.trim() &&
      userReg.date.trim() &&
      userReg.passwordReg.trim() &&
      userReg.rePassword.trim() &&
      userReg.usernameReg.trim()
    ) {
      if (userReg.passwordReg === userReg.rePassword && userReg.usernameReg) {
        let cnt = 0;

        users.forEach((u: any) => {
          if (u.username === userReg.usernameReg) {
            cnt++;
          }
        });

        if (cnt === 0) {
          await fetch(`http://localhost:8080/user-reg`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: userReg.name,
              firstname: userReg.firstname,
              number: userReg.number,
              date: userReg.date,
              usernameReg: userReg.usernameReg,
              passwordReg: userReg.passwordReg,
              rePassword: userReg.rePassword,
            }),
          });

          (await posts) &&
            posts.forEach(async (post: posts) => {
              await fetch(`http://localhost:8080/likes-save`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  liker: users ? users[users.length - 1].id + 1 : 1,
                  likerUserName: "",
                  postid: post.id,
                  postlike: false,
                }),
              });
            });

          users &&
            users.forEach(async (user: users) => {
              fetch(`http://localhost:8080/follow-save`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  followerid: user.id,
                  followingid: users ? users[users.length - 1].id + 1 : 1,
                  followerusername: "",
                  followingusername: "",
                  follow: false,
                }),
              });

              fetch(`http://localhost:8080/follow-save`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  followerid: users ? users[users.length - 1].id + 1 : 1,
                  followingid: user.id,
                  followerusername: "",
                  followingusername: "",
                  follow: false,
                }),
              });
            });

          setErrReg("");
          setUserReg({
            ...userReg,
            name: "",
            firstname: "",
            number: "",
            date: "",
            usernameReg: "",
            passwordReg: "",
            rePassword: "",
          });
          setAuth(true);
          setReg(false);
          setErrAuth("");
          window.location.reload();
        } else {
          setErrReg("Это имя уже зайнита");
        }
      } else {
        setErrReg("Password is invalid");
      }
    } else {
      setErrReg("Зополните все полии");
    }
  };

  const login = () => {
    users &&
      users.forEach((u: users) => {
        if (
          u.username === userAuth.usernameAuth &&
          u.password === userAuth.passwordAuth
        ) {
          localStorage.setItem("userLog", JSON.stringify(u));
          setAuth(false);
          setReg(false);
          setModalRegAuth(false);
          setLogined(true);
          window.location.reload();
        } else {
          setErrAuth("Пароль или логин неверно");
        }
      });
  };
  localStorage.setItem("logined", JSON.stringify(logined));
  return (
    <div className="login">
      <div style={!modalRegAuth ? { display: "block" } : { display: "none" }}>
        <img src={loadinggif} alt="loading" width="50px" height="50px" />
      </div>
      <div className={`${modalRegAuth ? "auth_reg active" : "auth_reg"}`}>
        <div className={`${auth ? "auth active" : "auth"}`}>
          {auth ? <h3>Authorization</h3> : null}
          <input
            className="username_auth"
            type="text"
            placeholder="UserName"
            onChange={onUsernameAuthChange}
            value={userAuth.usernameAuth}
          />
          <input
            className="password_auth"
            type="password"
            placeholder="Password"
            onChange={onPasswordAuthChange}
            value={userAuth.passwordAuth}
          />
          <p style={{ color: "red" }}>{auth && errAuth}</p>
          <button onClick={login} className="login_button">
            Login
          </button>
        </div>
        <div className={`${reg ? "reg active" : "reg"}`}>
          {reg ? <h3> Registration</h3> : null}
          <input
            className="name"
            type="text"
            placeholder="Name"
            onChange={onNameChange}
            value={userReg.name}
          />
          <input
            className="firstname"
            type="text"
            placeholder="Surname"
            onChange={onFirstnameChange}
            value={userReg.firstname}
          />
          <input
            className="number"
            type="text"
            placeholder="Number Phone"
            onChange={onNumberChange}
            value={userReg.number}
          />
          <input
            className="date"
            type="date"
            placeholder="Data Of Birth"
            onChange={onDateChange}
            value={userReg.date}
          />
          <input
            className="username_reg"
            type="text"
            placeholder="Create a Username"
            onChange={onUsernameRegChange}
            value={userReg.usernameReg}
          />
          <input
            className="password_reg"
            type="password"
            placeholder="Create a Password"
            onChange={onPasswordRegChange}
            value={userReg.passwordReg}
          />
          <input
            className="repassword"
            type="password"
            placeholder="RePassword"
            onChange={onRePasswordChange}
            value={userReg.rePassword}
          />
          <p style={{ color: "red" }}>{reg && errReg}</p>
          <button className="reg_button" onClick={sendUserReg}>
            Registration
          </button>
        </div>

        <div className="create_acc">
          {!auth && !reg ? null : (
            <>
              {auth ? (
                <p
                  onClick={() => {
                    setAuth(false);
                    setReg(true);
                  }}
                >
                  Registration
                </p>
              ) : (
                <p
                  onClick={() => {
                    setAuth(true);
                    setReg(false);
                  }}
                >
                  Authorization
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
