import {requestPatch, requestPost} from "../utils/request";
import {getGoUrl} from "../config";
import {getUserDetail} from "../utils/utils";

const {user: {orgId} = {}} = getUserDetail();

const placeNewCounterOffer = async (obj, callback) => {
    try {
        const {data} = await requestPost({uri: getGoUrl() + '/newTrulCounterOffer?orgId='+orgId, body: obj});
        if(callback) callback(data)
    } catch (e) {

    }
}

const newCounterOfferAction = async (payload) => {
    try {
        return await requestPatch({uri: getGoUrl() + '/newtrulUpdateOfferStatus?orgId='+orgId, body: payload})
    } catch (e) {

    }
}

const newTrulFinalOfferAction = async (payload) => {
    try{
        return await requestPost({uri: getGoUrl() + '/newTrulFinalOffer?orgId='+orgId, body: payload})
    } catch (e) {

    }
}

export {
    placeNewCounterOffer,
    newCounterOfferAction,
    newTrulFinalOfferAction,
}