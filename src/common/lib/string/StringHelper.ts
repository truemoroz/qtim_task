export class StringHelper {
    public static replaceAll(search: string, replace: string, str: string): string {
        return str.split(search).join(replace)
    }

    public static escapeStringForLikeOperation(str: string): string {
        str = this.replaceAll('_', '\\_', str)
        str = this.replaceAll('%', '\\%', str)
        return str
    }
}
