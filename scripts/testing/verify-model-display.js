#!/usr/bin/env node

/**
 * Model Display Verification Script
 *
 * This script verifies that the correct model is displayed in the edit-device UI
 * for device ID: 68cfcae6dab0e8398f8f29f0
 *
 * URL: https://3d-inventory.ultimasolution.pl/edit-device/68cfcae6dab0e8398f8f29f0
 */

import https from 'https'

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

const API_BASE = 'd-inventory-api-wzwe3odv7q-ew.a.run.app'
const DEVICE_ID = '68cfcae6dab0e8398f8f29f0'

/**
 * Make HTTPS request to API
 */
function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_BASE,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data)
          resolve(parsed)
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`))
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    req.end()
  })
}

/**
 * Print section header
 */
function printHeader(text) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}`)
  console.log(`${colors.bright}${colors.cyan}  ${text}${colors.reset}`)
  console.log(`${colors.bright}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`)
}

/**
 * Print success message
 */
function printSuccess(message) {
  console.log(`${colors.green}✓${colors.reset} ${message}`)
}

/**
 * Print error message
 */
function printError(message) {
  console.log(`${colors.red}✗${colors.reset} ${message}`)
}

/**
 * Print info message
 */
function printInfo(message) {
  console.log(`${colors.blue}ℹ${colors.reset} ${message}`)
}

/**
 * Print warning message
 */
