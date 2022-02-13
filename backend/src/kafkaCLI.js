const kafkaService = require('./services/kafka-service');
const readline = require('readline')

const run = async () => {
    console.log("Kafka CLI\nType 'run' to start Kafka Consumer.");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    rl.question("", userInput => {
        if (userInput === "run") {
            kafkaService.runConsumer();
        }
    });

}

run().catch(console.error)