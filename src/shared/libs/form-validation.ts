export interface ValidationRule {
  maxLength?: number;
  message?: string;
  minLength?: number;
  pattern?: RegExp;
  required?: boolean;
  validate?: (value: unknown) => boolean | string;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export const validateField = (
  _name: string,
  value: unknown,
  rules: ValidationRule
): string | undefined => {
  if (
    rules.required &&
    (!value || (typeof value === 'string' && value.trim() === ''))
  ) {
    return rules.message || 'This field is required';
  }

  if (
    rules.minLength &&
    typeof value === 'string' &&
    value.length < rules.minLength
  ) {
    return rules.message || `Minimum length is ${rules.minLength} characters`;
  }

  if (
    rules.maxLength &&
    typeof value === 'string' &&
    value.length > rules.maxLength
  ) {
    return rules.message || `Maximum length is ${rules.maxLength} characters`;
  }

  if (
    rules.pattern &&
    typeof value === 'string' &&
    !rules.pattern.test(value)
  ) {
    return rules.message || 'Invalid format';
  }

  if (rules.validate && typeof rules.validate === 'function') {
    const result = rules.validate(value);

    if (typeof result === 'string') {
      return result;
    }

    if (result === false) {
      return rules.message || 'Invalid value';
    }
  }

  return undefined;
};

export const validateForm = (
  values: { [key: string]: unknown },
  rules: ValidationRules
): ValidationErrors => {
  const errors: ValidationErrors = {};

  Object.keys(rules).forEach((fieldName) => {
    const error = validateField(fieldName, values[fieldName], rules[fieldName]);

    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

export const hasErrors = (errors: ValidationErrors): boolean =>
  Object.keys(errors).some((key) => !!errors[key]);
