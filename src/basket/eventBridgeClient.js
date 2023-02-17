// Create an Amazon EventBridge service client object.
import {EventBridgeClient} from "@aws-sdk/client-eventbridge";

const REGION = "us-east-1"; //e.g. "us-east-1"
export const ebClient = new EventBridgeClient({region: REGION});
