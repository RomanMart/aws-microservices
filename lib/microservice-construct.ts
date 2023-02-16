import {Construct} from "constructs";
import {NodejsFunction, NodejsFunctionProps} from "aws-cdk-lib/aws-lambda-nodejs";
import {Runtime} from "aws-cdk-lib/aws-lambda";
import {join} from "path";
import {ITable} from "aws-cdk-lib/aws-dynamodb";

interface IMicroserviceProps {
    productTable: ITable;
}

export class MicroserviceConstruct extends Construct {

    public readonly productFunction: NodejsFunction;
    constructor(scope: Construct, id: string, props: IMicroserviceProps) {
        super(scope, id);


        const nodeJsFunctionProps: NodejsFunctionProps = {
            bundling: {
                externalModules: [
                    'aws-sdk'
                ]
            },
            environment: {
                PRIMARY_KEY: 'id',
                DYNAMODB_TABLE_NAME: props.productTable.tableName
            },
            runtime: Runtime.NODEJS_18_X
        };

        const productFunction = new NodejsFunction(this, 'productLambdaFunction', {
            entry: join(__dirname, `/../src/product/index.js`),
            ...nodeJsFunctionProps
        });

        props.productTable.grantReadWriteData(productFunction);

        this.productFunction = productFunction;
    }

}