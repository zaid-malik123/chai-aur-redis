import express from "express";
import Redis from "ioredis"
import mongoose from "mongoose"

const app = express();

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379")

const PORT = process.env.PORT || 2000;

app.get("/" , (req, res) => {
    res.json({
        message: "HII"
    })
})

app.get("/redis", async (req, res) => {

    const reply = await redis.ping();

    res.json({
        message: `Redis reply ${reply}`
    })

})

app.get("/mongo", async (req, res) => {

    const url = process.env.MONGO_URI || "mongodb://localhost:27017/redis_db";

    if(mongoose.connection.readyState === 0) {
        await mongoose.connect(url)
    }

    return res.json({
        message: `Connection Done db name is ${mongoose.connection.name}`
    })
    
})

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})