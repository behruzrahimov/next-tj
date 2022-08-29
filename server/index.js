//express
import express from "express";

//cors
import cors from "cors";

//postgress
import postgres from "pg";

//uuid
import { v4 as uuidv4 } from "uuid";

//import __dirname
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//path
import * as path from "path";

//Client
const { Client } = postgres;

//multer
import multer from "multer";

//router
const router = express.Router();

//create Port
const port = 8080;

//App
const app = express();

//cors()
app.use(cors());

//router
app.use("/", router);

//expres JSON
app.use(express.json());

app.use(express.static(path.join(__dirname, "image")));

//express urlencoded
app.use(express.urlencoded({ extended: true }));

// upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + file.originalname);
  },
});

//milter
const upload = multer({ storage: storage });

//post user
app.post("/user-reg", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });

  await client.connect();
  await client.query(
    `INSERT INTO users(name,firstname,number,date,username,password,rePassword)VALUES($1,$2,$3,$4,$5,$6,$7)`,
    [
      req.body.name,
      req.body.firstname,
      req.body.number,
      req.body.date,
      req.body.usernameReg,
      req.body.passwordReg,
      req.body.rePassword,
    ]
  );
  await client.end();
  res.send("user added!");
});

//get User
app.get("/user-list", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });

  await client.connect();
  const result = await client.query('SELECT * FROM "users"');
  await client.end();
  res.json(result.rows);
});

//post messages

app.post("/messages-save", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });

  await client.connect();
  await client.query(
    `INSERT INTO messages(sender,receiver,text)VALUES($1,$2,$3)`,
    [req.body.sender, req.body.receiver, req.body.text]
  );
  await client.end();
  res.send("message added!");
});

//get Message
app.get("/messages-list", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });

  await client.connect();
  const result = await client.query('SELECT * FROM "messages"');
  await client.end();
  res.json(result.rows);
});

//post posts
app.post("/posts-save", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });
  await client.connect();
  await client.query(
    `INSERT INTO posts(senderId,senderUserName,title)VALUES($1,$2,$3)`,
    [req.body.senderId, req.body.senderUserName, req.body.title]
  );
  await client.end();
  res.send("post added!");
});

//img save
app.post("/img-save", upload.single("file"), async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });
  await client.connect();
  const result = await client.query(`select * from posts`);
  const lengthresult = result.rows[result.rows.length - 1];
  await client.query(
    `UPDATE posts SET urlimg='${JSON.stringify(req.file.filename)}' WHERE id=${
      lengthresult.id
    }`
  );
  await client.end();
  res.send("img added!");
});

//iamge list
router.get("/img-list/:filename", async (req, res) => {
  res.sendFile(path.join(__dirname, "/image", `${req.params.filename}`));
});

//get posts
app.get("/posts-list", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });
  await client.connect();
  const result = await client.query(`select * from posts`);
  await client.end();
  res.json(result.rows);
});

//post Likes
app.post("/likes-save", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });

  await client.connect();
  const result = await client.query(`select * from likes`);
  const findLikes =
    result.rows &&
    result.rows.find((like) => {
      return like.liker === req.body.liker && like.postid === req.body.postid;
    });

  if (findLikes) {
    if (findLikes.postlike) {
      findLikes.postlike = false;
    } else {
      findLikes.postlike = true;
    }
    await client.query(
      `UPDATE likes SET postlike=${findLikes.postlike} WHERE id=${findLikes.id}`
    );
    await client.end();
    res.send("likes added!");
  } else {
    await client.query(
      `INSERT INTO likes(liker,likerusername,postid,postlike)VALUES($1,$2,$3,$4)`,
      [
        req.body.liker,
        req.body.likerUserName,
        req.body.postid,
        req.body.postlike,
      ]
    );
    await client.end();
    res.send("likes added!");
  }
});

//get likes
app.get("/likes-list", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });
  await client.connect();
  const result = await client.query(`select * from likes`);
  await client.end();
  res.json(result.rows);
});

//get cntlike
app.post("/cntlike-save", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });
  await client.connect();
  const resultCnt = await client.query(`select * from cntlike`);
  const resultLike = await client.query(`select * from likes`);

  const findCnt =
    resultLike.rows &&
    resultCnt.rows.find((cnt) => {
      return req.body.postid === cnt.postid;
    });

  const findLikes =
    resultLike.rows &&
    resultLike.rows.find((like) => {
      return (
        like.postid === req.body.postid &&
        like.liker === req.body.liker &&
        req.body.liker !== 0
      );
    });

  if (!findCnt) {
    await client.query(
      `INSERT INTO cntlike(postid,liker,cnt)VALUES($1,$2,$3)`,
      [req.body.postid, req.body.liker, 0]
    );
  } else {
    if (findLikes) {
      if (findLikes.postlike) {
        await client.query(
          `UPDATE cntlike SET "cnt" ='${findCnt.cnt + 1}' WHERE id=${
            findCnt.id
          }`
        );
      } else if (!findLikes.postlike) {
        await client.query(
          `UPDATE cntlike SET "cnt" ='${
            findCnt.cnt === 0 ? findCnt.cnt : findCnt.cnt - 1
          }' WHERE id=${findCnt.id}`
        );
      }
    } else {
      await client.query(
        `UPDATE cntlike SET cnt='${
          findCnt.cnt === 0 ? 0 : findCnt.cnt
        }' WHERE id=${findCnt.id}`
      );
    }
  }
  await client.end();
  res.send("cntlike added!");
});

//get cntLike
app.get("/cntlike-list", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });
  await client.connect();
  const result = await client.query(`select * from cntlike`);
  await client.end();
  res.json(result.rows);
});

//post flow
app.post("/follow-save", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });

  await client.connect();
  const result = await client.query(`select * from follow`);
  const findFollow =
    result.rows &&
    result.rows.find((follow) => {
      return (
        follow.followerid === req.body.followerid &&
        follow.followingid === req.body.followingid
      );
    });

  if (findFollow) {
    if (findFollow.follow) {
      findFollow.follow = false;
    } else {
      findFollow.follow = true;
    }
    await client.query(
      `UPDATE follow SET follow='${findFollow.follow}' , followerusername='${req.body.followerusername}' , followingusername='${req.body.followingusername}' WHERE id=${findFollow.id}`
    );
    await client.end();
    res.send("follows update!");
  } else {
    await client.query(
      `INSERT INTO follow(followerid,followerusername,followingid,followingusername,follow)VALUES($1,$2,$3,$4,$5)`,
      [
        req.body.followerid,
        req.body.followerusername,
        req.body.followingid,
        req.body.followingusername,
        req.body.follow,
      ]
    );
    await client.end();
    res.send("follow added!");
  }
});

//get follow
app.get("/follow-list", async (req, res) => {
  const client = new Client({
    host: "localhost",
    port: "5432",
    user: "postgres",
    password: "15092002",
    database: "postgres",
  });
  await client.connect();
  const result = await client.query(`select * from follow`);
  await client.end();
  res.json(result.rows);
});

//server
app.get("/", (req, res) => {
  res.json("server working");
});

//listening Port
app.listen(port, () => {
  console.log(`Example app listening port http://localhost:${port}`);
});
