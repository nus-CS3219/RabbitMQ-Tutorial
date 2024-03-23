const amqp = require("amqplib");

(async () => {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = "logs";
  await channel.assertExchange(exchangeName, "fanout", { durable: false });

  const { queue } = await channel.assertQueue("", { exclusive: true });

  console.log("Waiting for messages...");

  channel.bindQueue(queue, exchangeName, "");

  channel.consume(
    queue,
    (message) => {
      console.log("Received message:", message.content.toString());
    },
    { noAck: true }
  );
})();
