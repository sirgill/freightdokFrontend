const prepareBidDataNewTrul = (row) => {
    const {bidAmount = ''} = row || {};
    const amount = bidAmount.includes(',') ? bidAmount.split(',') : bidAmount

    return {
        amount: Array.isArray(amount) ? amount[amount.length - 1] : amount,
    }
}

export default prepareBidDataNewTrul;