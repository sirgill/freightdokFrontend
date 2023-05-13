const prepareBidDataForNewTrul = (row) => {
    const {bidAmount = '', offerStatus, vendorName, event_data = {}} = row || {};
    const {counter_offer: {expired_at = '', id: counterOfferId} = {}, offer: {external_id} = {}} = event_data;
    const amount = bidAmount.includes(',') ? bidAmount.split(',') : bidAmount

    return {
        amount: Array.isArray(amount) ? amount[amount.length - 1] : amount,
        offerStatus,
        vendorName,
        external_id,
        expired_at,
        counterOfferId
    }
}

export default prepareBidDataForNewTrul;