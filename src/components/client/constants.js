const ROLE_NAMES = {
    superAdmin: 'Super Admin',
    dispatch: 'Dispatch',
    admin: 'Admin',
    ownerOperator: 'Owner Operator',
    driver: 'Driver',
    support: 'Support',
}

export const getRoleNameString = function (role) {
    return ROLE_NAMES[role] || role;
}