import express from "express";
import Redis from "ioredis";

const publisher = new Redis("redis://localhost:6379");

const app = express();

app.use(express.json());

app.post("/notification" , async (req, res) => {

    const { message } = req.body;

    await publisher.publish("notification", JSON.stringify(message))

    res.json({
        success: true,
        message: "Message published successfully !! "
    })

})

app.listen(8000, () => {
  console.log(`server is running on port http://localhost:8000`);
});
