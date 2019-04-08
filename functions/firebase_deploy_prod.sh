#!/usr/bin/env bash

firebase use futbol-cards;
firebase deploy --only functions;
