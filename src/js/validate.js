export const checkValidity = (field) => {
  const errors = [];
  const checks = parseChecks(field);

  for (const [operation, constraint] of Object.entries(checks)) {
    const result = validations[operation](field, constraint);
    if (result.error) {
      toggleErrorClass(field, true);
      toggleErrorMessageContainer(field.id, true);
      toggleErrorMessages(field.id, result, true);
      errors.push(validations[operation](field, constraint));
    } else {
      toggleErrorMessages(field.id, result, result.error);
    }
  }

  if (errors.length == 0) {
    toggleErrorClass(field, false);
    toggleErrorMessages(field.id, null, false);
    toggleErrorMessageContainer(field.id, false);
  }

  return errors;
};

const toggleErrorMessageContainer = (id, shouldDisplay) => {
  const errorContainer = document.getElementById(`${id}-error-message`);
  const parent = errorContainer.parentElement;
  toggleErrorClass(parent, shouldDisplay, 'usa-form-group--error');
};

const toggleErrorMessages = (id, error, isInvalid) => {
  if (error) {
    const errorMessage = document.getElementById(`${id}-${error.validation}`);
    errorMessage.hidden = !isInvalid;
  }
};

const toggleErrorClass = (field, isInvalid, errorClass) => {
  const klass = errorClass ? errorClass : 'usa-input--error';

  isInvalid ? field.classList.add(klass) : field.classList.remove(klass);
};

const filterObjectByKey = (objToFilter, condition) => {
  const filteredObj = {};
  const keys = Object.keys(objToFilter).filter(condition);
  keys.forEach((k) => {
    filteredObj[k] = objToFilter[k];
  });
  return filteredObj;
};

export const parseChecks = (field) => {
  const containsValidate = (str) => str.match('validate');
  const validations = filterObjectByKey(field.dataset, containsValidate);

  return validations;
};

export const validations = {
  validateNotNull: (field) => {
    const result = {
      error: false,
      fieldId: field.id,
      validation: 'not-null',
    };

    return !field.value ? { ...result, error: true } : result;
  },

  validateMustMatch: (field, matchField) => {
    const matchFieldEl = document.querySelector(`input#${matchField}`);
    const result = {
      error: false,
      fieldId: field.id,
      validation: 'must-match',
    };

    return field.value != matchFieldEl.value
      ? { ...result, error: true }
      : result;
  },

  validateLength: (field, compStr) => {
    const [comparator, compValue] = compStr.split(' ');
    const valueLength = field.value.length;
    const compValueLength = parseInt(compValue);

    const result = {
      error: false,
      fieldId: field.id,
      validation: 'length',
    };

    switch (comparator) {
      case '==':
        return valueLength != compValueLength
          ? { ...result, error: true }
          : result;
    }
  },
};
