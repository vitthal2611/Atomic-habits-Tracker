import React, { useState } from 'react';

export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && !value.trim()) {
      return rules.message || 'This field is required';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `Minimum ${rules.minLength} characters required`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.message || 'Invalid format';
    }

    return '';
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(name => {
      const error = validate(name, values[name] || '');
      if (error) newErrors[name] = error;
    });
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return Object.keys(newErrors).length === 0;
  };

  return { values, errors, touched, handleChange, handleBlur, validateAll, setValues };
};

export const FormField = ({ label, name, error, touched, required, children }) => (
  <div className="form-group-wizard">
    <label htmlFor={name}>
      {label} {required && <span style={{ color: 'var(--error)' }}>*</span>}
    </label>
    {children}
    {touched && error && (
      <span className="form-error">{error}</span>
    )}
  </div>
);
