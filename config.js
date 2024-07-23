import { faker } from '@faker-js/faker';


// Util functions
// Extract postcode function and remove it from the address
const extractPostcode = (address) => {
  console.log(address);
   // AU format - 23 BOOMERANG AV, ALDINGA BEACH SA 5173
  // Match a 4-digit AU ZIP code at the end of the string
  // US format - 6900 W Grant Ranch Blvd, Denver, CO 80123, USA or in some input csv queries the zipCode is exported already
  // Check if the address already includes the postcode as a separate part
  // Example: "336 MITCHELL RD, ALEXANDRIA NSW"
  if (address.match(/(NSW|QLD|SA|VIC|WA|TAS|ACT|NT)\s*\d{4}$/)) {
    // Return address as is with no postcode extraction needed
    return { postcode: '', address };
  }

  // AU format - 23 BOOMERANG AV, ALDINGA BEACH SA 5173
  // Match a 4-digit AU ZIP code at the end of the string
  const auMatches = address.match(/\b\d{4}\b(?!.*\d)/);

  // Match a 5-digit US ZIP code
  const usMatches = address.match(/\b\d{5}\b/);

  let postcode = '';
  let addressWithoutPostcode = address;

  if (usMatches && (address.endsWith(usMatches[0]) || address.includes(usMatches[0] + ', USA'))) {
    postcode = usMatches[0];
    addressWithoutPostcode = address.replace(postcode, '').trim().replace(/,\s*$/, '');
  } else if (auMatches && address.endsWith(auMatches[0])) {
    postcode = auMatches[0];
    addressWithoutPostcode = address.replace(postcode, '').trim().replace(/,\s*$/, '');
  }

  return { postcode, address: addressWithoutPostcode };
};


// Function to swap month and day
function swapMonthAndDayForAu(dateString) {
  // Split the date string into [year, month, day]
  const [year, month, day] = dateString.split('-');

  // Rearrange to [year, day, month]
  const newDateString = [year, day, month].join('-');

  return newDateString;
}


const policy_au = [
  { id: 'indexRows', title: 'Index Rows' },
  { id: 'policyNumber', title: 'Policy Number' },
  { id: 'address', title: 'Address' },
  { id: 'postCode', title: 'Post Code' },
  { id: 'brandName', title: 'Brand Name' },
  { id: 'productClass', title: 'Product class' },
  { id: 'lineOfBusiness', title: 'Line of Business' },
  { id: 'policyType', title: 'Policy Type' },
  { id: 'premiumInsured', title: 'Premium Insured' },
  { id: 'totalRebuild', title: 'Total Rebuild' },
  { id: 'yearBuilt', title: 'Year Built' },
  { id: 'renewalDate', title: 'Renewal Date' },
  //{ id: 'insuranceType', title: 'Insurance Type' },
  //{ id: 'sumInsured', title: 'Sum Insured' },
  // { id: 'riskDescription', title: 'Risk Description' },
  { id: 'dynamic_1', title: 'Dynamic_1' },
  { id: 'dynamic_2', title: 'Dynamic_2' },
  { id: 'dynamic_3', title: 'Dynamic_3' },
  { id: 'gnaf', title: 'gnaf' },

];
const claims_au = [
  { id: 'indexRows', title: 'Index Rows' },
  { id: 'brand', title: 'Brand' },
  { id: 'policyType', title: 'Policy Type' },
  { id: 'claimType', title: 'Claim Type' },
  { id: 'perilType', title: 'Peril Type' },
  { id: 'coverageType', title: 'Coverage Type' },
  { id: 'lossDate', title: 'Loss Date' },
  { id: 'claimStatus', title: 'Claim Status' },
  { id: 'reportOnlyFlag', title: 'Report Only Flag' },
  { id: 'claimNumber', title: 'Claim Number' },
  { id: 'policyNumber', title: 'Policy Number' },
  { id: 'tags', title: 'Tags' },
  { id: 'initialClaimReserve', title: 'Initial Claim Reserve' },
  { id: 'netIncurredCost', title: 'Net Incurred Cost' },
  { id: 'grossIncurredCost', title: 'Gross Incurred Cost' },
  { id: 'lodgementDate', title: 'Lodgement Date' },

  // Add more headers as needed
];

