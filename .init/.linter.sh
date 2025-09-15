#!/bin/bash
cd /home/kavia/workspace/code-generation/dashboard-ui-development-133257-133266/dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

