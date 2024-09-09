import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class TransformPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.type === 'custom') {
      return value

    }
    return plainToInstance(metadata.metatype, value)
  }
}
