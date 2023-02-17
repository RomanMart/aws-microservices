import {IFunction} from "aws-cdk-lib/aws-lambda";
import {Construct} from "constructs";
import {IQueue, Queue} from "aws-cdk-lib/aws-sqs";
import {Duration} from "aws-cdk-lib";
import {SqsEventSource} from "aws-cdk-lib/aws-lambda-event-sources";

interface IQueueProps {
    consumer: IFunction
}

export class QueueConstruct extends Construct {
    public readonly orderQueue: IQueue;

    constructor(scope: Construct, id: string, props: IQueueProps) {
        super(scope, id);


        //queue
        this.orderQueue = new Queue(this, 'OrderQueue', {
            queueName: 'OrderQueue',
            visibilityTimeout: Duration.seconds(30) // default value
        });

        props.consumer.addEventSource(new SqsEventSource(this.orderQueue, {
            batchSize: 1
        }));
    }
}