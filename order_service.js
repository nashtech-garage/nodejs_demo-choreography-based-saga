const amqp = require('amqplib');
 
async function orderService() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  await channel.assertExchange('ecommerce', 'fanout');
 
  // Simulate creating an order
  console.log('Creating order...');
  const order = { orderId: 1, customer: 'John Doe', amount: 100 };
  console.log('Order created:', order);
 
  // Emit the OrderCreated event
  channel.publish('ecommerce', '', Buffer.from(JSON.stringify({ event: 'OrderCreated', data: order })));
}
 
orderService();