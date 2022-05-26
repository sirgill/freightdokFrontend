export const productionPayload = {
  pageIndex: 0,
  pageSize: 100,
  regionCode: "NA",
  carrierCode: "T2244688",
  excludedModes: ["B"],
  origins: [
    {
      countryCode: "US",
      stateCodes: ["IN", "OH", "IL", "MO", "KY"],
    },
  ],
  destinations: [
    {
      countryCode: "US",
      stateCodes: ["IN", "OH", "IL", "MO", "KY"],
    },
  ],
  loadDistanceRange: {
    unitOfMeasure: "Standard",
    min: 0,
    max: 5000,
  },
  equipmentLengthRange: {
    unitOfMeasure: "Standard",
    min: 0,
    max: 53,
  },
  availableForPickUpByDateRange: {
    min: "2022-05-27",
    max: "2022-06-02",
  },
  teamLoad: false,
  stfLoad: false,
  hazMatLoad: false,
  tankerLoad: false,
  chemicalSolutionLoad: false,
  highValueLoad: false,
  sortCriteria: {
    field: "LoadNumber",
    direction: "ascending",
  },
};

export const developmentPayload = {
  pageIndex: 0,
  pageSize: 100,
  regionCode: "NA",
  modes: ["V", "R"],
  carrierCode: "T2244688",
};
