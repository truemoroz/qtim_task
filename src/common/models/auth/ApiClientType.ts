export enum ApiClientType {
    UnauthorizedUser,
    NetworkUser,
    ServiceUser,
    AdminUser
}

export const apiClientTypeNames: Record<ApiClientType, string> = {
    [ApiClientType.UnauthorizedUser]: 'Unauthorized user',
    [ApiClientType.NetworkUser]: 'Network user',
    [ApiClientType.ServiceUser]: 'Service user',
    [ApiClientType.AdminUser]: 'Admin user',
}
