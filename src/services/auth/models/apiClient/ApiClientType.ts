export enum ApiClientType {
    UnauthorizedUser,
    ServiceUser,
    AdminUser,
    ClientUser
}

export const apiClientTypeNames: Record<ApiClientType, string> = {
    [ApiClientType.UnauthorizedUser]: 'Unauthorized user',
    [ApiClientType.ServiceUser]: 'Service user',
    [ApiClientType.AdminUser]: 'Admin user',
    [ApiClientType.ClientUser]: 'Client user',
}
