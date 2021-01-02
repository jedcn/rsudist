function isDate(input) {
  return input instanceof Date;
}

function isInteger(input) {
  return Number.isInteger(input);
}

function isArray(input) {
  return Array.isArray(input);
}

/**
 * Grant: An amount of equity that vests over 16 quarters starting on
 * a certain date.
 *
 * @constructor
 * @param {number} sharesGranted - the total number of RSUs over 4 years
 * @param {Date} dateVestFrom - the Date that these RSUs start vesting
 */
class Grant {
  constructor(sharesGranted, dateVestFrom) {
    this.sharesGranted = sharesGranted;
    this.dateVestFrom = dateVestFrom;
  }
}

/**
 * Distribution: An event where some quantity (1/16th) of the total RSUs in a Grant vests on
 * a certain date.
 *
 * @constructor
 * @param {number} quantity - the number of RSUs vesting on this day
 * @param {Date} date - the Date that these RSUs vest
 */
class Distribution {
  constructor(quantity, date) {
    this.quantity = quantity;
    this.date = date;
  }
}

/**
 * Create a new Grant based on an array that looks like either of these:
 * 
 * [ {integer}, {Date} ]
 * [ {Date}, {integer} ]
 */
function createGrantFromArray(array) {
  let sharesGranted;
  let dateOrStringVestFrom;
  let dateVestFrom;
  if (isInteger(array[0])) {
    sharesGranted = array[0];
    dateOrStringVestFrom = array[1];
  } else if (isInteger(array[1])) {
    sharesGranted = array[1];
    dateOrStringVestFrom = array[0];
  } else {
    throw "Invalid argument(s): must supply a whole number of sharesGranted";
  }
  if (isDate(dateOrStringVestFrom)) {
    dateVestFrom = dateOrStringVestFrom;
  } else {
    dateVestFrom = new Date(dateOrStringVestFrom);
  }
  return new Grant(sharesGranted, dateVestFrom);
}

/**
 * Create an array of Grant(s) based on inputs provided in a Google Sheet.
 * 
 * It can accept invocations that look like any of these:
 * 
 * =RSUDIST(A1:A2)
 * =RSUDIST("1/1/2020", 16)
 * =RSUDIST(16, "1/1/2020")
 */
function parseArguments_(rsuDistArgs) {
  const grants = [];
  if (rsuDistArgs.length == 1 && isArray(rsuDistArgs[0])) {
    //
    // Handling invocation by reference to a range of
    // integer/Date pairs:
    //
    // -> RSUDIST(A1:A2) or RSUDIST(A1:B2)
    // 
    const rangeValues = rsuDistArgs[0];
    for(let i = 0; i < rangeValues.length; i++) {
      grants.push(createGrantFromArray(rangeValues[i]));
    }
  }
  if (rsuDistArgs.length == 2) {
    //
    // Handling invocation by value with two arguments that are
    // integer/String pairs:
    //
    // -> =RSUDIST(16, "1/1/2020") or =RSUDIST("1/1/2020", 16)
    // 
    grants.push(createGrantFromArray(rsuDistArgs));
  }
  return grants;
}

function combineAllDistributions_(arrayOfArrayOfDistributions) {
  let arrayOfAllDistributions = [];
  arrayOfArrayOfDistributions.forEach(function(arrayOfDistributions) {
    arrayOfAllDistributions = arrayOfAllDistributions.concat(arrayOfDistributions);
  });

  let arrayOfAllDistributionsSorted = arrayOfAllDistributions.sort(function(a, b) {
    return a.date.getTime() - b.date.getTime();
  });

  // Go through the sorted array of Distributions and if any Distributions have the same
  // date, then combine the quantity of the RSUs to be received on that day
  const firstDistribution = arrayOfAllDistributionsSorted[0];
  const mergedDistributions = [ new Distribution(firstDistribution.quantity, firstDistribution.date) ];
  let lastMergedDistribution = mergedDistributions[0];
  for(let i = 1; i < arrayOfAllDistributionsSorted.length; i++) {
    let distributionToConsider = arrayOfAllDistributionsSorted[i];
    if (distributionToConsider.date.getTime() === lastMergedDistribution.date.getTime()) {
      lastMergedDistribution.quantity += distributionToConsider.quantity;
    } else {
      lastMergedDistribution = new Distribution(distributionToConsider.quantity, distributionToConsider.date);
      mergedDistributions.push(lastMergedDistribution);
    }
  }
  return mergedDistributions;
}

/** 
 * Determine the date (at midnight) upon which an equity event will occur given
 * information about when it starts.
 * 
 * Midnight is relevant here because if you set a date (and time) to midnight
 * it looks like a simple date in Google Sheets, eg. "1/1/2019." If you're off by an hour
 * you'll get something like: "1/1/2019 1:00"
 * 
 * @param {String} vestFromMonth The month the grant began in, such as "01"
 * @param {String} vestFromYear The year the grant began in, such as "2019"
 * *param {number} distributionNumber The number of the equity event (between 1 -> 16)
 * *param {string} sheetTimeZone The timezone to use for determining when midnight is, such as "America/New_York"
 */
