/**
 * Test runner script for the Lift Logger application
 * 
 * This script automates running all tests and generating a coverage report.
 * It can be executed via `node scripts/run-tests.js`
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const TESTS_DIR = path.resolve(__dirname, '../src');
const TEST_PATTERN = '**/__tests__/**/*.test.js';
const COVERAGE_DIR = path.resolve(__dirname, '../coverage');

// ANSI color codes for output formatting
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Ensure coverage directory exists
if (!fs.existsSync(COVERAGE_DIR)) {
  fs.mkdirSync(COVERAGE_DIR, { recursive: true });
}

/**
 * Runs Jest with the specified arguments
 */
function runJest(args = []) {
  const command = `npx jest ${args.join(' ')}`;
  
  console.log(`${COLORS.bright}${COLORS.blue}Running command:${COLORS.reset} ${command}`);
  
  try {
    // Run Jest and capture output
    const output = execSync(command, { 
      stdio: 'inherit', 
      encoding: 'utf-8' 
    });
    return { success: true, output };
  } catch (error) {
    console.error(`${COLORS.red}Test execution failed:${COLORS.reset}`, error.message);
    return { success: false, error };
  }
}

/**
 * Main function to run tests
 */
async function main() {
  console.log(`\n${COLORS.bright}${COLORS.cyan}========================================${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}🏋️ Running Lift Logger Test Suite 🏋️${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}========================================${COLORS.reset}\n`);
  
  // Step 1: Run unit tests and generate coverage report
  console.log(`\n${COLORS.bright}${COLORS.yellow}Running unit tests with coverage...${COLORS.reset}\n`);
  const unitTestResult = runJest([
    '--coverage',
    '--coverageReporters=text-summary',
    '--testMatch', `"${TESTS_DIR}/${TEST_PATTERN}"`,
    '--verbose'
  ]);
  
  // Step 2: Summary
  console.log(`\n${COLORS.bright}${COLORS.cyan}========================================${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}             Test Summary              ${COLORS.reset}`);
  console.log(`${COLORS.bright}${COLORS.cyan}========================================${COLORS.reset}\n`);
  
  if (unitTestResult.success) {
    console.log(`${COLORS.green}✓ All tests passed!${COLORS.reset}\n`);
  } else {
    console.log(`${COLORS.red}✗ Some tests failed. Check the output above for details.${COLORS.reset}\n`);
    process.exit(1);
  }
  
  console.log(`${COLORS.cyan}Coverage report available at:${COLORS.reset} ${path.relative(process.cwd(), COVERAGE_DIR)}/lcov-report/index.html\n`);
}

// Run the main function
main().catch(error => {
  console.error(`${COLORS.red}Error running tests:${COLORS.reset}`, error);
  process.exit(1);
});