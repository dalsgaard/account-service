#!/bin/bash
aws cloudformation describe-stacks \
  --stack-name AccountServiceStack \
  --region eu-north-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text
