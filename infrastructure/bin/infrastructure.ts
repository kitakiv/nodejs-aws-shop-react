import 'source-map-support/register';
import { App, Stack, DefaultStackSynthesizer } from 'aws-cdk-lib';
import { StaticSite } from '../lib/infrastructure-stack';
import { Construct } from 'constructs';

class MyStaticSite extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      env: {
        account: '116981799075',
        region: 'eu-west-1'
      },
      synthesizer: new DefaultStackSynthesizer({
        qualifier: 'hgajghwxrh' // Change this to something unique
      })
    });

    new StaticSite(this, 'JSCCStaticSite');
  }
}

const app = new App();
new MyStaticSite(app, 'MyFrontendStack');
app.synth();
