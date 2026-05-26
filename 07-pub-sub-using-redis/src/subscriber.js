import Redis from "ioredis";

const subscriber = new Redis("redis://localhost:6379");

subscriber.subscribe("notification", (err) => {
    if(err) {
        throw new Error(`Failed to subscribe error ${err.message}`)
    }

    console.log("subscribed successfully !!! ")
})

subscriber.on("message", (channel, message) => {
    console.log(`Recieved message from channel ${channel} and that message is --> ${JSON.parse(message)}`)
})