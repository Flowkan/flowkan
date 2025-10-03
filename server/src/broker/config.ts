import "dotenv/config";

const rabbitHost = process.env.RABBITMQ_HOST || 'rabbitmq'

export const RABBITMQ_URL = process.env.RABBITMQ_BROKER_URL || "amqp://guest:guest@rabbitmq:5672/";     
//`amqp://guest:guest@${rabbitHost}:5672/`
  //process.env.RABBITMQ_BROKER_URL || "amqp://guest:guest@localhost:5672/"

  //"amqp://guest:guest@rabbitmq:5672/";
  

export const Queues = {
  EMAIL_QUEUE: "email_tasks",
  THUMBNAIL_QUEUE:"thumbnail_task"
};

export const Exchanges = {
  TASK_EXCHANGE: "flowkan_task_exchange",
};

export const ExchangeTypes = {
  DIRECT: "direct",
  TOPIC: "topic",
  FANOUT: "fanout",
};

//Keys para routing
export const RoutingKeys = {
    EMAIL_SEND: '*',
    THUMBNAIL_GENERATE: '*',
    FAIL_SEND_EMAIL:'dlx.email'
};

/**
 * DLQ Mangejo de mensajes muertos
 */

export const DLQ_EXCHANGE = 'dlx_exchange';

export const DLQ_Queues = {
  //Cola de email fallidos
  EMAIL_DLQ:'dlq_email_tasks'
}

// Enlaze de exchange con las colas
const Bindings = [
  {
    exchange:Exchanges.TASK_EXCHANGE,
    queue: Queues.EMAIL_QUEUE,
    routingKey:RoutingKeys.EMAIL_SEND
  },
  {
    exchange:Exchanges.TASK_EXCHANGE,
    queue: Queues.THUMBNAIL_QUEUE,
    routingKey:RoutingKeys.THUMBNAIL_GENERATE
  },
  {
    exchange:DLQ_EXCHANGE,
    queue: DLQ_Queues.EMAIL_DLQ,
    routingKey:RoutingKeys.EMAIL_SEND
  }
]

export const Topology = {
  exchanges: [
    {
      name: Exchanges.TASK_EXCHANGE,
      type: ExchangeTypes.DIRECT,
      options: { durable: true },
    },
    {
      name:DLQ_EXCHANGE,
      type:ExchangeTypes.DIRECT,
      options: { durable:true }
    }
  ],
  queues:[
    {
        name:Queues.EMAIL_QUEUE,
        options:{ durable:true }
    },
    {
        name:Queues.THUMBNAIL_QUEUE,
        options:{ durable:true }
    },
    {
      name:DLQ_Queues.EMAIL_DLQ,
      options:{ durable:true }
    }
  ],
  bindings:Bindings
};


