import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

export class DependencyInfo<TClass = any, TModule = any> {
    module: Constructor<TModule>
    class: Constructor<TClass>
}
