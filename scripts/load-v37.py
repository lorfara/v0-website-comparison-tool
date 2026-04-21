#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir('/vercel/share/v0-project')

# Try to get git log to find version 37
try:
    # First, let's see what's available
    result = subprocess.run(['git', 'log', '--oneline', '-n', '50'], capture_output=True, text=True)
    print("Recent commits:")
    print(result.stdout)
    
    # Try to checkout version 37
    checkout = subprocess.run(['git', 'checkout', 'v37', '--', 'components/report-section.tsx'], 
                            capture_output=True, text=True)
    if checkout.returncode == 0:
        print("\n✓ Successfully loaded version 37 of report-section.tsx")
    else:
        # Try HEAD~37 (37 commits back)
        checkout = subprocess.run(['git', 'checkout', 'HEAD~37', '--', 'components/report-section.tsx'], 
                                capture_output=True, text=True)
        if checkout.returncode == 0:
            print("\n✓ Successfully loaded report-section.tsx from 37 commits ago")
        else:
            print(f"Error: {checkout.stderr}")
            sys.exit(1)
            
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
