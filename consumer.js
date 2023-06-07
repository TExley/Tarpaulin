require('dotenv').config()
const { connectToDb } = require('./lib/mongo')
const { connectToRabbitMQ, getChannel, queue } = require('./lib/rabbitmq')

async function run () {
    await connectToRabbitMQ(queue)
    const channel = getChannel()

    channel.consume(queue, async msg => {
        channel.ack(msg)
    })
}

connectToDb(function () { 
    console.log(`== Consumer is running on queue \"${queue}\"`)
    run() 
})