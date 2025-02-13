import 'source-map-support/register';
import { App, DefaultStackSynthesizer, Stack } from 'aws-cdk-lib';
import * as dotenv from 'dotenv';
import { StaticSite } from '../lib/infrastructure-stack';
import { Construct } from 'constructs';

dotenv.config();

class MyStaticSite extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: {
        account: process.env.AWS_ACCOUNT,
        region: process.env.AWS_REGION
      },
      synthesizer: new DefaultStackSynthesizer()
    });

    new StaticSite(this, 'JSCCStaticSite');
  }
}

const app = new App();
new MyStaticSite(app, 'MyFrontend');
app.synth();
