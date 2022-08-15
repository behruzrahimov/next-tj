import { useEffect, useState } from "react";
import { follow, likes, posts, users } from "../types/types";
import "./Home.css";
import loadingImg from "../../img/Loading_icon.gif";
export function Home() {
  const [posts, setPosts] = useState<any>([]);
  const userLogLs = localStorage.getItem("userLog");
  const userLog: users = userLogLs ? JSON.parse(userLogLs) : {};

  useEffect(() => {
    const getPost = async () => {
      const url = await fetch("http://localhost:8080/posts-list");
      const response = await url.json();
      setPosts(response);
    };
    getPost();
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

  const postMap =
    posts.length > 0 ? (
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
                        <p className="senderusername_post">
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
                  </div>
                </div>
              )
          )
      )
    ) : (
      <div className="img_loading">
        <img src={loadingImg} alt="loding" width={"25px"} height={"25px"} />
      </div>
    );

  return <div className="home">{postMap}</div>;
}
