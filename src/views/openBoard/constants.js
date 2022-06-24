import moment from "moment";

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
    min: moment().format("YYYY-MM-DD"),
    max: moment().add(5, 'days').format('YYYY-MM-DD'),
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

export const getParsedLoadEquipment = (row = {}) => {
  let {
        equipment: {length: {standard = ""} = {}} = {},
        modes = [],
      } = row || {},
      modesString = modes.join(", ");
  if (standard) {
    standard = standard + "ft";
  }
  if (modesString) {
    modesString = modesString + ",";
  }

  return {
    modesString, standard
  }
}