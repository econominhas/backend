#!/usr/bin/env bash
bucket1="econominhas-public"
bucket2="econominhas-private"

if awslocal s3 ls "s3://$bucket1" 2>/dev/null; then
	echo "[INFO] $bucket1 bucket already exists"
else
	awslocal s3 mb s3://$bucket1
	echo "[INFO] $bucket1 created"
fi

if awslocal s3 ls "s3://$bucket2" 2>/dev/null; then
	echo "[INFO] $bucket2 bucket already exists"
else
	awslocal s3 mb s3://$bucket2
	echo "[INFO] $bucket2 created"
fi
