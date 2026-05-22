import express from "express";
import { Redis } from "ioredis"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const redis = new Redis("redis://localhost:6379")

function OtpKey (number) {
    return `otp:${number}`
}

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Working"
    })
})

app.post("/send-otp", async (req, res) => {

    const {number, otp} = req.body;

    if(!number) {
        return res.json({
            message: "Please Enter the number"
        })
    }

    await redis.set(OtpKey(number), otp, "EX", 30)

    res.json({
        success: true,
        message: "OTP saved in successfully in 30 sec"
    })

})

app.post("/verify-otp", async (req, res) => {

    const { number, otp } = req.body;

    const key = OtpKey(number);

    const exist = await redis.get(key);

    if(!exist) {
        return res.json({
            success: false,
            message: "OTP has been invalid"
        })
    }

    if(exist != otp) {
    
        return res.json({
            success: false,
            message: "OTP is wrong"
        })

    }

    await redis.del(key);

    return res.json({
        success: true,
        message: "OTP verified Successfully !"
    })
    

})

app.get("/otp/:number/ttl", async (req, res) => {

    const number = req.params.number;

    const key = OtpKey(number);

    const ttl = await redis.ttl(key);

    return res.json({
        success: true,
        message: ttl
    })


})  


const PORT = 8000;

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`)
})