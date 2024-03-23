// Require the AMQP library to interact with RabbitMQ
const amqp = require("amqplib");

// Immediately-invoked Function Expression (IIFE) to use async/await at the top level
(async () => {
  // Connect to the RabbitMQ server on localhost
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  // Declare the name of the exchange from which messages will be received
  const exchangeName = "logs";

  // Assert the exchange exists and is of type 'fanout', which broadcasts all messages to all queues
  await channel.assertExchange(exchangeName, "fanout", { durable: false });

  // Assert a queue with a generated name that is exclusive to this connection
  // Exclusive queues are automatically deleted when the connection closes
  const { queue } = await channel.assertQueue("", { exclusive: true });

  console.log("Waiting for messages...");

  // Bind the asserted queue to the exchange with no specific routing key
  // This means the queue will receive messages from the exchange
  channel.bindQueue(queue, exchangeName, "");

  // Start consuming messages from the queue
  channel.consume(
    queue,
    (message) => {
      // Callback function to handle messages received from the queue
      console.log("Received message:", message.content.toString());
    },
    { noAck: true } // Automatic acknowledgement mode, no manual acknowledgment is needed
  );
})();
