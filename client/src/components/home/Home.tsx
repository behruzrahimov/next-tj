import { useEffect, useState } from "react";
import { follow, likes, posts, users } from "../types/types";
import "./Home.css";
import loadingImg from "../../img/Loading_icon.gif";
export function Home() {
  const userLogLs = localStorage.getItem("userLog");
  const userLog: users = userLogLs ? JSON.parse(userLogLs) : {};

  const [posts, setPosts] = useState<any>([]);
  useEffect(() => {
    const getPost = async () => {
      const url = await fetch("http://localhost:8080/posts-list");
      const response = await url.json();
      setPosts(response);
    };
    getPost();
  }, []);

  const [user, setUser] = useState<any>();
  useEffect(() => {
    const getUsers = async () => {
      const url = await fetch("http://localhost:8080/user-list");
      const res = await url.json();
      setUser(res);
    };
    getUsers();
  }, []);

  const [likes, setLikes] = useState<any>();
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      async function getlikes() {
        const url = await fetch("http://localhost:8080/likes-list");
        const response = await url.json();
        setLikes(response);
      }
      getlikes();
    }, 1000);
    return () => {
      clearInterval(rotationInterval);
    };
  }, []);

  const [cntLikes, setCntLikes] = useState<any>();
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      async function getCntLikes() {
        const url = await fetch("http://localhost:8080/cntlike-list");
        const response = await url.json();
        setCntLikes(response);
      }
      getCntLikes();
    }, 1000);
    return () => {
      clearInterval(rotationInterval);
    };
  }, []);

  const [follow, setFollow] = useState<any>();
  useEffect(() => {
    const getFollow = async () => {
      const url = await fetch("http://localhost:8080/follow-list");
      const res = await url.json();
      setFollow(res);
    };
    getFollow();
  }, []);

  const [userSelect, setUserSelect] = useState<any>();
  const [modalUser, setModalUser] = useState<boolean>();

  const userSelectFind: users =
    user &&
    userSelect &&
    user.find((user: users) => {
      return user.id === userSelect;
    });

  let cntPost: number = 0;
  let cntFollowers: number = 0;
  let cntFlowing: number = 0;

  return (
    <div className="home">
      <div className="post_all_container">
        {posts.length > 0 ? (
          posts.map(
            (post: posts, i: any) =>
              post.senderid !== userLog.id &&
              follow &&
              follow.map(
                (follow: follow) =>
                  follow.followerid === post.senderid &&
                  follow.followingid === userLog.id &&
                  follow.follow && (
                    <div className="post_container" key={follow.id}>
                      <div className="post_items">
                        <div className="img_post_main">
                          <div className="text_post_img">
                            <img
                              src={`http://localhost:8080/img-list/${JSON.parse(
                                post.urlimg
                              )}`}
                              alt="imgPost"
                              width={"320px"}
                              height={"100%"}
                              style={{ borderRadius: "10px" }}
                            />
                          </div>
                        </div>
                        <div className="footer_post">
                          <div className="header_post_items">
                            <p className="img_post_item">
                              <span>{post.senderusername[0]}</span>
                            </p>
                            <p
                              className="senderusername_post"
                              onClick={() => {
                                setUserSelect(post.senderid);
                                setModalUser(true);
                              }}
                            >
                              <span>{post.senderusername}</span>
                            </p>
                          </div>
                          <div className="like_conatciner">
                            {likes ? (
                              likes.map(
                                (like: likes, index: any) =>
                                  like.liker === userLog.id &&
                                  like.postid === post.id && (
                                    <p
                                      key={index}
                                      onClick={async () => {
                                        await fetch(
                                          `http://localhost:8080/likes-save`,
                                          {
                                            method: "POST",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              liker: userLog.id,
                                              likerUserName: userLog.username,
                                              postid: post.id,
                                              postlike: true,
                                            }),
                                          }
                                        );

                                        await fetch(
                                          `http://localhost:8080/cntlike-save`,
                                          {
                                            method: "POST",
                                            headers: {
                                              "Content-Type":
                                                "application/json",
                                            },
                                            body: JSON.stringify({
                                              postid: post.id,
                                              liker: userLog.id,
                                            }),
                                          }
                                        );
                                      }}
                                      className={
                                        like.postlike
                                          ? "icon-heart"
                                          : "icon-heart-o"
                                      }
                                    ></p>
                                  )
                              )
                            ) : (
                              <p className="icon-heart-o"></p>
                            )}
                            <div>
                              {cntLikes &&
                                cntLikes.map(
                                  (cnt: any) =>
                                    cnt.postid === post.id && (
                                      <p key={cnt.id}>{cnt.cnt}</p>
                                    )
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
              )
          )
        ) : (
          <div className="img_loading">
            <img src={loadingImg} alt="loding" width={"25px"} height={"25px"} />
          </div>
        )}
      </div>
      <div
        className={modalUser ? "modal_user_select active" : "modal_user_select"}
      >
        {userSelectFind && (
          <div className="modal_user__select_container">
            <p
              className="close_modal_user__select_container"
              onClick={() => setModalUser(false)}
            >
              <span className="icon-close"></span>
            </p>
            <div className="modal_user__header_img_name">
              <div className="header_img_border">
                <div className="circle__img">
                  <p className="user_img_zero">{userSelectFind.username[0]}</p>
                </div>
              </div>
              <p className="user_name__header">{userSelectFind.username}</p>
              <div className="post_follow_user__modal">
                <div className="user_modal__post">
                  {posts &&
                    posts.forEach((post: posts) => {
                      if (post.senderid === userSelectFind.id) {
                        cntPost++;
                      }
                    })}
                  <p>{cntPost}</p>
                  <p className="post_name_modal__user">Posts</p>
                </div>
                <div className="user_flowers_user__modal">
                  {follow &&
                    follow.forEach((follow: follow) => {
                      if (
                        follow.followerid === userSelectFind.id &&
                        follow.follow
                      ) {
                        cntFollowers++;
                      }
                    })}
                  <p>{cntFollowers}</p>
                  <p className="link_name_followers">Followers</p>
                </div>
                <div className="user_flowing_modal_following">
                  {follow &&
                    follow.forEach((follow: follow) => {
                      if (
                        follow.followingid === userSelectFind.id &&
                        follow.follow
                      ) {
                        cntFlowing++;
                      }
                    })}
                  <p>{cntFlowing}</p>
                  <p className="link_name_following">Following</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
