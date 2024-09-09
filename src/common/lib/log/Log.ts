// export type DataLogType = string | number | Array<any> | Record<string | number, any>
export type DataLogType = Record<string | number, any>

export class Log {
    static GetLog(data: DataLogType): DataLogType {
        let log = {}
        if (data) {
            if (Array.isArray(data)) {
                log = this.GetArrayLogData(data)
            } else if (typeof data === 'object') {
                log = this.GetObjectLogData(data)
            } else {
                log = data
            }
        }
        return log
    }

    public static GetLogData(data: DataLogType, key: string | number): DataLogType {
        const logFunction = Reflect.getMetadata(`${data.constructor.name}.${key}`, data)
        if (logFunction) {
            return logFunction((data as Record<string | number, any>)[key])
        }
        if (Array.isArray(data[key])) {
            return this.GetArrayLogData(data[key])
        } else if (data[key] && typeof data[key]['toISO'] == 'function') {
            return data[key].toISO()
        } else if (data[key] && typeof data[key] === 'object') {
            return this.GetObjectLogData(data[key])
        } else {
            return data[key]
        }
    }

    private static GetArrayLogData(data: Array<any>): Array<any> {
        const res = []
        for (let i = 0; i < data.length; i++) {
            res.push(this.GetLogData(data, i))
        }
        return res
    }

    private static GetObjectLogData(data: Record<string, any>): Record<any, any> {
        const keys = Object.keys(data)
        const res: Record<string, any> = {}

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            res[key] = this.GetLogData(data, key)
        }

        return res
    }
}
