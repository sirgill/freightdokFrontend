export const FMCSA_VERIFICATION_LINK = '/fmcsaVerification';
export const FEDERAL_SIGNUP_LINK = '/federalSignup'
export const LOGIN_LINK = '/login'
export const SIGNUP_SUPPORT = '/signup/support'
export const ONBOARD_USER_LINK = '/onboard/user'
export const ONBOARDING_USER = ONBOARD_USER_LINK + '/:email';
export const UPDATE_INTEGRATIONS_LINK = '/updateIntegrations'

export const ROLES = {
    dispatch: 'dispatch',
    superadmin: 'superAdmin',
    admin: 'admin',
    ownerOperator: 'ownerOperator',
    afterhours: 'afterhours'
}

export const LOAD_STATUSES = [
    { id: 'loadCheckIn', label: 'Load Check-In' },
    { id: 'pickupCompete', label: 'Pickup Complete' },
    { id: 'arrivedAtDelivery', label: 'Arrived at Delivery' },
    { id: 'arrivedAtPickup', label: 'Arrived at Pickup' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'enRoute', label: 'En Route to Delivery' },
]