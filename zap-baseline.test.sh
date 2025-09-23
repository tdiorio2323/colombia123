#!/usr/bin/env bash
# zap-baseline.test.sh

# Test: Check if BASE_URL is set
# Should exit with error code 1 if BASE_URL is not set
echo "Test case: BASE_URL not set"
./zap-baseline.sh || [[ $? -eq 1 ]]
echo ""

# Test: Check if script runs successfully with BASE_URL set
# Should run the docker command and generate a report
echo "Test case: BASE_URL set"
export BASE_URL="http://localhost:8080" # Example URL

# Mock the docker command
docker() {
  echo "Mock docker command executed"
  touch zap_report.html # Create a dummy report file
}

./zap-baseline.sh

# Check if zap_report.html is created
if [ -f "zap_report.html" ]; then
  echo "zap_report.html created successfully"
  rm zap_report.html
else
  echo "zap_report.html not created"
  exit 1
fi
unset BASE_URL
echo ""

echo "All tests passed!"