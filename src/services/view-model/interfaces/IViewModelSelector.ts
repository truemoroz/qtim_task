export interface IViewModelSelector {
    getProperty(sourceProperty: string, source: Record<string, any>): Promise<any>
}
