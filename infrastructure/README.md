# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## Prerequisites

- Node.js and npm installed
- AWS CLI installed and configured with your AWS account
- AWS CDK CLI installed globally: `npm install -g aws-cdk`

### Available Scripts


# Install dependencies
npm install

# Build the React application
npm run build

# Deploy infrastructure and application
npm run deploy

# AWS Infrastructure Deployment Guide

## Deployment Steps

1. **Install Dependencies**
   ```bash
   npm install
2. **Build the Application**
   ```bash
   npm run build
3. **Configure Environment**
   ```bash
   cd infrastructure
create .env in root directory copy variables from .env.example and write yours

AWS_ACCOUNT=<your-account-number>
AWS_REGION=eu-west-1


4. **Deploy Infrastructure**
!!!If you've never used CDK in this AWS account/region:!!!

   ```bash
   cd infrastructure
   ```

5. **Deploy Infrastructure**
    ```bash
   cdk deploy
   ```