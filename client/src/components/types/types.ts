export type likes = {
  id: number;
  liker: number;
  likerusername: string;
  postid: number;
  postlike: boolean;
};

export type posts = {
  id: number;
  urlimg: string;
  senderid: number;
  senderusername: string;
  title: string;
};

export type users = {
  id: number;
  name: string;
  firstname: string;
  number: string;
  date: string;
  username: string;
  password: string;
  repassword: string;
};

export type messages = {
  id: number;
  sender: number;
  receiver: number;
  text: string;
};

export type selectContactType = {
  selectContact: users;
};

export type follow = {
  id: number;
  followerid: number;
  followerusername: string;
  followingid: number;
  followingusername: string;
  follow:boolean;
};