const policy_us_headers = [
  { id: 'indexRows', title: 'Index Rows' },
  { id: 'policyNumber', title: 'Policy Number' },
  { id: 'address', title: 'Address' },
  { id: 'zipCode', title: 'Zip Code' },
  { id: 'carrier', title: 'Carrier' },
  { id: 'productClass', title: 'Product Class' },
  { id: 'lineOfBusiness', title: 'Line of Business' },
  { id: 'policyType', title: 'Policy Type' },
  { id: 'premiumInsured', title: 'Premium Insured' },
  { id: 'totalRebuild', title: 'Total Rebuild' },
  { id: 'yearBuilt', title: 'Year Built' },
  { id: 'renewalDate', title: 'Renewal Date' },
  { id: 'dynamic1', title: 'Dynamic_1' },
  { id: 'dynamic2', title: 'Dynamic_2' },
  { id: 'dynamic3', title: 'Dynamic_3' },
];
const claims_us_headers = [
  { id: 'indexRows', title: 'Index Rows' },
  { id: 'carrier', title: 'Carrier' },
  { id: 'policyType', title: 'Policy Type' },
  { id: 'claimType', title: 'Claim Type' },
  { id: 'perilType', title: 'Peril Type' },
  { id: 'coverageType', title: 'Coverage Type' },
  { id: 'lossDate', title: 'Date of Loss' },
  { id: 'claimStatus', title: 'Claim Status' },
  { id: 'claimNumber', title: 'Claim Number' },
  { id: 'policyNumber', title: 'Policy Number' },
  { id: 'tags', title: 'Tags' },
  { id: 'initialClaimReserve', title: 'Current Reserve' },
  { id: 'netIncurredCost', title: 'Incurred Expenses to Date' },
  { id: 'grossIncurredCost', title: 'Gross Incurred Cost' },
  { id: 'lodgementDate', title: 'First Notice of Loss Date' },
  // Add more headers as needed
];

const inputFilePathAU = 'imported_csv/au_export_0k.csv'; // Update with your actual input file path

export const policy = {
  headers: policy_au,
  inputFilePath: inputFilePathAU,
  generateRecord: (inputRecord, index) => {
    const lineOfBusiness = faker.helpers.arrayElement(['Commercial', 'Consumer']);
    let policyType;

    if (lineOfBusiness === 'Commercial') {
      policyType = faker.helpers.arrayElement(['Commercial', 'Motor']);
    } else if (lineOfBusiness === 'Consumer') {
      policyType = faker.helpers.arrayElement(['Home', 'Motor']);
    }

    const policyNumber = faker.string.uuid();
    const { postcode, address } = extractPostcode(inputRecord['address']);

    return {
      indexRows: index + 1,
      gnaf: inputRecord['gnaf'], // Adjust as per your actual column name in input CSV
      address,
      postCode: postcode || inputRecord['postcode'],//
      policyNumber,
      brandName: faker.helpers.arrayElement(["Value Insurance",
        "Good Value Savings",
        "Optimal Value",
        "Fireproof Insurance",
        "Value Savings",
        "Rock Solid Insurance",
        "Trusted Insured",
        "Best Insurance",
        "Reliable Protection",
        "Ace Insurance",
        "Prime Insurance",
        "Foremost Insurance"]),
      productClass: faker.helpers.arrayElement(['Rental', 'Homeowner']),
      lineOfBusiness,
      policyType,
      premiumInsured: Math.round(faker.finance.amount({ min: 500, max: 2500, decimalPlaces: 0 })),
      totalRebuild: Math.round(faker.finance.amount({ min: 10000, max: 50000, decimalPlaces: 0 })),
      yearBuilt: faker.number.int({ min: 1990, max: 2022 }), // Adjust the year range as needed
      renewalDate: swapMonthAndDayForAu(faker.date.future().toISOString().split('T')[0]),
      //sumInsured: faker.finance.amount({ min: 10000, max: 1000000, decimalPlaces: 0 }),
      //riskDescription: faker.lorem.sentence(),
      dynamic_1: faker.helpers.arrayElement(['dynamic_1_type_1', 'dynamic_1_type_2', 'dynamic_1_type_3']),
      dynamic_2: faker.helpers.arrayElement(['dynamic_2_type_1', 'dynamic_2_type_2', 'dynamic_2_type_3']),
      dynamic_3: faker.helpers.arrayElement(['dynamic_3_type_1', 'dynamic_3_type_2', 'dynamic_3_type_3']),
      // Add more fields as needed

    }

  },
};

