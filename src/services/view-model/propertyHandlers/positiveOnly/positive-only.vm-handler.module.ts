import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { PositiveOnlyVmHandler } from './positive-only.vm-handler'


@ServiceModule(PositiveOnlyVmHandler)
export class PositiveOnlyVmHandlerModule {
}
