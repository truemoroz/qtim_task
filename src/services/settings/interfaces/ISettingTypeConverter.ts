export interface ISettingTypeConverter<T> {
    serialize(value: string): Promise<T>

    deserialize(value: T): Promise<string>

    validate(value: string): Promise<boolean>
}