//const inputFilePath2 = 'imported_csv/AU-20231107-claims.csv'; // Update with your actual input file path

export const claims = {
  headers: claims_au,
  inputFilePath: null,
  generateRecord: (inputRecord, index, policyBrandsNumbersMap) => {
    const claimType = policyBrandsNumbersMap[index]['hazard'] //faker.helpers.arrayElement(['Natural Hazard', 'Human Hazard'])

    const claimStatus = faker.helpers.arrayElement(['Closed', 'Open']);
    const reportOnlyFlag = claimStatus === 'Closed' ? 0 : 1;
    //const coverageType = faker.helpers.arrayElement(['Contents', 'Building', 'Building + Contents']);
    //const policyType = faker.helpers.arrayElement(['Home', 'Commercial', 'Motor']);
    let policyType
    let perilType
    if (claimType === 'Natural Hazard') {
      perilType = faker.helpers.arrayElement(['Wind', 'Fire', 'Flood', 'Hail', 'Bushfire', 'Impact', 'Lighting', 'Other', 'Rain', 'Cyclone', 'Runoff', 'Snow', 'Storm Debris Impact', 'Storm Or Rainwater', 'Storm Surge', 'Tornado', 'Tsunami']);
      policyType = policyBrandsNumbersMap[index]['policyType'] //faker.helpers.arrayElement(['Home', 'Commercial', 'Motor']); 
    } else if (claimType === 'Human Hazard') {
      perilType = faker.helpers.arrayElement(['Motor Burnout', 'Loss Or Damage By Tenants', 'Loss Or Damage By Tenants - Rent Default', 'Ingress Of Water Whilist Driving/Sailing']);
      policyType = policyBrandsNumbersMap[index]['policyType']// faker.helpers.arrayElement(['Home', 'Commercial']);
    }

    // rule# All 3 Coverage types are actually only related to either a home or office building. So if Policy Type is Home or Commercial then Coverage Type can be Building, Building + Contents or Contents. If Policy Type is Motor, Coverage type would be null.    
    let coverageType
    if (policyType === 'Motor') {
      coverageType = 'NA'
    } else {
      coverageType = faker.helpers.arrayElement(['Contents', 'Building', 'Building + Contents'])
    }

    return {
      indexRows: index + 1,
      brand: policyBrandsNumbersMap[index]['brandName'],
      policyType, //faker.helpers.arrayElement(['Home', 'Commercial', 'Motor']),
      claimType,
      perilType,
      coverageType, //faker.helpers.arrayElement(['Contents', 'Building', 'Building + Contents']),
      lossDate: faker.date.future().toISOString().split('T')[0],
      claimStatus: claimStatus,
      reportOnlyFlag: reportOnlyFlag,
      claimNumber: faker.string.uuid(),
      policyNumber: policyBrandsNumbersMap[index]['policyNumber'], // Use mapped policyNumber or generate a new one
      tags: [perilType],
      initialClaimReserve: Math.round(faker.finance.amount({ min: 500, max: 2500, decimalPlaces: 0 })),
      netIncurredCost: Math.round(faker.finance.amount({ min: 10000, max: 50000, decimalPlaces: 0 })),
      grossIncurredCost: Math.round(faker.finance.amount({ min: 10000, max: 50000, decimalPlaces: 0 })),
      lodgementDate: faker.date.future().toISOString().split('T')[0],
      // Add more fields as needed
    };
  },
};
const inputFileUS= 'imported_csv/amfam_duplicates.csv'; // Update with your actual input file path
//amfam_duplicates.csv

