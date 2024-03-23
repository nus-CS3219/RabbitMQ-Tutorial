# Tutorial: Introduction to RabbitMQ

## Overview

RabbitMQ is a powerful message-broker software that enables communication between applications using messages. It provides a reliable and scalable platform for building distributed systems and implementing messaging patterns like message queues and publish-subscribe (pub/sub).

## Prerequisites

- Basic understanding of messaging and queueing concepts
- Node.js and npm installed on your machine. You can visit this [page](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for installation instructions.
- Docker installed on your machine

## Setup and Installation

1. Pull the official RabbitMQ image from Docker Hub:

   ```
   docker pull rabbitmq:3-management
   ```

2. Run a RabbitMQ container with the management plugin enabled:

   ```
   docker run -d --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

   The management plugin provides a web-based UI for managing and monitoring the RabbitMQ server. You can now access the RabbitMQ management dashboard in your web browser at http://localhost:15672. Use the default credentials: username "guest" and password "guest".

## Basic Concepts

- **Producer**: An application that sends messages to RabbitMQ.
- **Consumer**: An application that receives messages from RabbitMQ.
- **Queue**: A buffer that stores messages until they are consumed.
- **Exchange**: A component that routes messages to one or more queues based on binding rules.
- **Binding**: A relationship between an exchange and a queue that determines how messages are routed.


## Message Queue

1. Go to the "Producer-Consumer" folder and install the required dependencies:

   ```
   npm install
   ```

2. The code for producer, consumer, and a simple web interface has been provided.

   Start the producer by running the following command in a terminal:

   ```
   node producer.js
   ```

   Start the consumer by running the following command in a separate terminal:

   ```
   node consumer.js
   ```

3. Open the `index.html` file in a web browser and click the "Send Message" button.
   Observe the output in the consumer terminal, which should display the received message.

**Explanation**

In this example, we have a simple web interface with a button that triggers a message to be sent to RabbitMQ. The producer (`producer.js`) defines an Express route named "/send" that sends a message to a queue named "message_queue" when the endpoint is accessed.

The consumer (`consumer.js`) connects to RabbitMQ and consumes messages from the same queue (i.e., the one named "message_queue"). Whenever a message is received, it is logged to the console.

This example demonstrates the basic concept of message queues, where messages are sent by producers and consumed by consumers asynchronously.

# Publish/Subscribe

Let's extend the previous example to demonstrate the publish/subscribe (pub/sub) pattern using RabbitMQ and Node.js.

1. Now go to the "Publisher-Subscriber" folder and install the required dependencies:

   ```
   npm install
   ```

2. The code for publisher, subscriber, and a simple web interface has been provided.

   Start the publisher by running the following command in a terminal:

   ```
   node publisher.js
   ```

   Start **multiple instances of the subscriber** by running the following command in separate terminals:

   ```
   node subscriber.js
   ```

3. Open the `index.html` file in a web browser and click the "Publish Message" button.
   Observe the output in all the subscriber terminals, which should display the received message.

**Explanation**

In this pub/sub example, the producer (`producer.js`) publishes messages to an *exchange* named "logs" instead of sending them directly to a queue. The exchange is declared as a "fanout" type, which means it will broadcast the messages to all the queues bound to it.

Each subscriber (`subscriber.js`) creates an exclusive queue and *binds* it to the "logs" exchange. Each subscriber will then receive its own copy of the published messages.

When you click the "Publish Message" button in the web interface, the producer publishes a message to the "logs" exchange. The exchange then distributes the message to all the bound queues, and each subscriber consumes and logs the received message.

This demonstrates the pub/sub pattern, where multiple subscribers can receive the same message independently. It allows for decoupling of the message producers and consumers, enabling scalable and flexible architectures.

## Resources

RabbitMQ Tutorial: https://www.rabbitmq.com/tutorials/tutorial-one-javascript