function findDateOfDistribution_(vestFromMonth, vestFromYear, distributionNumber, sheetTimeZone) {
  // Determine **year** of distribution (distYear) 
  const numberOfMonthsInFuture = vestFromMonth + distributionNumber * 3;
  let yearsInFuture;
  if (numberOfMonthsInFuture % 12 == 0) {
    yearsInFuture = (numberOfMonthsInFuture / 12) - 1;
  } else {
    yearsInFuture = Math.floor(numberOfMonthsInFuture / 12);
  }
  const distYear = vestFromYear + yearsInFuture;
  
  // Determine **month** of distribution (distYear) 
  let distMonth = (vestFromMonth + ((distributionNumber % 4) * 3)) % 12;
  if (distMonth == 0) {
    distMonth = 12;
  }
  const distMonthString = distMonth < 10 ? "0" + distMonth : distMonth;
  
  // Determine exact time that midnight is on this date in the future
  const firstAttemptString = distYear + "-" + distMonthString + "-01T" + "00:00:00Z";
  const firstAttempt = new Date(firstAttemptString);
  const hourOfFirstAttemptInTimeZone = Utilities.formatDate(firstAttempt, sheetTimeZone, "HH");
  const hoursToAdd = 24 - parseInt(hourOfFirstAttemptInTimeZone, 10);
  
  const secondAttempt = new Date(distYear + "-" + distMonthString + "-01T" + "0" + hoursToAdd + ":00:00Z");
  const result = new Date(secondAttempt);
  return result;
}
  
const GRANT_VEST_COUNT = 16;
  
function getYearFor(date, timeZone) {
  return Utilities.formatDate(date, timeZone, "YYYY");
}
  
function getMonthFor(date, timeZone) {
  return Utilities.formatDate(date, timeZone, "M");
}

/**
 * Create an array where each entry represents a distribution of equity to someone.
 * 
 * Each distribution of equity is a pairing of a number (how many RSUs will someone
 * get?) and a Date (when it will happen?)
 * 
 * @param {Grant} grant Information about the total number of RSUs and when it begins to vest
 * @param {string} timeZone The timezone of the Google Sheet that will determine when midnight is
 */
function createAllDistributionsForGrant_(grant, timeZone) {
  let sharesGranted = grant.sharesGranted;
  let dateVestFrom = grant.dateVestFrom;

  // If vests could include fractional RSUs-- this is what they'd each be:
  const evenlyDividedRSUsPerVest = sharesGranted / GRANT_VEST_COUNT;
  
  // But they can't be fractional. So here's the smallest amount you'd get:
  const smallestRsusPerGrant = Math.floor(evenlyDividedRSUsPerVest);
  
  // And here's a fractional amount that's due to *you* each time you get
  // the smallest amount
  const fractionalRSUsPerVest = evenlyDividedRSUsPerVest - smallestRsusPerGrant;
  
  // If your amount of granted RSUs is evenly divisible by 16-- then this will always
  // be zero. But! In most cases there will be some left over and we'll use this to
  // keep track of that left over.
  let rsusLeftover = 0;
  
  const vestFromMonth = parseInt(getMonthFor(dateVestFrom, timeZone), 10);
  const vestFromYear = parseInt(getYearFor(dateVestFrom, timeZone), 10);
  const result = [];
  for(let i = 0; i < 16; i++) {
    let dateOfDistribution = findDateOfDistribution_(vestFromMonth, vestFromYear, i + 1, timeZone)
    let rsusOfDistribution = smallestRsusPerGrant;
    rsusLeftover = rsusLeftover + fractionalRSUsPerVest;
    if (rsusLeftover >= 1) {
      rsusOfDistribution = rsusOfDistribution + 1;
      rsusLeftover = rsusLeftover - 1;
    }
    result.push(new Distribution(rsusOfDistribution, dateOfDistribution));
  }
  return result;
}

/**
 * Translate an array of Distributions into an array of arrays to meet the
 * expectation that a Custom Function in Google Sheets provides a grid of data
 * via returning an array of arrays.
 */
function translateDistributionsToArray_(distributions) {
  return distributions.map(function(distribution) {
    return [ distribution.quantity, distribution.date ];
  });
}

/**
 * RSUDIST takes one or more grants and generates a distribution schedule.
 * 
 * RSUDIST(16, "1/1/2020")
 * RSUDIST("1/1/2020", 16)
 * RSUDIST(A1:B2) 
 * RSUDIST(A1:B3)
 * 
 * @param {number} sharesGranted the number of RSUs in a grant
 * @param {Date} dateVestFrom the date the RSUs start vesting
 */
function RSUDIST() {
  // This is the one line that requires oAuth consent: we need to read the timezone of the
  // individual spreadsheet in which this code is running.
  const timeZone = SpreadsheetApp.getActive().getSpreadsheetTimeZone();

  const grants = parseArguments_(arguments);

  let distributions;
  if (grants.length === 1) {
    distributions = createAllDistributionsForGrant_(grants[0], timeZone);
  } else {
    const allDistributions = [];
    for(let i = 0; i < grants.length; i++) {
      let distributionsForThisOneGrant = createAllDistributionsForGrant_(grants[i], timeZone);
      allDistributions.push(distributionsForThisOneGrant);
    }
    distributions = combineAllDistributions_(allDistributions);
  }
  return translateDistributionsToArray_(distributions);
}
