import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { Injectable } from '@nestjs/common'
import { ISettingGroup } from '@/services/settings/interfaces/ISettingGroup'
import { ValidationError as ResponseValidationError } from '@/common/models/responses/errors/ValidationError'
import { ValidationException } from '@/common/exceptions/ValidationException'

interface SettingsValidationArguments extends ValidationArguments {
    constraints: ISettingGroup[];

}
@Injectable()
@ValidatorConstraint({ name: 'settingsValidator', async: true })
export class SettingsValidationService implements ValidatorConstraintInterface{
    async validate(
        settings: Record<string, string | boolean | number>,
        validationArguments: SettingsValidationArguments): Promise<boolean>
    {
        const settingGroup = validationArguments.constraints[0]
        const settingKeys = Object.keys(settings)

        const errors: string[] = []
        for (const settingKey of settingKeys) {
            const setting = settingGroup[settingKey]
            if (!settingGroup[settingKey]) {
                errors.push(`No such setting ${settingKey}`)
                continue
            }

            const converter = new setting.converter
            const isValid = await converter.validate(settings[settingKey].toString())
            if (!isValid) {
                errors.push(`Wrong value for ${settingKey}`)
            }

        }

        if (errors.length > 0) {
            const error = new ResponseValidationError()
            error.setFieldError(validationArguments.property, errors)
            throw new ValidationException(error)
        }

        return true
    }
}
