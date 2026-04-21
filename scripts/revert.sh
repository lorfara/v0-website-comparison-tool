#!/bin/bash
cd /vercel/share/v0-project
git checkout HEAD -- components/report-section.tsx
echo "Reverted components/report-section.tsx to last commit"
