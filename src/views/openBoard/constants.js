import moment from "moment";
import {requestPost} from "../../utils/request";
import {getGoUrl} from "../../config";
import {notification} from "../../actions/alert";

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

export const MC_NUMBER = '7865422'

export const bookNewTrulLoad = async (body, row) => {
  requestPost({uri: '/newTrulBookLoad', baseUrl: getGoUrl(), body})
      .then(async res => {
          const { data } = res || {};
          if(data.status === 'success') {
            //update loads table
            const {data, success} = await requestPost({uri: '/api/newtrulLoad', body: {...body, ...row, isBooked: true}})
            if(success) {
              notification(data.message);
            }
          }
          else {
            notification(data.message, data.status)
          }
      })
}

export const NEWTRUL = 'newTrul'
export const CHROBINSON = 'chRobinson'