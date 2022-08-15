import { useEffect, useState } from "react";
import { CgFeed } from "react-icons/cg";
import { follow, likes, posts, users } from "../types/types";
import "./profile.css";
export function Profile() {
  const userLogLs = localStorage.getItem("userLog");
  const userLog: users = userLogLs ? JSON.parse(userLogLs) : [];
  let cntPost: number = 0;
  let cntFollowers: number = 0;
  let cntFlowing: number = 0;

  // const [users, setUsers] = useState<any>();
  // useEffect(() => {
  //   const getUsers = async () => {
  //     const url = await fetch("http://localhost:8080/user-list");
  //     const res = await url.json();
  //     setUsers(res);
  //   };
  //   getUsers();
  // }, []);

  const [posts, setPosts] = useState<any>();
  useEffect(() => {
    const getUsers = async () => {
      const url = await fetch("http://localhost:8080/posts-list");
      const res = await url.json();
      setPosts(res);
    };
    getUsers();
  }, []);

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

  const [modalFollowers, setModalFollowers] = useState<boolean>(false);
  const [modalFollowing, setModalFollowing] = useState<boolean>(false);
  return (
    <div className="user">
      <div className="user_container">
        <div className="user_img_border">
          <div className="user_img">
            <span>{userLog.username[0]}</span>
          </div>
        </div>
        <div className="user_name">
          <p>
            {userLog.name} {userLog.firstname}
          </p>
        </div>
        <div className="user_username">
          <p>@{userLog.username}</p>
        </div>
        <div className="user_post_flow">
          <div className="user_post">
            {posts &&
              posts.forEach((post: posts) => {
                if (post.senderid === userLog.id) {
                  cntPost++;
                }
              })}
            <p>{cntPost}</p>
            <p className="link_name">Posts</p>
          </div>
          <div
            className="user_flowers"
            onClick={() => {
              setModalFollowers(true);
            }}
          >
            {follow &&
              follow.forEach((follow: follow) => {
                if (follow.followerid === userLog.id && follow.follow) {
                  cntFollowers++;
                }
              })}
            <p>{cntFollowers}</p>
            <p className="link_name">Followers</p>
          </div>

          <div
            className={
              modalFollowers ? "followers_modal active" : "followers_modal"
            }
          >
            <div
              className="close_modal_followers"
              onClick={() => {
                setModalFollowers(false);
              }}
            >
              <p className="icon-close"></p>
            </div>

            <div className="followers_modal_container">
              <div className="header_dollowers_modal_container">
                <h3>Followers</h3>
              </div>
              <div className="followers_item_container">
                {follow &&
                  follow.map(
                    (follow: follow) =>
                      follow.followerid === userLog.id &&
                      follow.follow && (
                        <div key={follow.id} className="followers_item">
                          <div className="img_followers">
                            {follow.followingusername[0]}
                          </div>
                          <p>{follow.followingusername}</p>
                        </div>
                      )
                  )}
              </div>
            </div>
          </div>

          <div
            className="user_flowing"
            onClick={() => {
              setModalFollowing(true);
            }}
          >
            {follow &&
              follow.forEach((follow: follow) => {
                if (follow.followingid === userLog.id && follow.follow) {
                  cntFlowing++;
                }
              })}
            <p>{cntFlowing}</p>
            <p className="link_name">Following</p>
          </div>
          <div
            className={
              modalFollowing ? "following_modal active" : "following_modal"
            }
          >
            <div
              className="close_modal_following"
              onClick={() => {
                setModalFollowing(false);
              }}
            >
              <p className="icon-close"></p>
            </div>

            <div className="following_modal_container">
              <div className="header_following_modal_container">
                <h3>Following</h3>
              </div>
              <div className="following_item_container">
                {follow &&
                  follow.map(
                    (follow: follow) =>
                      follow.followingid === userLog.id &&
                      follow.follow && (
                        <div key={follow.id} className="following_item">
                          <div className="img_following">
                            {follow.followerusername[0]}
                          </div>
                          <p>{follow.followerusername}</p>
                        </div>
                      )
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="posts_container_user">
        <div className="header_post_user">
          <h3>
            <CgFeed />
            Posts
          </h3>
        </div>
        <div className="same_post_user">
          <div className="post_center">
            {posts &&
              posts.map(
                (post: posts) =>
                  post.senderid === userLog.id && (
                    <div className="posts_user" key={post.id}>
                      <div className="img">
                        <p>
                          <img
                            src={`http://localhost:8080/img-list/${JSON.parse(
                              post.urlimg
                            )}`}
                            alt="img_user_profile"
                            width={"250px"}
                            height={"100%"}
                            style={{ borderRadius: "10px" }}
                          />
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
                                          "Content-Type": "application/json",
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
                                          "Content-Type": "application/json",
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
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
