import { useState, useCallback, useRef, useEffect } from 'react';
import { useFormErrorHandler } from './useErrorHandler';

/**
 * Custom hook for form management with validation, error handling, and submission
 * Provides a comprehensive form handling solution with React integration
 */
export const useForm = (initialValues = {}, options = {}) => {
  const {
    validate,
    onSubmit,
    validateOnChange = false,
    validateOnBlur = true,
    resetOnSubmit = false,
    persistForm = false,
    formKey = 'form',
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  
  const { handleSubmitError, handleFieldError } = useFormErrorHandler();
  const initialValuesRef = useRef(initialValues);

  // Update initial values if they change
  useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  /**
   * Validates a single field
   */
  const validateField = useCallback((name, value) => {
    if (!validate) return null;

    const fieldValidation = validate({ ...values, [name]: value }, name);
    
    if (typeof fieldValidation === 'string') {
      return fieldValidation;
    }
    
    if (fieldValidation && typeof fieldValidation === 'object') {
      return fieldValidation[name] || null;
    }
    
    return null;
  }, [validate, values]);

  /**
   * Validates all fields
   */
  const validateForm = useCallback((formValues = values) => {
    if (!validate) return {};

    const validationResult = validate(formValues);
    
    if (typeof validationResult === 'object' && validationResult !== null) {
      return validationResult;
    }
    
    return {};
  }, [validate, values]);

  /**
   * Sets a field value with optional validation
   */
  const setFieldValue = useCallback((name, value, shouldValidate = validateOnChange) => {
    setValues(prev => ({ ...prev, [name]: value }));

    if (shouldValidate) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }));
    } else {
      // Clear error if validation is disabled
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validateField, validateOnChange]);

  /**
   * Sets multiple field values
   */
  const setFieldValues = useCallback((newValues, shouldValidate = validateOnChange) => {
    setValues(prev => ({ ...prev, ...newValues }));

    if (shouldValidate) {
      const formErrors = validateForm({ ...values, ...newValues });
      setErrors(formErrors);
    }
  }, [validateForm, values, validateOnChange]);

  /**
   * Sets a field error
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  /**
   * Sets multiple field errors
   */
  const setFieldErrors = useCallback((newErrors) => {
    setErrors(prev => ({ ...prev, ...newErrors }));
  }, []);

  /**
   * Marks a field as touched
   */
  const setFieldTouched = useCallback((name, isTouched = true, shouldValidate = validateOnBlur) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));

    if (shouldValidate && isTouched) {
      const fieldError = validateField(name, values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  }, [validateField, values, validateOnBlur]);

  /**
   * Handles input change events
   */
  const handleChange = useCallback((event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFieldValue(name, fieldValue);
  }, [setFieldValue]);

  /**
   * Handles input blur events
   */
  const handleBlur = useCallback((event) => {
    const { name } = event.target;
    setFieldTouched(name, true);
  }, [setFieldTouched]);

  /**
   * Resets the form to initial values
   */
  const resetForm = useCallback((newInitialValues = initialValuesRef.current) => {
    setValues(newInitialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
  }, []);

  /**
   * Resets a specific field
   */
  const resetField = useCallback((name) => {
    const initialValue = initialValuesRef.current[name];
    setFieldValue(name, initialValue, false);
    setFieldTouched(name, false, false);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, [setFieldValue, setFieldTouched]);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
    }

    setIsSubmitting(true);
    setSubmitCount(prev => prev + 1);

    // Validate all fields
    const formErrors = validateForm(values);
    setErrors(formErrors);

    // Mark all fields as touched
    const touchedFields = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(touchedFields);

    // Check if form is valid
    const hasErrors = Object.keys(formErrors).some(key => formErrors[key]);

    if (hasErrors) {
      setIsSubmitting(false);
      handleFieldError(formErrors, 'Form Validation');
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(values, {
          setFieldError,
          setFieldErrors,
          setFieldValue,
          setFieldValues,
          resetForm,
        });
      }

      if (resetOnSubmit) {
        resetForm();
      }
    } catch (error) {
      handleSubmitError(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    values,
    validateForm,
    onSubmit,
    resetOnSubmit,
    resetForm,
    setFieldError,
    setFieldErrors,
    setFieldValue,
    setFieldValues,
    handleSubmitError,
    handleFieldError,
  ]);

  /**
   * Gets field props for easy integration with input components
   */
  const getFieldProps = useCallback((name) => {
    return {
      name,
      value: values[name] || '',
      onChange: handleChange,
      onBlur: handleBlur,
    };
  }, [values, handleChange, handleBlur]);

  /**
   * Gets field meta information
   */
  const getFieldMeta = useCallback((name) => {
    return {
      value: values[name],
      error: errors[name],
      touched: touched[name],
      invalid: !!(errors[name] && touched[name]),
      valid: !errors[name] && touched[name],
    };
  }, [values, errors, touched]);

  /**
   * Checks if the form is valid
   */
  const isValid = Object.keys(errors).length === 0;

  /**
   * Checks if the form is dirty (has changes)
   */
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValuesRef.current);

  /**
   * Gets all field names that have errors
   */
  const errorFields = Object.keys(errors).filter(key => errors[key]);

  return {
    // Values and state
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    isValid,
    isDirty,
    errorFields,

    // Field operations
    setFieldValue,
    setFieldValues,
    setFieldError,
    setFieldErrors,
    setFieldTouched,

    // Form operations
    handleSubmit,
    resetForm,
    resetField,
    validateForm,
    validateField,

    // Event handlers
    handleChange,
    handleBlur,

    // Helper functions
    getFieldProps,
    getFieldMeta,
  };
};

