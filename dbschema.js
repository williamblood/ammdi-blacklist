let db = {
  user: [
    {
      createdAt: "2019-08-19T11:18:12.814Z",
      email: "user@email.com",
      handle: "user",
      imageUrl: "image/foo/bar",
      userId: "wlekrj13984PfiL2Ak23Hkd",
      server: "Faerlina (PvP)"
    }
  ],
  posts: [
    {
      userHandle: "user",
      body: "this is the body of the post",
      createdAt: "2019-08-16T16:37:50.314Z",
      likeCount: 5,
      commentCount: 2
    }
  ]
};

const userDetails = {
  // For Redux
  credentials: [
    {
      createdAt: "2019-08-19T11:18:12.814Z",
      email: "user@email.com",
      handle: "user",
      imageUrl: "image/foo/bar",
      userId: "wlekrj13984PfiL2Ak23Hkd",
      server: "Faerlina (PvP)",
      alignment: "True Neutral"
    }
  ],
  // Will show the user a different icon if they already upvoted
  votes: [
    {
      userHandle: "user",
      postId: "cm1093478kddxAUA"
    },
    {
      userHandle: "user",
      postId: "cm1093478kddxAUA"
    }
  ]
};
