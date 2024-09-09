import { ISettingTypeConverter } from '@/services/settings/interfaces/ISettingTypeConverter'

export class DateFormatTypeConverter implements ISettingTypeConverter<string> {
    private readonly replacements: { [key: string]: string} = {
        'd': 'dd',
        'D': 'ccc',
        'j': 'd',
        'l': 'cccc',
        'N': 'c',
        'w': '',
        'z': 'o',
        'W': 'W',
        'F': 'LLLL',
        'm': 'LL',
        'M': 'LLL',
        'n': 'L',
        't': '',
        'L': '',
        'o': '',
        'Y': 'yyyy',
        'y': 'yy',
        'a': '',
        'A': '',
        'B': '',
        'g': 'h',
        'G': 'H',
        'h': 'hh',
        'H': 'HH',
        'i': 'mm',
        's': 'ss',
        'u': '',
        'v': 'S',
        'e': 'ZZZZ',
        'I': '',
        'O': 'ZZZ',
        'P': 'ZZ',
        'p': 'ZZ',
        'T': 'ZZZZ',
        'Z': '',
        'c': '',
        'r': '',
        'U': 'X',
    }
    async deserialize(value: string): Promise<string> {
        for (const key in this.replacements) {
            if (Object.prototype.hasOwnProperty.call(this.replacements, key)) {
                const element = this.replacements[key]
                if (element) {
                    value = value.replace(element, key)
                }
            }
        }
        return value
    }

    async serialize(value: string): Promise<string> {
        let result = ''
        for (const s of value) {
            if (this.replacements[s]) {
                result += this.replacements[s]
                continue
            }
            result += s
        }
        return result
    }

    async validate(value: string): Promise<boolean> {
        return true
    }
}
