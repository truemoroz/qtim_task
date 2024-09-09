import { ValidationError } from '../models/responses/errors/ValidationError'

export class ValidationException {
    error: ValidationError

    constructor(error: ValidationError) {
        this.error = error
    }
}
