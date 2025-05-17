import amqp from "amqplib";

(async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    // exchange definition    
    await channel.assertExchange("rideRequested", "direct", { durable: true });
    await channel.assertExchange("rideAccepted", "direct", { durable: true });
    await channel.assertExchange("rideCompleted", "direct", { durable: true });
    await channel.assertExchange("paymentProcessed", "direct", { durable: true });
    // queue definition
    await channel.assertQueue("rideRequested.updateProjection", { durable: true });
    await channel.assertQueue("rideAccepted.updateProjection", { durable: true });
    await channel.assertQueue("rideCompleted.updateProjection", { durable: true });
    await channel.assertQueue("rideCompleted.processPayment", { durable: true });
    await channel.assertQueue("rideCompleted.generateInvoice", { durable: true });
    await channel.assertQueue("paymentProcessed.updateProjection", { durable: true });
    // queue bind
    await channel.bindQueue("rideRequested.updateProjection", "rideRequested", "");
    await channel.bindQueue("rideAccepted.updateProjection", "rideAccepted", "");
    await channel.bindQueue("rideCompleted.updateProjection", "rideCompleted", "");
    await channel.bindQueue("rideCompleted.processPayment", "rideCompleted", "");
    await channel.bindQueue("rideCompleted.generateInvoice", "rideCompleted", "");
    await channel.bindQueue("paymentProcessed.updateProjection", "paymentProcessed", "");
})();
