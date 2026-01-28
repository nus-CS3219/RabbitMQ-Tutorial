# CS3219 SE Toolbox - Messaging Queues

## Overview

RabbitMQ is a powerful message-broker software that enables communication between applications using messages. It provides a reliable and scalable platform for building distributed systems and implementing messaging patterns like message queues and publish-subscribe (pub/sub).

##  Learning Objectives
By the end of this tutorial, you should be able to:
1. Understand the basic concepts of RabbitMQ and message queuing.
2. Install and configure RabbitMQ on your machine.
3. Write basic programs to send and receive messages using RabbitMQ.
4. Understand how to route messages using exchanges and bindings.

## Prerequisites

- Basic understanding of messaging and queueing concepts
- Node.js and npm installed on your machine. You can visit this [page](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) for installation instructions.
- Docker installed on your machine
- Clone [https://github.com/nus-CS3219/RabbitMQ-Tutorial](https://github.com/nus-CS3219/RabbitMQ-Tutorial) to your device.

## What is RabbitMQ?
RabbitMQ is a message broker: it accepts and forwards messages. You can think about it as a post office: when you put the mail that you want posting in a post box, you can be sure that the letter carrier will eventually deliver the mail to your recipient. In this analogy, RabbitMQ is a post box, a post office, and a letter carrier.

The core components of RabbitMQ are:
- **Producer**: An application that sends messages to RabbitMQ.  
<p align="center">
<img width="34" alt="Screenshot 2024-09-10 at 03 35 26" src="https://github.com/user-attachments/assets/187064d2-e1b4-422c-97b3-66a153fa44b6">
</p>

- **Queue**: A buffer that stores messages waiting to be processed. Although messages flow through RabbitMQ and your applications, they can only be stored inside a _queue_. A _queue_ is only bound by the host's memory & disk limits, it's essentially a large message buffer. Many _producers_ can send messages that go to one queue, and many _consumers_ can try to receive data from one _queue_. This is how we represent a queue:

<p align="center">
   <img width="141" alt="Screenshot 2024-09-10 at 03 38 29" src="https://github.com/user-attachments/assets/d3a745e8-b84e-4c5e-81e4-3f89c0714e85">
</p>

- **Consumer**: A program that receives messages from RabbitMQ. It has a similar meaning to receiving.

<p align="center">
   <img width="44" alt="Screenshot 2024-09-10 at 03 38 46" src="https://github.com/user-attachments/assets/dc7419ef-7554-4cc6-a909-92af296aff7f">
</p>

In the diagram below, "P" is our producer and "C" is our consumer. The box in the middle is a queue - a message buffer that RabbitMQ keeps on behalf of the consumer.


<p align="center">
   <img width="230" alt="Screenshot 2024-09-10 at 03 39 01" src="https://github.com/user-attachments/assets/98dc16f9-a3ca-404c-b027-c8f733d0e6e2">
</p>

>[!note]
>Note that the producer, consumer, and broker do not have to reside on the same host; indeed in most applications they don't. An application can be both a producer and consumer, too.

## Setup and Installation

1. Pull the official RabbitMQ image from Docker Hub:

   ```sh
   docker pull rabbitmq:3-management
   ```

2. Run a RabbitMQ container with the management plugin enabled:

   ```sh
   docker run -d --name some-rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```

   The management plugin provides a web-based UI for managing and monitoring the RabbitMQ server. You can now access the RabbitMQ management dashboard in your web browser at http://localhost:15672.
>[!note]
>Use the default credentials: username "guest" and password "guest".

## Message Queue

Now in the project folder...

1. Go to the "Producer-Consumer" folder and install the required dependencies:

   ```sh
   npm install
   ```

2. The code for producer, consumer, and a simple web interface has been provided.

   Start the producer by running the following command in a terminal:

   ```sh
   node producer.js
   ```

   Start the consumer by running the following command in a separate terminal:

   ```sh
   node consumer.js
   ```

3. Open the `index.html` file under the `Producer-Consumer` folder in a web browser, input the message like "Hello world", and click the "Send Message" button.

<p align="center">
   <img width="425" alt="Screenshot 2024-09-10 at 03 48 45" src="https://github.com/user-attachments/assets/796a4f35-e42d-4185-a482-272a0a0e18bf">
</p>

4. Observe the output in the consumer terminal, which should display the received message.

### **Concepts**

- **Producer**: An application that sends messages.
- **Consumer**: An application that mostly waits to receive messages.
- **Queue**: A buffer maintained by RabbitMQ that stores messages until they are consumed.

📘**Connection and Channel**

- **Connection**: A TCP connection established between the application and RabbitMQ. We need this connection for the application to communicate with the RabbitMQ broker.
- **Channel**: A logical/virtual connection **within a connection** that is used for sending and receiving messages, as well as managing queues, exchanges, bindings, and other RabbitMQ entities. Channels are lightweight, and multiple channels can be *multiplexed over a single connection*, which can be thought of as they share the single TCP connection.

### **Explanation of the Message Queue Example**

In this example, we have a simple web interface with a button that triggers a message to be sent to RabbitMQ. The producer (`producer.js`) defines an Express route named "/send" that sends a message to a queue named "message_queue" when the endpoint is accessed.

The consumer (`consumer.js`) connects to RabbitMQ and consumes messages from the same queue (i.e., the one named "message_queue"). Whenever a message is received, it is logged to the console.

This example demonstrates the basic concept of message queues, where messages are sent by producers and consumed by consumers asynchronously.

### 📖**Exercises**

#### **Asynchronous Message Delivery**

1. Stop the consumer (use `ctrl-c` to stop it) if it's running but ensure the producer is running.
2. Without the consumer running, send multiple messages to RabbitMQ.
3. After the messages are sent, stop the producer.
4. Now, start the consumer by running `node consumer.js`.
5. Observe the output in the consumer terminal.

You should see all the messages that were sent by the producer before the consumer started, demonstrating the asynchronous nature of message queues. Messages are persisted in the queue until they are consumed, regardless of whether the consumer is running when they are sent or the producer is running when they are delivered.

> 💡**Tips**
>
> You can access the RabbitMQ management dashboard at http://localhost:15672 (with the default guest/guest credentials) to observe the queues, messages, and other details. This can be a useful tool for monitoring and troubleshooting your RabbitMQ setup.

#### Message Durability

The previous exercise demonstrates RabbitMQ is able to hold the messages until they are consumed, but what if the RabbitMQ server stops before the messages are consumed? Let's simulate this scenario.

1. Repeat steps 1-3 in the previous exercise.

2. Before starting the consumer, restart the Docker container running the RabbitMQ server:

   ```sh
   docker restart some-rabbit
   ```

3. Now continue with steps 4-5 in the previous exercise.

Unfortunately, When RabbitMQ quits or crashes, it will forget the queues and messages unless we tell it not to. To make sure that messages aren't lost, we need to mark **both the queue and messages** as *durable*.

1. In both the `producer.js` and `consumer.js` files, find the line where the queue is declared and update it to (note that a new queue name is used):

   ```javascript
   await channel.assertQueue("durable_message_queue", { durable: true });
   ```

2. In the `producer.js` file, find the line where messages are published and add the `persistent` option:

   ```javascript
   channel.sendToQueue("durable_message_queue", Buffer.from(message), { persistent: true });
   ```

3. Don't forget to update the queue name for `channel.consume` in `consumer.js`!

4. After these changes, repeat the steps, and undelivered messages should now be persisted even after RabbitMQ restarts.

>[!note]
>Marking messages as persistent doesn't fully guarantee that a message won't be lost. Although it tells RabbitMQ to save the message to disk, there is still a short time window when RabbitMQ has accepted a message and hasn't saved it yet. Also, RabbitMQ doesn't do `fsync(2)` for every message -- it may be just saved to cache and not really written to the disk. The persistence guarantees aren't strong, but it's more than enough for our simple task queue. If you need a stronger guarantee then you can use [publisher confirms](https://www.rabbitmq.com/docs/confirms).

#### Consumer Acknowledgment and Message Redelivery

1. Open the `consumer.js` file and comment out or remove the line `channel.ack(message);` which acknowledges the successful processing of a message by the consumer.
2. Restart the consumer by running `node consumer.js`.
3. Start the producer and send a message from the web interface.
4. Observe the output in the consumer terminal. You should see the message being logged.
5. Stop and restart the consumer multiple times. What do you observe? Compare this behavior to when the acknowledgment (`ack`) is used.

By removing the acknowledgment from the consumer, messages are repeatedly delivered and consumed. RabbitMQ assumes unacknowledged messages haven't been processed successfully and redelivers them after a consumer restart, ensuring no message is lost even if a worker dies.

## Publish/Subscribe

Let's extend the previous example to demonstrate the publish/subscribe (pub/sub) pattern using RabbitMQ and Node.js.

1. Now go to the "Publisher-Subscriber" folder and install the required dependencies:

   ```sh
   npm install
   ```

2. The code for publisher, subscriber, and a simple web interface has been provided.

   Start the publisher by running the following command in a terminal:

   ```sh
   node publisher.js
   ```

   Open multiple terminals and start **multiple instances of the subscriber** by running the following command in separate terminals:

   ```sh
   node subscriber.js
   ```

3. Open the `index.html` file in a web browser and click the "Publish Message" button.

<p align="center">
   <img width="310" alt="Screenshot 2024-09-10 at 03 50 40" src="https://github.com/user-attachments/assets/5eb415c5-807f-486c-8a19-eec4a2199d31">
</p>

4. Observe the output in all the subscriber terminals, which should display the received message.

### **Concepts**

- **Exchange**: A message routing agent responsible for receiving messages from producers/publishers and pushing them to one or more queues based on the *exchange type*.
  - **Fanout** exchange type: Broadcasts (routes) messages to all queues bound to the exchange.
- **Binding**: A relationship between an exchange and a queue that tells the exchange to send messages to the queue.

📘**Temporary queues**

```javascript
channel.assertQueue("", { exclusive: true });
```

This line of code in `subscriber.js` creates a temporary queue. Temporary queues are useful in scenarios where a fresh, empty queue is needed upon connecting to RabbitMQ, and there is no need to share it between producers and consumers. The queue created has some properties:

- **Randomly named:** RabbitMQ generates a unique, random name for the queue when the queue is declared with an empty string as its name.
- **Automatically deleted:** The queue is automatically deleted when the connection that declared it closes. This ensures cleanup and avoids unused queues.
- **Exclusive usage:** The queue is declared as *exclusive*, meaning only the connection that created it can consume messages from it.

### **Explanation of the Pub/Sub Example**

In this pub/sub example, the publisher (`publisher.js`) creates an exchange named "logs". The exchange is declared to be of type "fanout", which means it will broadcast the messages to all the queues bound to it.

Each subscriber (`subscriber.js`) creates an exclusive queue and binds it to the "logs" exchange. Each subscriber will then receive its own copy of the published messages.

When you click the "Publish Message" button in the web interface, the publisher publishes a message to the "logs" exchange. The exchange then distributes the message to all the bound queues, and each subscriber consumes and logs the received message.

This demonstrates the pub/sub pattern, where multiple subscribers can receive the same message independently. It allows for decoupling of the message producers and consumers, enabling scalable and flexible architectures.

<br>

> 📖**Additional Exercise**
>
> In the pub/sub example, we ran multiple subscribers, and they all received the same published message. In this additional exploration, try running multiple consumers (`consumer.js`) in the previous producer-consumer example and observe how RabbitMQ distributes messages across them.

## Conclusion and Further Exploration
🎉Congratulations! You have successfully set up RabbitMQ and explored some core concepts of RabbitMQ, including message queues and the publish/subscribe patterns using Node.js. However, RabbitMQ is a powerful tool with many more features and use cases to explore:
• Routing messages using **direct** and **topic** exchanges.
• Use RabbitMQ to build an Remote Procedure Call (RPC) system
The [official RabbitMQ tutorials](https://www.rabbitmq.com/tutorials/tutorial-one-javascript) provide a wealth of information and cover more advanced topics in depth. Use them as a reference and continue learning and exploring the powerful capabilities of RabbitMQ.


## References
- [Official RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [RabbitMQ tutorial - Publish/Subscribe](https://www.rabbitmq.com/tutorials/tutorial-three-javascript)
- Outline generated with [ChatGPT](https://openai.com/blog/chatgpt)
## Other Resources
- [RabbitMQ on Docker](https://hub.docker.com/_/rabbitmq)
