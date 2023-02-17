import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {DynamodbConstruct} from "./dynamodb-construct";
import {MicroserviceConstruct} from "./microservice-construct";
import {ApiGatewayConstruct} from "./api-gateway-construct";
import {EventbusConstruct} from "./eventbus-construct";
import {QueueConstruct} from "./queue-construct";

export class AwsMicroservicesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const database = new DynamodbConstruct(this, "Database")

        const microservice = new MicroserviceConstruct(this, "Microservices", {
            productTable: database.productTable,
            basketTable: database.basketTable,
            orderTable: database.orderTable
        })

        new ApiGatewayConstruct(this, "ApiGateway", {
            productMicroservice: microservice.productFunction,
            basketMicroservice: microservice.basketFunction,
            orderingMicroservice: microservice.orderFunction
        });

        const queue = new QueueConstruct(this, 'Queue', {
            consumer: microservice.orderFunction
        });

        new EventbusConstruct(this, 'EventBus', {
            publisherFunction: microservice.basketFunction,
            targetQueue: queue.orderQueue
        });


    }
}
