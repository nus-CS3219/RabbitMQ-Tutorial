const amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://some-rabbit");
  const channel = await connection.createChannel();

  await channel.assertQueue("message_queue");

  channel.consume("message_queue", (message) => {
    console.log("Received message:", message.content.toString());
    channel.ack(message);
  });

  console.log("Consumer waiting for messages...");
})();
