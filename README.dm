# CSV Generator Readme

This project generates policy and claims data in CSV format based on the configuration provided. The data is generated using the faker library and can be customized for different regions (Australia and US).

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [File Structure](#file-structure)
4. [Environment Variables](#environment-variables)
5. [Usage](#usage)
6. [Rules](#rules)
6. [Tickets](#tickets)
7. policyBrandsNumbersMap.json

## Prerequisites
- **Node.js (>= 12.x)**
- **npm (>= 6.x)**

## Installation
Clone the repository

## Environment
- you can adjust chunk size here
 const chunkSize = 10000; // Adjust the chunk size as needed
Important: 
- the chunk size is correlates to the row tables, for example
if the chunk size is 10 000 and index rows of input file are 20 000 you will get output_policy_chunk_0 and output_policy_chunk_1
- so then the claims are correlated to the porfolio index tables, so you will get the output_claims_chunk_0 and output_claims_chunk_1,
that way you can combain multiple chunks if you dont have one input csv file

## Usage
```bash
npm run start:policy
npm run start:claims
npm run start:policy_us
npm run start:claims_us

## File Structure

csv-generator/
│
├── config.js
├── index.js
├── imported_csv/
│   ├── amfam_duplicates.csv
│   ├── au_export_0k.csv
├── policyBrandsNumbersMap.json
└── output/
    └── # generated files will be placed here

## Rules

### Matching Rows

The following columns must match when exporting in policies and claims:
* Policy numbers
* Tags
* Peril Type
* Brand/carrier

### Coverage Types

Note that Coverage Types are related to either a home or office building, and are dependent on the Policy Type:
If Policy Type is Home or Commercial, then Coverage Type can be:
* Building
* Building + Contents
* Contents
* If Policy Type is Motor, Coverage Type is null.
* Human Hazards

Important: None of the Human Hazards should be used on the Motor policies.

## Tickets
PDEV-799

### AU
PDEV-806 - au_export_100k.csv, ..., can be used for input csv AU policy creation

### US
PDEV-807 - US address export - attached export csv-s can be used for inputFileUS, but there are only 80k address
WEBX-2735 - also can be used for US address, there are around 50k addresses


## policyBrandsNumbersMap.json

- used for some rules to be comblied, so that we have the same policyNumber, brandName/carrier and that  Human Hazards should be used on the Motor policies.

 "2": {
    "policyNumber": "e2d0211e-4453-4df3-93e9-92d90ea3b0ff",
    "carrier": "",
    "brandName": "Good Value Savings",
    "policyType": "Motor",
    "hazard": "Natural Hazard"
  },

## Watch for diffrent input file address format, these are supported, if there will be diffrent format you need to adjust extractPostcode function in config.js file
    AU
    336 MITCHELL RD, ALEXANDRIA NSW
    23 BOOMERANG AV, ALDINGA BEACH SA 5173
    US
    6900 W Grant Ranch Blvd, Denver, CO 80123