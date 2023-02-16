import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import {DynamodbConstruct} from "./dynamodb-construct";
import {MicroserviceConstruct} from "./microservice-construct";
import {ApiGatewayConstruct} from "./api-gateway-construct";

export class AwsMicroservicesStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const database = new DynamodbConstruct(this, "Database")
        const microservice = new MicroserviceConstruct(this, "Microservice", {
            productTable: database.productTable
        })

        const apiGateway = new ApiGatewayConstruct(this, "ApiGateway", {
             microservice: microservice.productFunction
        })

    }
}
