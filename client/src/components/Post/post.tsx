import { useEffect, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { BsCloudUploadFill } from "react-icons/bs";
import { users } from "../types/types";
import "./post.css";
export function Post() {
  const userLogLS = localStorage.getItem("userLog");
  const userLog: users = userLogLS ? JSON.parse(userLogLS) : {};
  const [selectedImage, setSelectedImage] = useState<any>();
  const [error, setError] = useState<string>("");
  const hiddenFileInput = useRef<any>(null);
  const handleClick = (event: any) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    setSelectedImage(fileUploaded);
    setError("");
  };

  const [users, setUsers] = useState<any>([]);
  useEffect(() => {
    async function getUsers() {
      const url = await fetch("http://192.168.68.122:8080/user-list");
      const response = await url.json();
      setUsers(response);
    }

    getUsers();
  }, []);

  const [post, setPost] = useState<any>([]);
  useEffect(() => {
    const getPosts = async () => {
      const url = await fetch("http://192.168.68.122:8080/posts-list");
      const response = await url.json();
      setPost(response);
    };
    getPosts();
  }, []);

  const formData = new FormData();
  formData.append("file", selectedImage);

  const sendImageFunc = async () => {
    if (selectedImage) {
      await fetch(`http://192.168.68.122:8080/posts-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: userLog.id,
          senderUserName: userLog.username,
        }),
      });

      await fetch(`http://192.168.68.122:8080/img-save`, {
        method: "POST",
        body: formData,
      });

      await users.forEach(async (user: users) => {
        await fetch(`http://192.168.68.122:8080/likes-save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            liker: user.id,
            likerUserName: user.username,
            postid: post.length > 0 ? post[post.length - 1].id + 1 : 1,
            postlike: false,
          }),
        });
      });

      await fetch(`http://192.168.68.122:8080/cntlike-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postid: post.length > 0 ? post[post.length - 1].id + 1 : 1,
          liker: 0,
          cnt: 0,
        }),
      });
      setError("");
      setSelectedImage(null);
      window.location.replace("/");
    } else {
      setError("You didn't choose a image!");
    }
  };
  return (
    <div className="post">
      <div className="modal_post">
        <div className="modal_post_container">
          {
            <div className="img_container">
              {selectedImage && (
                <img
                  src={selectedImage && URL.createObjectURL(selectedImage)}
                  alt="image_select"
                  width={"200px"}
                  style={{ borderRadius: "5px" }}
                />
              )}
              <br />
              <button
                className="remove_img"
                onClick={() => setSelectedImage(null)}
                style={
                  !selectedImage ? { display: "none" } : { display: "block" }
                }
              >
                <span className="icon-delete">
                  <AiFillDelete />
                </span>
              </button>
            </div>
          }
          <br />
          <br />

          <div className="posting_footer">
            <button className="button_select_file" onClick={handleClick}>
              <span className="icon-upload">
                <BsCloudUploadFill />
              </span>
            </button>

            <input
              className="choose_file"
              type="file"
              name="myImg"
              ref={hiddenFileInput}
              onChange={(event: any) => handleChange(event)}
              style={{ display: "none" }}
            />
            <button className={"send_post"} onClick={sendImageFunc}>
              Post
            </button>
          </div>
          <p style={{ color: "red", fontSize: "18px", fontWeight: "700" }}>
            {error && error}
          </p>
        </div>
      </div>
    </div>
  );
}
