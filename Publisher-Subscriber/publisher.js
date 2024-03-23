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

app.get("/publish", async (req, res) => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = "logs";
  await channel.assertExchange(exchangeName, "fanout", { durable: false });

  const message = "Hello, Pub/Sub!";
  channel.publish(exchangeName, "", Buffer.from(message));

  await channel.close();
  await connection.close();

  res.send("Message published to RabbitMQ");
});

app.listen(3000, () => {
  console.log("Publisher running on port 3000");
});
