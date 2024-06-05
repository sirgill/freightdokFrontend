import axios from "axios";
import { notification, setAlert } from "./alert";
import {
  GET_LOADS,
  GET_LOAD,
  LOAD_ERROR,
  ADD_LOAD,
  PATCH_PICKUP,
  PICKUP_ERROR,
  PATCH_DROP,
  DROP_ERROR,
  DELETE_LOAD,
  DELETE_LOAD_ERROR,
  UPDATE_LOAD,
  UPDATE_LOAD_ERROR,
  LOAD_DOC_DELETE,
  LOAD_DOC_UPLOAD,
  RETURNED_SEARCHED_LOADS,
  RESET_SEARCHED_LOADS,
  INVOICE_CREATED,
  SELECT_LOAD,
  INVOICE_LOAD_FETCHED,
  MERGE_LOAD_DOCS,
  RESET_INVOICE_GENERATED,
} from "./types";
import {requestDelete, requestGet, requestPatch, requestPost} from "../utils/request";

// import { proxy } from "../../package.json";

export const SERVER_ADDRESS = "https://api.freightdok.io";
// Get current users loads
export const getLoads = (page = 0, limit = 100, module = "", search='') => async (dispatch) => {
      try {
        const { success, data } = await requestGet({
          uri: `/api/load/me?page=${page + 1}&limit=${limit}&module=${module}&search=${search}`
        });
        if (success) {
          dispatch({
            type: GET_LOADS,
            payload: { loads: data, page, limit },
          });
        } else {
          notification(data.message, 'error');
        }
      } catch (err) {
        dispatch(setAlert(err.message, "error"));
      }
    };
export const deleteLoadDocument =
  (load_id, doc_type, doc_name) => async (dispatch) => {
    try {
      const url = `/api/load/remove/doc/${load_id}/${doc_type}/${doc_name}`;
      await axios.delete(url);
      dispatch({
        type: LOAD_DOC_DELETE,
        payload: { load_id, doc_type },
      });
    } catch (err) {
      dispatch(setAlert(err.message, "error"));
    }
  };

export const uploadLoadDocument =
  (load_id, doc_type, documents) => async (dispatch) => {
    try {
      const url = `/api/load/upload/load/${load_id}/${doc_type}`;
      const form = new FormData();
      for (let doc of documents) form.append(doc_type, doc);
      const response = await axios.patch(url, form);
      const { file_data } = response.data;
      dispatch({
        type: LOAD_DOC_UPLOAD,
        payload: { file_data, load_id, doc_type },
      });
    } catch (err) {
      dispatch(setAlert(err.message, "error"));
    }
  };

export const generateInvoice = (load_id, data) => async (dispatch) => {
  try {
    await axios.post("/api/invoice", {
      load_id,
      ...data,
    });
    dispatch({
      type: INVOICE_CREATED,
      payload: { load_id },
    });
  } catch (err) {
    dispatch(setAlert(err.message, "error"));
  }
};

export const searchLoads = (page = 0, limit = 15, search = "", module = "") => async (dispatch) => {
  try {
    const url = `/api/load/me?page=${page + 1
      }&limit=15&search=${search}&module=${module}`;
    const res = await axios.get(url);
    dispatch({
      type: RETURNED_SEARCHED_LOADS,
      payload: { data: res.data, page, limit, search },
    });
  } catch (err) {
    dispatch(setAlert(err.message, "error"));
  }
};

export const resetLoadsSearch =
  (listBarType = "") =>
    async (dispatch, getState) => {
      dispatch({ type: RESET_SEARCHED_LOADS });
      const {
        load: { page, rowsPerPage },
      } = getState();
      // dispatch(getLoads(+page, +rowsPerPage, listBarType));
    };

export const selectLoad = (input = null) => ({
  type: SELECT_LOAD,
  payload: input,
});

// Get post
export const getLoad = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/loads/${id}`);

    dispatch({
      type: GET_LOAD,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.message, "error"));
  }
};

//add load
export const addLoad = (formData, callback) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const {data, success} = await requestPost({uri: '/api/load', body: formData})
    if(success){
      dispatch({
        type: ADD_LOAD,
        payload: data,
      });

      notification("Load Created")
      if (callback) {
        callback(success, data)
      }
    } else {
      notification(data.message, 'error')
    }
  } catch (err) {
    dispatch(setAlert(err.message, "error"));
    console.log(err)
  }
};

export const updateLoad = (formData, module = "", bucketFiles = {}, callback) => async (dispatch, getState) => {
  try {
    const form = new FormData();
    for (let key of Object.keys(formData)) {
      if (["rateConfirmation", "proofDelivery"].indexOf(key) < 0) {
        const data = formData[key];
        const isArray = Array.isArray(data);
        const isNull = data === null;
        let dataToSend = isArray && !isNull ? JSON.stringify(data) : data;
        form.append(key, dataToSend);
      }
    }
    form.append('bucketFiles', JSON.stringify(bucketFiles))
    for (let key of ["rateConfirmation", "proofDelivery", "accessorialsFiles"]) {
      const files = formData[key];
      if (files) for (let file of files) form.append(key, file);
    }

    const { success, data } = await requestPatch({ uri: "/api/load/modify", body: form })
    if (success) {
      notification('Load Updated')
    }
    const {
      load: {
        search: { page, limit, query },
      },
    } = getState();
    if (!query) dispatch(getLoads(0, 5, module));
    else dispatch(searchLoads(page, limit, query));
    callback(success, data)
  } catch (err) {
    notification(err.message, "error");
  }
};

export const downloadDocuments = (file_name) => {
  axios({
    url: "/api/load/download/" + file_name,
    method: "GET",
    responseType: "blob",
  }).then((res) => {
    const parts = res.config.url.split("/");
    const name = parts[parts.length - 1];
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
  });
};

//add pickup

//patch pickup
export const patchPickup = (load_id, pickup) => async (dispatch) => {
  try {
    const res = await axios.patch(
      `/api/load/pickup?load_id=${load_id}`,
      pickup
    );
    dispatch({
      type: PATCH_PICKUP,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.message, "error"));
  }
};

//patch drop
export const patchDrop = (load_id, drop) => async (dispatch) => {
  try {
    const res = await axios.patch(`/api/load/drop?load_id=${load_id}`, drop);
    dispatch({
      type: PATCH_DROP,
      payload: res.date,
    });
  } catch (err) {
    dispatch(setAlert(err.message, "error"));
  }
};

// Delete a load
export const deleteLoad = (load_id, callback) => async (dispatch) => {
  try {
    const { success, data } = await requestDelete({ uri: '/api/load', body: { data: { load_id: load_id } } })
    notification(data.message, success ? 'success' : 'error');
    if (success) {
      dispatch({
        type: DELETE_LOAD,
        payload: load_id,
      });
    }
    callback && callback(success, data)
  } catch (err) {
    notification(err.message, 'error')
  }
};

export const mergeDocuments = (data, headers) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/load/invoice/merge_docs`, data, headers);
    console.log("Response :", res);
    dispatch({
      type: MERGE_LOAD_DOCS,
      payload: res.data,
    });
  } catch (err) {
    dispatch(setAlert(err.message, "error"));
  }
};

export const resetInvoiceGenerated = () => async (dispatch) => {
  try {
    dispatch({
      type: RESET_INVOICE_GENERATED,
      payload: null,
    });
  } catch (err) {
    dispatch(setAlert(err.message, "error"));
  }
};
