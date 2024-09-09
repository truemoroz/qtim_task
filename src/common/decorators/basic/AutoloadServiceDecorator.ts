import { ModuleAutoloader } from '@/common/lib/moduleLoading/ModuleAutoloader'


export const AutoloadService = (): ClassDecorator => {
    return (target) => {
        ModuleAutoloader.addModule(target)
    }
}
