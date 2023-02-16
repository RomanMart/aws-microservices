import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {DynamodbConstruct} from "./dynamodb-construct";
import {MicroserviceConstruct} from "./microservice-construct";
import {ApiGatewayConstruct} from "./api-gateway-construct";

export class AwsMicroservicesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const database = new DynamodbConstruct(this, "Database")
        const microservice = new MicroserviceConstruct(this, "Microservices", {
            productTable: database.productTable,
            basketTable: database.basketTable
        })
        new ApiGatewayConstruct(this, "ApiGateway", {
            productMicroservice: microservice.productFunction,
            basketMicroservice: microservice.basketFunction
        });
    }
}
