const amqp = require('amqplib');
 
async function notificationService() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  await channel.assertExchange('ecommerce', 'fanout');
  const queue = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(queue.queue, 'ecommerce', '');
 
  channel.consume(queue.queue, (msg) => {
    const { event, data } = JSON.parse(msg.content.toString());
    if (event === 'StockReserved') {
      console.log(`Sending confirmation email for order ${data.orderId}...`);
      console.log('Email sent.');
    }
  });
}
 
notificationService();