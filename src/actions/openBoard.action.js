import axios from "axios";
import { notification } from "./alert";
import { GET_SHIPMENTS } from "./types";
import { getBaseUrl, getGoUrl, production } from "../config";

export const bookNow = async (body, callback) => {
  try {
    const response = await axios.post(production.goLangMail, body);
    const { data } = response;
    if (data.success) {
      notification(data.message);
    } else {
      notification(data.message, "error");
    }
    if (callback) callback(data);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const getShipments = (payload) => {
  const config = {
    method: "post",
    url: production.goLangServerUrl + "/shipments",
    data: payload,
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  } catch (e) {
    console.log(e.message);
  }
};

export const getBiddings = (payload) => (dispatch) => {
  const config = {
    method: "get",
    url: getBaseUrl() + "/api/bid/biddings",
    headers: {
      "Content-Type": "application/json",
    },
  };

  dispatch({ type: GET_SHIPMENTS, payload: { data: {}, loading: true } });
  try {
    axios(config)
      .then(async function ({ data: { data: dbData = [] } = {} }) {
        const shipmentsResData = await getShipments(payload);

        const { data: { results = [], statusCode, message = '' } = {} } = shipmentsResData;
        if(statusCode === 401){
          notification(message, 'error');
        }

        results.forEach(function (shipment, index) {
          const { loadNumber } = shipment;
          dbData.forEach(function (bid) {
            if (
              parseInt(bid.loadNumber) === loadNumber &&
              bid.status === true
            ) {
              results.splice(index, 1);
            }
          });
        });
        //--------------------------
        dispatch({
          type: GET_SHIPMENTS,
          payload: {
            data: { results, totalResults: results.length },
            loading: false,
          },
        });
        //--------------------------
      })
      .catch(function (error) {
        console.log(error);
        dispatch({
          type: GET_SHIPMENTS,
          payload: { data: {}, loading: false, message: error.message },
        });
      });
  } catch (e) {
    console.log(e.message);
  }
};
