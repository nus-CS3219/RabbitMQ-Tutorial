const express = require("express");
const amqp = require("amqplib");

const app = express();

app.get("/send", async (req, res) => {
  const connection = await amqp.connect("amqp://some-rabbit");
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
