#!/usr/bin/env python3
import subprocess
import sys

try:
    # Revert report-section.tsx to the last working commit
    result = subprocess.run(
        ['git', 'checkout', 'HEAD~1', 'components/report-section.tsx'],
        cwd='/vercel/share/v0-project',
        capture_output=True,
        text=True
    )
    
    if result.returncode == 0:
        print("Successfully reverted report-section.tsx to last working version")
        print(result.stdout)
    else:
        print("Error reverting:", result.stderr)
        sys.exit(1)
except Exception as e:
    print(f"Exception: {e}")
    sys.exit(1)
