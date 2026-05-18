import express from "express";
import { Redis } from "ioredis";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const PORT = process.env.PORT || 8000;

const BANNER_KEY = "app:banner";

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Working Successfully !"
    })
})

app.post("/banner", async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message || "Welcome to my website");

  res.json({
    success: true,
  });
});

app.get("/banner", async (req, res) => {
  const message = await redis.get(BANNER_KEY);

  res.json({
    success: true,
    message,
  });
});

app.delete("/banner", async (req, res) => {
  const message = await redis.del(BANNER_KEY);

  res.json({
    success: true,
  });
});

app.get("/banner/exists", async (req, res) => {

    const isExist = await redis.exists(BANNER_KEY)
    console.log("EXIST VALUE ", isExist)
    res.json({
        success: Boolean(isExist)
    })
})

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
