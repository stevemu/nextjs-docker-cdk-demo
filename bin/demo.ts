#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DemoStack } from '../lib/demo-stack';

const app = new cdk.App();
const imageTag: string | undefined = app.node.tryGetContext('imageTag');

if (!imageTag) {
  throw new Error('imageTag not found')
}
// console.log(`using imageTag: ${imageTag}`)
new DemoStack(app, 'DemoStack', {env: {account: 'aws-account-id', region: 'us-east-1'}, imageTag});
