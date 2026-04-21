#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

try {
  process.chdir('/vercel/share/v0-project');
  
  // Get all commits for the file
  const logs = execSync('git log --oneline components/report-section.tsx').toString().split('\n');
  console.log('Recent commits:');
  logs.slice(0, 10).forEach((log, i) => console.log(`${i}: ${log}`));
  
  // Load commit from 37 versions ago (approximately)
  if (logs.length > 37) {
    const targetCommit = logs[37].split(' ')[0];
    console.log(`\nLoading version at commit: ${targetCommit}`);
    execSync(`git checkout ${targetCommit} -- components/report-section.tsx`);
    console.log('Version 37 loaded successfully');
  } else {
    console.log(`Only ${logs.length} commits found. Loading the oldest available version.`);
    const oldestCommit = logs[logs.length - 1].split(' ')[0];
    execSync(`git checkout ${oldestCommit} -- components/report-section.tsx`);
  }
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
