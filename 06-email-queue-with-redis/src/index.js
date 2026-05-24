import express from "express";
import Redis from "ioredis"

const app = express();
app.use(express.json())

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

const PORT = process.env.PORT || 8000;

const QUEUE_KEY = "email:queue"

app.get("/" , (req, res) => {
    res.json({
        message: "HII"
    })
})


app.post("/email", async (req, res) => {

    const job = {
        to: req.body.to,
        subject: req.body.subject || "No Subject",
        body: req.body.body || "No Body",
        createdAt: new Date().toISOString()
    }

    await redis.lpush(QUEUE_KEY, JSON.stringify(job))
    

    res.json({
        success: true,
        job
    })
})

app.get("/email", async (req, res) => {

    const data = await redis.rpop(QUEUE_KEY);

    if(!data) {
        return res.json({
            success: false,
            message: "JOB not found"
        })
    }

    const job = JSON.parse(data)

    return res.json({
        success: true,
        job
    })

})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})