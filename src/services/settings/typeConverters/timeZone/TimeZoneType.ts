export const TimeZoneType = (Intl as any).supportedValuesOf('timeZone')
    .reduce((acc: object, timeZone: string) => {
        acc[timeZone] = timeZone
        return acc
    }, {})
