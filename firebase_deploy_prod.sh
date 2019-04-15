#!/usr/bin/env bash

echo "Deploying firebase functions to LIVE"
firebase use futbol-cards;
firebase deploy --only functions;
