import axios from "axios";
import { notification } from "./alert";
import { GET_SHIPMENTS } from "./types";

export const bookNow = async (body, callback) => {
  try {
    const response = await axios.post("http://localhost:9999/sendMail", body);
    const { data, status } = response;
    if (data.success) {
      notification(data.message);
    } else {
      notification(data.message, "error");
    }
    if (callback) callback(data);
  } catch (error) {
    console.log(error);
  }
};

export const getShipments = (payload) => {
  const config = {
    method: "post",
    url: "https://go.freightdok.io/shipments",
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
    url: "http://localhost:5000/api/bid/biddings",
    headers: {
      "Content-Type": "application/json",
    },
  };

  dispatch({ type: GET_SHIPMENTS, payload: { data: {}, loading: true } });
  try {
    axios(config)
      .then(async function ({ data: { data: dbData = [] } = {} }) {
        const shipmentsResData = await getShipments(payload);

        const { data: { results = [] } = {} } = shipmentsResData;

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
          payload: { data: { results, totalResults: results.length }, loading: false },
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
