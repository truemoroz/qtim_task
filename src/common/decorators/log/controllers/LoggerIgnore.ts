import { LoggerInterceptorIgnore } from '@/common/interceptors/logger.interceptor'

export function LoggerIgnore() {
    return (_target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
        descriptor.value[LoggerInterceptorIgnore] = true
    }
}
