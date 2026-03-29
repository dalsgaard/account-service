#!/bin/bash
set -e
URL=$(aws cloudformation describe-stacks \
  --stack-name AccountServiceStack \
  --region eu-north-1 \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text)
API_ID=$(echo "$URL" | sed 's|https://||' | cut -d'.' -f1)
sed -i '' "s/default: .*/default: $API_ID/" openapi/account.oas.yaml
echo "Updated apiId to $API_ID"
