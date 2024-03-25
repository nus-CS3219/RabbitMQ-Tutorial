// Import the express package to create and configure the server
const express = require("express");

// Import the amqplib package to interact with RabbitMQ
const amqp = require("amqplib");

// Initialize the express application
const app = express();

// Import the cors middleware to enable CORS on the server
const cors = require("cors");

// Configure CORS to allow requests from a specific origin (http://localhost:3001) and to handle preflight requests
app.options(
  "*",
  cors({
    origin: "http://localhost:3001",
    optionsSuccessStatus: 200,
  })
);
app.use(cors());

// Define a route that listens on GET requests to "/publish/:message"
app.get("/publish/:message", async (req, res) => {
  const message = req.params.message; // Extract the message from the route parameter

  // Connect to RabbitMQ server
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  // Setup the exchange
  const exchangeName = "logs"; // Name of the exchange
  await channel.assertExchange(exchangeName, "fanout", { durable: false });

  // Publish the message
  channel.publish(exchangeName, "", Buffer.from(message));

  // Close the channel and the connection to clean up resources
  await channel.close();
  await connection.close();

  res.send("Message published to RabbitMQ");
});

// Start the server on port 3001
app.listen(3001, () => {
  console.log("Publisher running on port 3001");
});
