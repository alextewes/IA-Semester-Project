const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'client1',
    brokers: ['sepp-kafka.inf.h-brs.de:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'consumerIaFsot' });

const runProducer = async (log) => {
    try {
        await producer.connect()
        await producer.send({
            topic: 'ia-fsot',
            messages: [
                { value: log },
            ],
        })
    }
    catch (e) {
        console.log(e);
    }

};

const runConsumer = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'ia-fsot', fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            let timestamp = message.timestamp;
            timestamp = (timestamp - (timestamp % 1000)) / 1000; // remove last 3 digits of number
            const date = new Date(timestamp * 1000);
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
                UTCtimestamp: date
            })
        },
    })
};

const createLogFromBonusComputation = (bonusComputationID, operation) => {
    return `BonusComputation with ID: ${bonusComputationID} ${operation}!`;
}

module.exports = {
    runProducer, runConsumer, createLogFromBonusComputation
}