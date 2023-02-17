import {Construct} from "constructs";
import {EventBus, Rule} from "aws-cdk-lib/aws-events";
import {SqsQueue} from "aws-cdk-lib/aws-events-targets";
import {IFunction} from "aws-cdk-lib/aws-lambda";
import {IQueue} from "aws-cdk-lib/aws-sqs";

interface IEventBusProps {
    publisherFunction: IFunction;
    targetQueue: IQueue;
}

export class EventbusConstruct extends Construct {

    constructor(scope: Construct, id: string, props: IEventBusProps) {
        super(scope, id);

        //eventbus
        const bus = new EventBus(this, 'EventBus', {
            eventBusName: 'EventBus'
        });

        const checkoutBasketRule = new Rule(this, 'CheckoutBasketRule', {
            eventBus: bus,
            enabled: true,
            description: 'When Basket microservice checkout the basket',
            eventPattern: {
                source: ['com.swn.basket.checkoutbasket'],
                detailType: ['CheckoutBasket']
            },
            ruleName: 'CheckoutBasketRule'
        });

        // need to pass target to Ordering Lambda service
        checkoutBasketRule.addTarget(new SqsQueue(props.targetQueue));

        bus.grantPutEventsTo(props.publisherFunction);

    }

}