/**
 * Hook for managing form arrays (dynamic lists)
 */
export const useFormArray = (name, form) => {
  const { values, setFieldValue } = form;
  const arrayValue = values[name] || [];

  const push = useCallback((item) => {
    setFieldValue(name, [...arrayValue, item]);
  }, [name, arrayValue, setFieldValue]);

  const remove = useCallback((index) => {
    const newArray = arrayValue.filter((_, i) => i !== index);
    setFieldValue(name, newArray);
  }, [name, arrayValue, setFieldValue]);

  const insert = useCallback((index, item) => {
    const newArray = [...arrayValue];
    newArray.splice(index, 0, item);
    setFieldValue(name, newArray);
  }, [name, arrayValue, setFieldValue]);

  const move = useCallback((from, to) => {
    const newArray = [...arrayValue];
    const item = newArray.splice(from, 1)[0];
    newArray.splice(to, 0, item);
    setFieldValue(name, newArray);
  }, [name, arrayValue, setFieldValue]);

  const replace = useCallback((index, item) => {
    const newArray = [...arrayValue];
    newArray[index] = item;
    setFieldValue(name, newArray);
  }, [name, arrayValue, setFieldValue]);

  const clear = useCallback(() => {
    setFieldValue(name, []);
  }, [name, setFieldValue]);

  return {
    value: arrayValue,
    push,
    remove,
    insert,
    move,
    replace,
    clear,
  };
};

/**
 * Hook for form validation with Yup schema
 */
export const useFormWithYup = (initialValues, yupSchema, options = {}) => {
  const validate = useCallback(async (values, field) => {
    try {
      if (field) {
        // Validate single field
        await yupSchema.validateAt(field, values);
        return null;
      } else {
        // Validate entire form
        await yupSchema.validate(values, { abortEarly: false });
        return {};
      }
    } catch (error) {
      if (error.inner) {
        // Multiple validation errors
        return error.inner.reduce((acc, err) => {
          acc[err.path] = err.message;
          return acc;
        }, {});
      } else {
        // Single validation error
        return field ? error.message : { [error.path]: error.message };
      }
    }
  }, [yupSchema]);

  return useForm(initialValues, {
    ...options,
    validate,
  });
};

export default useForm;

