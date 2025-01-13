import isEmail from 'validator/lib/isEmail'

export const rules = {
  required: (value: string) => !!value || 'Field is required.',
  email: (value: string) => isEmail(value) || 'Invalid email address.',
  minLength: (value: string, length: number) =>
    value.length >= length || `Minimum ${length} characters.`,
  maxLength: (value: string, length: number) =>
    value.length <= length || `Maximum ${length} characters.`,
  isNaN: (value: string) => !isNaN(Number(value)) || 'Value must be a number.',
  minValue: (value: string, min: number) => Number(value) >= min || `Minimum value is ${min}.`,
  maxValue: (value: string, max: number) => Number(value) <= max || `Maximum value is ${max}.`,
}
