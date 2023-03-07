
import { Construct } from 'constructs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack, StackProps } from 'aws-cdk-lib';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { ApplicationProtocol } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import { ContainerImage } from 'aws-cdk-lib/aws-ecs';

export interface DemoStackProps extends StackProps {
  imageTag: string;
}

export class DemoStack extends Stack {
  constructor(scope: Construct, id: string, props?: DemoStackProps) {
    super(scope, id, props);

    const repository = Repository.fromRepositoryName(
      this,
      'id',
      'repositoryName'
    );

    const image = ContainerImage.fromEcrRepository(repository, props?.imageTag);

    new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'DemoEcsService', {
      memoryLimitMiB: 1024,
      desiredCount: 1,
      cpu: 512,
      assignPublicIp: true,
      taskImageOptions: {
        image,
        containerPort: 3000,
      },
      taskSubnets: {
        subnets: [ec2.Subnet.fromSubnetId(this, 'subnet', 'subnet-xxx')],
      },
      vpc: ec2.Vpc.fromLookup(this, 'DefaultVPC', {isDefault: true}),
      domainName: 'demo.com',
      domainZone: HostedZone.fromLookup(this, 'DemoZone', {
        domainName: 'demo.com'
      }),
      redirectHTTP: true,
      protocol: ApplicationProtocol.HTTPS,
    });
  }
}
