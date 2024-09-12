export class TypeExportResolvers {
    public static boolResolver(value: boolean): string {
        return value ? 'True' : 'False'
    }

    public static jsonResolver(value: Record<string, any> | Array<any>): string {
        return JSON.stringify(value)
    }
}
