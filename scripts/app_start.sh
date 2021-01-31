#!/bin/bash
cd /home/ec2-user/server/src
npm run build
serve -s build > output.txt 2>&1 &