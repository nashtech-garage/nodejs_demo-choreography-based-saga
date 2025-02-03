const amqp = require('amqplib');
 
async function paymentService() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  await channel.assertExchange('ecommerce', 'fanout');
  const queue = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(queue.queue, 'ecommerce', '');
 
  channel.consume(queue.queue, (msg) => {
    const { event, data } = JSON.parse(msg.content.toString());
    if (event === 'OrderCreated') {
      console.log(`Processing payment for order ${data.orderId}...`);
      // Simulate payment processing
      const paymentSuccess = true;
 
      if (paymentSuccess) {
        console.log('Payment processed.');
        channel.publish('ecommerce', '', Buffer.from(JSON.stringify({ event: 'PaymentProcessed', data })));
      } else {
        console.log('Payment failed.');
        channel.publish('ecommerce', '', Buffer.from(JSON.stringify({ event: 'PaymentFailed', data })));
      }
    }
  });
}
 
paymentService();