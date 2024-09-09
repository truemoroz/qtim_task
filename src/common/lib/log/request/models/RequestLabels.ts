import { LogLabels } from '@/common/lib/log/models/LogLabels'

export class RequestLabels extends LogLabels {
    method?: string
    status?: number
    url?: string
    requestLogFlag?: string
}
