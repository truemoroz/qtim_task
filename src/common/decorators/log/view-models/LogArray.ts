import { applyDecorators } from '@nestjs/common'
import { LogView } from './LogView'
import { Log } from '@/common/lib/log/Log'

export const LogArray: (length: number, lengthEnd?: number) => PropertyDecorator = (length, lengthEnd = 1) => applyDecorators(
    LogView((object: Array<any>) => {
        if (!object) {
            return object
        }
        let res
        if (object.length && object.length > length + lengthEnd) {
            res = object.slice(0, length)
            res.push(`... ${object.length - length - lengthEnd} entries ...`)
            res.push(...object.slice(object.length - lengthEnd, object.length))
        } else {
            res = object
        }
        if (!res.map) {
            return res
        }
        return res.map((item, index, array) => Log.GetLogData(array, index))
    }),
)
