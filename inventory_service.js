const amqp = require('amqplib');
 
async function inventoryService() {
  const connection = await amqp.connect('amqp://localhost:5672');
  const channel = await connection.createChannel();
  await channel.assertExchange('ecommerce', 'fanout');
  const queue = await channel.assertQueue('', { exclusive: true });
  channel.bindQueue(queue.queue, 'ecommerce', '');
 
  channel.consume(queue.queue, (msg) => {
    const { event, data } = JSON.parse(msg.content.toString());
    if (event === 'PaymentProcessed') {
      console.log(`Reserving stock for order ${data.orderId}...`);
      // Simulate stock reservation
      const stockAvailable = true;
 
      if (stockAvailable) {
        console.log('Stock reserved.');
        channel.publish('ecommerce', '', Buffer.from(JSON.stringify({ event: 'StockReserved', data })));
      } else {
        console.log('Stock unavailable.');
        channel.publish('ecommerce', '', Buffer.from(JSON.stringify({ event: 'StockUnavailable', data })));
      }
    }
  });
}
 
inventoryService();