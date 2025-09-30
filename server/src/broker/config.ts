import "dotenv/config";

export const RABBITMQ_URL =
  process.env.RABBITMQ_BROKER_URL || "amqp://guest:guest@rabbitmq:5672/";

export const Queues = {
  EMAIL_QUEUE: "email_tasks",
};

export const Exchanges = {
  TASK_EXCHANGE: "flowkan_task_exchange",
};

export const ExchangeTypes = {
  DIRECT: "direct",
  TOPIC: "topic",
  FANOUT: "fanout",
};

export const Topology = {
  exchanges: [
    {
      name: Exchanges.TASK_EXCHANGE,
      type: ExchangeTypes.DIRECT,
      options: { durable: true },
    },
  ],
  queues:[
    {
        name:Queues.EMAIL_QUEUE,
        options:{ durable:true }
    }
  ]
};
