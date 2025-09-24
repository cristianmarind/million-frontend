#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Setting up testing environment for InDise Frontend...\n');

try {
  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Please run this script from the project root.');
    process.exit(1);
  }

  // Install dependencies with legacy peer deps to handle React 19 compatibility
  console.log('📦 Installing testing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

  // Verify Jest configuration
  console.log('\n🔧 Verifying Jest configuration...');
  if (!fs.existsSync('jest.config.js')) {
    console.error('❌ jest.config.js not found');
    process.exit(1);
  }

  if (!fs.existsSync('jest.setup.js')) {
    console.error('❌ jest.setup.js not found');
    process.exit(1);
  }

  // Check if test files exist
  console.log('\n📁 Checking test files...');
  const testFiles = [
    'app/src/state/__tests__/FiltersContext.test.tsx',
    'app/src/core/infraestructure/clients/__tests__/InternalApiClient.test.ts',
    'app/src/core/infraestructure/controllers/__tests__/PropertiesController.test.ts',
    'app/src/core/infraestructure/repositories/__tests__/PropertiesRepository.test.ts',
    'app/properties/__tests__/page.test.tsx',
    'app/properties/__tests__/PropertiesViewWrapper.test.tsx'
  ];

  const missingTests = testFiles.filter(file => !fs.existsSync(file));
  if (missingTests.length > 0) {
    console.warn('⚠️  Some test files are missing:');
    missingTests.forEach(file => console.warn(`   - ${file}`));
  } else {
    console.log('✅ All test files found');
  }

  // Run a quick test to verify setup
  console.log('\n🧪 Running test verification...');
  try {
    execSync('npm test -- --passWithNoTests', { stdio: 'pipe' });
    console.log('✅ Test setup verified successfully');
  } catch (error) {
    console.warn('⚠️  Test verification failed, but setup is complete');
    console.warn('   You can run "npm test" to see detailed error messages');
  }

  console.log('\n🎉 Testing environment setup complete!');
  console.log('\n📋 Available commands:');
  console.log('   npm test              - Run all tests');
  console.log('   npm run test:watch    - Run tests in watch mode');
  console.log('   npm run test:coverage - Run tests with coverage report');
  console.log('\n📖 See TESTING.md for detailed documentation');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
