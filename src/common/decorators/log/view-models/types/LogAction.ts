import { DataLogType } from '@/common/lib/log/Log'

export type LogAction = (object: Record<string, any> | string) => DataLogType
