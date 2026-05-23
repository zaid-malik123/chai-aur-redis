import express from "express";
import Redis from "ioredis";

const app = express();

app.use(express.json());

const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.json({
    message: "HII",
  });
});


// ---------------- JSON ----------------

app.post("/user/:id/json", async (req, res) => {

  const result = await redis.set(
    `user:${req.params.id}:json`,
    JSON.stringify(req.body)
  );

  res.json({
    success: true,
    result,
  });
});

app.get("/user/:id/json", async (req, res) => {

  const result = await redis.get(
    `user:${req.params.id}:json`
  );

  const data = JSON.parse(result);

  res.json({
    success: true,
    data,
  });
});


// ---------------- HASH ----------------

app.post("/user/:id/hash", async (req, res) => {

  const result = await redis.hset(
    `user:${req.params.id}:hash`,
    req.body
  );

  res.json({
    success: true,
    result,
  });
});

app.get("/user/:id/hash", async (req, res) => {

  const data = await redis.hget(
    `user:${req.params.id}:hash`, "email"
  );

  res.json({
    success: true,
    data,
  });
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});