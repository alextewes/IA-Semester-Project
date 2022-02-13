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
            console.log({
                partition,
                offset: message.offset,
                value: message.value.toString(),
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