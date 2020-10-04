# Spring Boot and Web Socket 

## About
Sample Chat Application using Spring Boot and WebSocket.

#### What is WebSocket
Like ``http``, ``websocket`` is also a communication protocol which provides bi-directional communication channel between a server and client. \
This is the main reason why websocket is prefered over Http where the client and server need to exchange information at high frequency and with lower latency.

#### STOMP
STOMP stands for ``Streaming Text Oriented Messaging Protocol``.
WebSocket is just a communication protocol. \
He doen't know ``How to send a message only to users who are subscribed to a particular topic, or how to send a message
to a particular user``. We need STOMP for these. \
Spring provides default support for it but you can choose any other messaging protocol such as RabbitMQ or ActiveMQ.

## Running 
``$ docker run -i -p 8080:8080 eyrafabdullayev/chatapplication:latest ``