// Define policy configuration for the US
export const policy_us = {
  headers: policy_us_headers,
  inputFilePath: inputFileUS,
  generateRecord: (inputRecord, index, policyBrandsNumbersMap) => {
    const lineOfBusiness = faker.helpers.arrayElement(['Commercial', 'Consumer']);
    let policyType;

    if (lineOfBusiness === 'Commercial') {
      policyType = faker.helpers.arrayElement(['Commercial', 'Motor']);
    } else if (lineOfBusiness === 'Consumer') {
      policyType = faker.helpers.arrayElement(['Home', 'Motor']);
    }

    const policyNumber = faker.string.uuid();
    //policyNumbersMap[inputRecord['address']] = policyNumber;
    const { postcode, address } = extractPostcode(inputRecord['address']);

    return {
      indexRows: index + 1,
      policyNumber,
      address:  address,//inputRecord['address_us'] || inputRecord['address'], //add the input row of address input file  //policyBrandsNumbersMapUS['address]
      // need after extract code
      zipCode:  postcode,//inputRecord['site_zip'],
      carrier: faker.helpers.arrayElement(["Value Savings",
        "Rock Solid Insurance",
        "Trusted Insured",
        "Super Insurance",
        "Reliable Protection",
        "Optimal Value"]),
      productClass: faker.helpers.arrayElement(['Rental', 'Homeowner']),
      lineOfBusiness,
      policyType,
      premiumInsured: Math.round(faker.finance.amount({ min: 500, max: 10000, decimalPlaces: 0 })),
      totalRebuild:  Math.round(faker.finance.amount({ min: 100000, max: 1000000, decimalPlaces: 0 })),
      yearBuilt: faker.number.int({ min: 1990, max: 2022 }),
      renewalDate: faker.date.future().toISOString().split('T')[0],
      dynamic1: faker.lorem.word(),
      dynamic2: faker.lorem.word(),
      dynamic3: faker.lorem.word(),
    };
  }
};

//const inputFilePath4 = 'imported_csv/export_US_withparcels.csv'; // Update with your actual input file path
//imported_csv/export_US_withparcels.csv

export const claims_us = {
  headers: claims_us_headers,
  inputFilePath: null,
  generateRecord: (inputRecord, index, policyBrandsNumbersMap) => {
    const claimType = policyBrandsNumbersMap[index]['hazard'] //faker.helpers.arrayElement(['Natural Hazard', 'Human Hazard'])
    //const coverageType = faker.helpers.arrayElement(['Contents', 'Building', 'Building + Contents'])
    const policyType = policyBrandsNumbersMap[index]['policyType']  //faker.helpers.arrayElement(['Home', 'Commercial', 'Motor']);

    let perilType
    if (claimType === 'Natural Hazard') {
      perilType = faker.helpers.arrayElement(['Wind', 'Fire', 'Flood', 'Hail', 'Bushfire', 'Impact', 'Lighting', 'Other', 'Rain', 'Cyclone', 'Runoff', 'Snow', 'Storm Debris Impact', 'Storm Or Rainwater', 'Storm Surge', 'Tornado', 'Tsunami']);
    } else if (claimType === 'Human Hazard') {
      perilType = faker.helpers.arrayElement(['Motor Burnout', 'Loss Or Damage By Tenants', 'Loss Or Damage By Tenants - Rent Default', 'Ingress Of Water Whilist Driving/Sailing']);
    }

    // rule# All 3 Coverage types are actually only related to either a home or office building. So if Policy Type is Home or Commercial then Coverage Type can be Building, Building + Contents or Contents. If Policy Type is Motor, Coverage type would be null.  
    let coverageType
    if (policyType === 'Motor') {
      coverageType = null
    } else {
      coverageType = faker.helpers.arrayElement(['Contents', 'Building', 'Building + Contents'])
    }
    const claimStatus = faker.helpers.arrayElement(['Closed', 'Open']);
    const reportOnlyFlag = claimStatus === 'Closed' ? 0 : 1;
    return {
      indexRows: index + 1,
      carrier: policyBrandsNumbersMap[index]['carrier'],
      policyType,
      claimType,
      perilType,
      coverageType,
      lossDate: faker.date.future().toISOString().split('T')[0],
      claimStatus: claimStatus,
      reportOnlyFlag: reportOnlyFlag,
      claimNumber: faker.string.uuid(),
      policyNumber: policyBrandsNumbersMap[index]['policyNumber'], //|| faker.string.uuid(), // Use mapped policyNumber or generate a new one
      initialClaimReserve: Math.round(faker.finance.amount({ min: 500, max: 2500, decimalPlaces: 0 })),
      netIncurredCost: Math.round(faker.finance.amount({ min: 10000, max: 50000, decimalPlaces: 0 })),
      grossIncurredCost: Math.round(faker.finance.amount({ min: 10000, max: 50000, decimalPlaces: 0 })),
      lodgementDate: faker.date.future().toISOString().split('T')[0],
      tags: [perilType],
      // Add more fields as needed
    }

  },
};

const configs = { policy, claims, policy_us, claims_us };

const selectedConfig = configs[process.env.CONFIG_NAME] || policy;

export default selectedConfig;
