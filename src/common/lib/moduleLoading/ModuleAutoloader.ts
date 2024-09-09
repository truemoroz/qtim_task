import { Logger } from '@nestjs/common'
import fs from 'fs'

export class ModuleAutoloader {

    static logger = new Logger(ModuleAutoloader.name)

    static modules: Function[] = []

    static loadModules(path: string): any[] {
        this.loadFilesRecursive(path)
        return this.modules
    }

    static loadFilesRecursive(dir: string): void {
        const paths = fs.readdirSync(dir)
        for (let i = 0; i < paths.length; i++) {
            const path = dir + '/' + paths[i]
            const stat = fs.lstatSync(path)
            if (stat.isDirectory()) {
                this.loadFilesRecursive(path)
            }
            if (stat.isFile() && (path.endsWith('.module.js') || path.endsWith('.module.ts'))) {
                try {
                    require(path)
                } catch (e) {
                    this.logger.error('Error while importing module: ' + e.message)
                    console.log(e)
                }
            }
        }
    }

    static addModule(module: Function): void {
        if (process.env.NODE_ENV !== 'test') {
            this.logger.log('Autoload module ' + module.name)
        }
        this.modules.push(module)
    }
}
