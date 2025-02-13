import { Stack, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class StaticSite extends Construct {
  constructor(parent: Construct, name: string) {
    super(parent, name);

    const siteBucket = new s3.Bucket(this, 'StaticSite', {
      bucketName: "nodejs-aws-shop-react-site",
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: new origins.S3Origin(siteBucket, {
          originAccessIdentity: undefined
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html'
        }
      ]
    });

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [siteBucket.arnForObjects('*')],
        principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
        conditions: {
          StringEquals: {
            'AWS:SourceArn': `arn:aws:cloudfront::${Stack.of(this).account}:distribution/${distribution.distributionId}`
          }
        }
      })
    );
    new s3deploy.BucketDeployment(this, 'Deploy', {
      sources: [s3deploy.Source.asset('../dist')],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'],
    });
  }
}
