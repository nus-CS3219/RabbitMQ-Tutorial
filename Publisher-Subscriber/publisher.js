const express = require("express");
const amqp = require("amqplib");

const app = express();

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
