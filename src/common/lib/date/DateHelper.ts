import { DateTime } from 'ts-luxon'

export class DateHelper {
    public static getUtcNow(): DateTime {
        return DateTime.now().toUTC()
    }
}
