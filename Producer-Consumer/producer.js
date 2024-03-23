const express = require("express");
const amqp = require("amqplib");

const app = express();

// import the dependencies required for cors
const cors = require("cors");

// allow cross-origin requests to reach the Expres.js server
// from localhost:3000, which is your frontend domain
app.options(
  "*",
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);
app.use(cors());

app.get("/send", async (req, res) => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  await channel.assertQueue("message_queue");

  const message = "Hello, RabbitMQ!";
  channel.sendToQueue("message_queue", Buffer.from(message));

  await channel.close();
  await connection.close();

  res.send("Message sent to RabbitMQ");
});

app.listen(3000, () => {
  console.log("Producer running on port 3000");
});
