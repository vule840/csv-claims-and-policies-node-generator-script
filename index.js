import { createObjectCsvWriter } from 'csv-writer';
import selectedConfig from './config.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import { faker } from '@faker-js/faker';

//console.log(selectedConfig);

// Function to load policy numbers map from JSON file
const loadPolicyNumbersMap = () => {
  const policyNumbersFilePath = 'policyBrandsNumbersMap.json'; // File path for policy numbers map
  try {
    const policyNumbersData = fs.readFileSync(policyNumbersFilePath, 'utf8');
    return JSON.parse(policyNumbersData);
  } catch (error) {
    console.error('Error loading policyBrandsNumbersMap:', error.message);
    return {}; // Return empty object or handle error as per your application's logic
  }
};


// Function to save policyNumbersMap to JSON file
const savePolicyNumbersMap = (policyBrandsNumbersMap) => {
  try {
    const policyNumbersFilePath = 'policyBrandsNumbersMap.json'; // File path for policy numbers map
    fs.writeFileSync(policyNumbersFilePath, JSON.stringify(policyBrandsNumbersMap, null, 2));
    console.log(`Policy numbers map updated and saved to ${policyNumbersFilePath}`);
  } catch (error) {
    console.error('Error saving policyBrandsNumbersMap:', error.message);
  }
};

// Function to process and generate records in chunks and create new CSV for each chunk
const processCsvInChunks = async (inputFilePath, headers, generateRecord, chunkSize) => {
  console.log('inputFilePath',);

  let recordsBatch = [];
  let index = 0;
  let chunkIndex = 0;

  const policyBrandsNumbersMap = loadPolicyNumbersMap(); // Load policy numbers map

  const processBatch = () => {
    const outputFilePath = `output/output_${process.env.CONFIG_NAME}_chunk_${chunkIndex}.csv`;
    const csvWriter = createObjectCsvWriter({
      path: outputFilePath,
      header: headers,
    });

    return csvWriter.writeRecords(recordsBatch).then(() => {
      savePolicyNumbersMap(policyBrandsNumbersMap); // Save policy numbers to map
      console.log(`Written ${index} records so far to ${outputFilePath}`);
      recordsBatch = []; // Clear the batch
      chunkIndex++;
    });
  };
  return new Promise((resolve, reject) => {
    if (inputFilePath) {
      const inputStream = fs.createReadStream(inputFilePath).pipe(csvParser());

      inputStream.on('data', (record) => {
        const generatedRecord = generateRecord(record, index, policyBrandsNumbersMap);

        recordsBatch.push(generatedRecord);

        if (generatedRecord.policyNumber) {
          //console.log('generatedRecord', generatedRecord);
          let policyTypeHelper = generatedRecord.policyType || ''
          let hazardHelper

          // rule#, if we have Motor we dont want Human hazard
          if (policyTypeHelper === 'Motor') {
            hazardHelper = faker.helpers.arrayElement(['Natural Hazard'])
          }
          else {
            hazardHelper = faker.helpers.arrayElement(['Natural Hazard', 'Human Hazard'])
          }
          policyBrandsNumbersMap[index] = {
            policyNumber: generatedRecord.policyNumber,
            carrier: generatedRecord.carrier || '',
            brandName: generatedRecord.brandName || '',
            policyType: policyTypeHelper,//generatedRecord.policyType || '',
            hazard: hazardHelper //faker.helpers.arrayElement(['Natural Hazard', 'Human Hazard']),

          };
        }
        //console.log('policyBrandsNumbersMap',policyBrandsNumbersMap);
        index++;
       // console.log(recordsBatch.length, chunkSize)
        if (recordsBatch.length >= chunkSize) {

          const outputFilePath = `output/output_${process.env.CONFIG_NAME}_chunk_${chunkIndex}.csv`;
          const csvWriter = createObjectCsvWriter({
            path: outputFilePath,
            header: headers,
          });

          // Write the current batch to the CSV
          csvWriter.writeRecords(recordsBatch).then(() => {
            // Save policy numbers to map

            savePolicyNumbersMap(policyBrandsNumbersMap); // Save policy numbers to map

            console.log(`Written ${index} records so far to ${outputFilePath}`);
          });
          recordsBatch = []; // Clear the batch
          chunkIndex++;
        }
      });

      inputStream.on('end', () => {
        if (recordsBatch.length > 0) {
          const outputFilePath = `output/output_${process.env.CONFIG_NAME}_chunk_${chunkIndex}.csv`;
          const csvWriter = createObjectCsvWriter({
            path: outputFilePath,
            header: headers,
          });

          // Write any remaining records
          csvWriter.writeRecords(recordsBatch).then(() => {
            savePolicyNumbersMap(policyBrandsNumbersMap); // Save policy numbers to map

            console.log(`Finished writing remaining records to ${outputFilePath}`);
            resolve();
          });
        } else {
          resolve();
        }
      });

      inputStream.on('error', (error) => {
        console.error('Error reading input CSV:', error);
        reject(error);
      });
    } else {
      // this part runs when you dont have InputFile for input data and that is when you are generating claims, there is only policyBrandsNumbersMap.js input data
      return new Promise(async (resolve, reject) => {
        try {
          while (true) {
            const generatedRecord = generateRecord(null, index, policyBrandsNumbersMap);
            recordsBatch.push(generatedRecord);
            //console.log('generatedRecord claims', generatedRecord);

            // we dont need this when generating claims but can be used if want some data from claims policyBrandsNumbersMap.json
            // if (generatedRecord.policyNumber) {to 
            //   policyBrandsNumbersMap[index] = {
            //     policyNumber: generatedRecord.policyNumber,
            //     carrier: generatedRecord.carrier || '',
            //     brandName: generatedRecord.brandName || '',
            //     policyType: generatedRecord.policyType || '',
            //   };
            // } 

            index++;

            if (recordsBatch.length >= chunkSize) {
              await processBatch();
            }

            // You can add a condition to break the loop, for now, we'll assume an infinite loop
            // Add a condition to stop generating records if needed
          }
        } catch (error) {
          console.error('Error generating records:', error);
          reject(error);
        }
      });
    }
  });
};

// Main function to start processing
const startProcessing = async () => {
  // console.log(selectedConfig);
  const inputFilePath = selectedConfig.inputFilePath || null;
  const headers = selectedConfig.headers;
  const generateRecord = selectedConfig.generateRecord;
  const chunkSize = 10000; // Adjust the chunk size as needed

  try {
    await processCsvInChunks(inputFilePath, headers, generateRecord, chunkSize);
    console.log('CSV file processed and written successfully');
  } catch (error) {
    console.error('Error processing CSV file:', error);
  }
};

startProcessing();

