import fs from 'fs'
import { Logger } from '@nestjs/common'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

export class PathDependencyLoader {

    public static loadClassesFromPathRecursive<T = any>(
        dir: string,
        pathPostfix = 'module',
        classNamePostfix = 'module'): Constructor<T>[]
    {
        const result: Constructor<T>[] = []
        const paths = fs.readdirSync(dir)
        for (let i = 0; i < paths.length; i++) {
            const path = dir + '/' + paths[i]
            const stat = fs.lstatSync(path)
            if (stat.isDirectory()) {
                result.push(...this.loadClassesFromPathRecursive(path, pathPostfix, classNamePostfix))
            }
            if (stat.isFile() && (path.endsWith(`${pathPostfix}.js`) || path.endsWith(`${pathPostfix}.ts`))) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const exports = require(path)
                    const exportKeys = Object.keys(exports)
                    for (let j = 0; j < exportKeys.length; j++) {
                        const exportKey = exportKeys[j]
                        if (exportKey.toLowerCase().endsWith(classNamePostfix.toLowerCase())) {
                            result.push(exports[exportKey])
                        }
                    }
                } catch (e) {
                    Logger.error('Error while importing module: ' + e.message)
                    console.log(e)
                }
            }
        }
        return result
    }
}