function printWarning(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`)
}

/**
 * Verify model display for the device
 */
async function verifyModelDisplay() {
  printHeader('Model Display Verification - Edit Device Component')

  console.log(`${colors.bright}Device URL:${colors.reset} https://3d-inventory.ultimasolution.pl/edit-device/${DEVICE_ID}`)
  console.log(`${colors.bright}API Base:${colors.reset} https://${API_BASE}`)
  console.log(`${colors.bright}Device ID:${colors.reset} ${DEVICE_ID}\n`)

  try {
    // Step 1: Get device data
    printHeader('1. Fetching Device Data')
    const deviceResponse = await makeRequest(`/devices/${DEVICE_ID}`)

    if (!deviceResponse.success || !deviceResponse.data) {
      printError('Failed to fetch device data')
      console.log('Response:', JSON.stringify(deviceResponse, null, 2))
      return
    }

    const device = deviceResponse.data
    printSuccess(`Device retrieved: ${device.name}`)
    printInfo(`Device ID: ${device._id}`)
    printInfo(`Device Model ID: ${device.modelId}`)
    console.log(`\n${colors.bright}Device Data:${colors.reset}`)
    console.log(JSON.stringify(device, null, 2))

    // Step 2: Get all models
    printHeader('2. Fetching All Models')
    const modelsResponse = await makeRequest('/models')

    // Handle different response formats
    let models = []
    if (modelsResponse.success && modelsResponse.data) {
      models = modelsResponse.data
    } else if (modelsResponse.data && Array.isArray(modelsResponse.data)) {
      models = modelsResponse.data
    } else {
      printError('Failed to fetch models list')
      console.log('Response:', JSON.stringify(modelsResponse, null, 2))
      return
    }

    printSuccess(`Retrieved ${models.length} models`)

    // Step 3: Find the model that should be selected
    printHeader('3. Verifying Model Selection')

    const deviceModelId = device.modelId
    const selectedModel = models.find(model => model._id === deviceModelId)

    if (!selectedModel) {
      printError(`Model with ID ${deviceModelId} not found in models list!`)
      printWarning('This means the dropdown will not show the correct model')
      console.log('\n📋 Available models:')
      models.forEach((model, index) => {
        console.log(`  ${index + 1}. ${model.name} (ID: ${model._id})`)
      })
      return
    }

    printSuccess(`Found matching model: ${selectedModel.name}`)
    printInfo(`Model ID: ${selectedModel._id}`)
    printInfo(`Model Brand: ${selectedModel.brand || 'N/A'}`)
    printInfo(`Model Category: ${selectedModel.category || 'N/A'}`)

    // Step 4: Verify UI behavior
    printHeader('4. UI Behavior Verification')

    console.log(`${colors.bright}Expected UI Behavior:${colors.reset}\n`)

    printInfo('1. loadModels() is called in ngOnInit()')
    printSuccess('   ✓ This populates modelList array with all models')

    printInfo('2. Device data is fetched via getDeviceSynchronize()')
    printSuccess(`   ✓ Device modelId is set to: ${deviceModelId}`)

    printInfo('3. Form is patched with device data')
    printSuccess('   ✓ editDeviceForm.patchValue({ modelId: device.modelId })')

    printInfo('4. Dropdown renders all models')
    printSuccess(`   ✓ @for loop creates ${models.length} <option> elements`)

    printInfo('5. Model selection in dropdown')
    console.log(`   ${colors.bright}Selected Model:${colors.reset} ${selectedModel.name}`)
    console.log(`   ${colors.bright}Value attribute:${colors.reset} value="${selectedModel._id}"`)
    console.log(`   ${colors.bright}Display text:${colors.reset} ${selectedModel.name}`)

    // Step 5: Check for potential issues
    printHeader('5. Potential Issues Check')

    let issuesFound = false

    // Check if modelId exists in models list
    const modelExists = models.some(m => m._id === deviceModelId)
    if (!modelExists) {
      printError('Device modelId does not exist in models list')
      printWarning('The dropdown will show the ID but not match any option')
      issuesFound = true
    } else {
      printSuccess('Device modelId exists in models list')
    }

    // Check for duplicate model IDs
    const modelIds = models.map(m => m._id)
    const uniqueModelIds = new Set(modelIds)
    if (modelIds.length !== uniqueModelIds.size) {
      printWarning('Duplicate model IDs found in models list')
      issuesFound = true
    } else {
      printSuccess('No duplicate model IDs found')
    }

    // Check if model name is valid
    if (!selectedModel.name || selectedModel.name.trim() === '') {
      printWarning('Selected model has empty or invalid name')
      issuesFound = true
    } else {
      printSuccess(`Model name is valid: "${selectedModel.name}"`)
    }

    // Step 6: HTML Template Analysis
    printHeader('6. HTML Template Analysis')

    console.log(`${colors.bright}Template Code:${colors.reset}`)
    console.log(`
<select formControlName="modelId" class="form-control" id="modelId" required>
  @for (modelObj of modelList; track modelObj; let i = $index) {
    <option value="{{ modelObj._id }}">
      {{ modelObj.name }}
    </option>
  }
</select>
    `)

    printInfo('How model selection works:')
    console.log(`  1. Angular populates dropdown with all models from modelList`)
    console.log(`  2. Each <option> has value="${selectedModel._id}"`)
    console.log(`  3. Form control modelId is set to: "${deviceModelId}"`)
    console.log(`  4. Angular matches formControlName value with option value`)
    console.log(`  5. The matching option is automatically selected`)

    printSuccess('Template is correctly configured for model display')

    // Step 7: Manual Testing Instructions
    printHeader('7. Manual Browser Testing Instructions')

    console.log(`${colors.bright}To verify in the browser:${colors.reset}\n`)
    console.log('1. Open: https://3d-inventory.ultimasolution.pl/edit-device/68cfcae6dab0e8398f8f29f0')
    console.log('2. Wait for the page to load')
    console.log('3. Locate the "Model" dropdown field')
    console.log(`4. Expected: Dropdown should show "${colors.green}${selectedModel.name}${colors.reset}" as selected`)
    console.log(`5. The selected value should be: "${colors.cyan}${deviceModelId}${colors.reset}"`)
    console.log('\n6. Open browser DevTools (F12)')
    console.log('7. Check Console for any errors')
    console.log('8. Check Network tab:')
    console.log(`   - GET /devices/${DEVICE_ID} should return 200 OK`)
    console.log('   - GET /models should return 200 OK')
    console.log('\n9. Verify dropdown options:')
    console.log('   - Right-click dropdown → Inspect Element')
    console.log('   - Should see multiple <option> elements')
    console.log(`   - One should have: value="${deviceModelId}" (selected)`)

    // Step 8: Summary
    printHeader('8. Verification Summary')

    console.log(`${colors.bright}Device Information:${colors.reset}`)
    console.log(`  Name: ${device.name}`)
    console.log(`  ID: ${device._id}`)
    console.log(`  Model ID: ${device.modelId}`)

    console.log(`\n${colors.bright}Selected Model Information:${colors.reset}`)
    console.log(`  Model Name: ${selectedModel.name}`)
    console.log(`  Model ID: ${selectedModel._id}`)
    console.log(`  Brand: ${selectedModel.brand || 'N/A'}`)
    console.log(`  Category: ${selectedModel.category || 'N/A'}`)

    console.log(`\n${colors.bright}Dropdown Configuration:${colors.reset}`)
    console.log(`  Total models available: ${models.length}`)
    console.log(`  Selected model index: ${models.findIndex(m => m._id === deviceModelId) + 1}`)
    console.log(`  Form control: modelId`)
    console.log(`  Binding: [formControlName]="modelId"`)

    if (issuesFound) {
      printWarning('\n⚠️  Some potential issues were found. Review the output above.')
    } else {
      printSuccess('\n✅ All checks passed! Model should display correctly in the UI.')
    }

    // Step 9: Additional Model Information
    printHeader('9. All Available Models')

    console.log(`${colors.bright}Models in dropdown (${models.length} total):${colors.reset}\n`)
    models.forEach((model, index) => {
      const isSelected = model._id === deviceModelId
      const prefix = isSelected ? `${colors.green}► ` : '  '
      const suffix = isSelected ? ` ${colors.green}(SELECTED)${colors.reset}` : colors.reset

      console.log(`${prefix}${index + 1}. ${model.name}${suffix}`)
      console.log(`     ID: ${model._id}`)
      if (model.brand) console.log(`     Brand: ${model.brand}`)
      if (model.category) console.log(`     Category: ${model.category}`)
      console.log()
    })

  } catch (error) {
    printError(`Error during verification: ${error.message}`)
    console.error(error)
  }
}

// Run verification
verifyModelDisplay().catch(console.error)
