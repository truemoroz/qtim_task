import { ServiceModule } from '@/common/decorators/basic/ServiceModuleDecorator'
import { ViewModelService } from '@/services/view-model/view-model.service'
import { Global } from '@nestjs/common'
import { AutoloadService } from '@/common/decorators/basic/AutoloadServiceDecorator'

@Global()
@AutoloadService()
@ServiceModule(ViewModelService)
export class ViewModelServiceModule {

}
