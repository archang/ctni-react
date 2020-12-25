#!/bin/bash
cd /home/ec2-user/server/src
npm start > output.txt 2>&1 &
pm2 start npm --name "CTNIReactApp" -- start
pm2 startup
pm2 save
pm2 restart all