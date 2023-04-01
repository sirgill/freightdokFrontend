import {requestPatch, requestPost} from "../utils/request";
import {getGoUrl} from "../config";

const placeNewCounterOffer = async (obj, callback) => {
    try {
        const {data} = await requestPost({uri: getGoUrl() + '/newTrulCounterOffer', body: obj});
        if(callback) callback(data)
    } catch (e) {

    }
}

const newCounterOfferAction = async (payload) => {
    try {
        return await requestPatch({uri: getGoUrl() + '/newtrulUpdateOfferStatus', body: payload})
    } catch (e) {

    }
}

const newTrulFinalOfferAction = async (payload) => {
    try{
        return await requestPost({uri: getGoUrl() + '/newTrulFinalOffer', body: payload})
    } catch (e) {

    }
}

export {
    placeNewCounterOffer,
    newCounterOfferAction,
    newTrulFinalOfferAction,
}