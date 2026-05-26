import express from "express";
import Redis from "ioredis";

const redis = new Redis("redis://localhost:6379");

const LEADERBOARD_KEY = "game:leaderboard";

const app = express();

app.use(express.json());

app.post("/score", async (req, res) => {
  try {
    const { username, score } = req.body;

    const data = await redis.zincrby(LEADERBOARD_KEY, Number(score), username);

    res.json({
      success: true,
      message: "Score added successfully",
    });
  } catch (error) {
    console.log(error)
  }
});

app.get("/leaderboard", async (req, res) => {

    try {

        const leaderboard = await redis.zrevrange(
            LEADERBOARD_KEY,
            0,
            9,
            "WITHSCORES"
        )

        const winners = [];

        for(let i = 0; i < leaderboard.length; i = i + 2) {
            winners.push({
                username: leaderboard[i],
                score: leaderboard[i+1]
            })
        }
        res.json({
            success: true,
            winners
        })
        
    } catch (error) {
        console.log(error)
    }

})

app.get("/rank/:username", async (req, res) => {

  try {

    const { username } = req.params;

    const rank = await redis.zrevrank(
      LEADERBOARD_KEY,
      username
    );

    if(rank === null) {
      return res.status(404).json({
        success: false,
        message: "Player not found"
      });
    }

    res.json({
      success: true,
      username,
      rank: rank + 1
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

app.listen(8000, () => {
  console.log(`server is running on port 3000`);
});
