export const checkValidity = (field) => {
  const results = [];
  const checks = parseChecks(field);

  for (const [operation, constraint] of Object.entries(checks)) {
    results.push(validations[operation](field, constraint));
  }

  console.log(results);
  return results;
};

// const markInvalid = (field) => {
//   field.classList.add('usa-input--error');
// };

const filterObjectByKey = (objToFilter, condition) => {
  const filteredObj = {};
  const keys = Object.keys(objToFilter).filter(condition);
  keys.forEach((k) => {
    filteredObj[k] = objToFilter[k];
  });
  return filteredObj;
};

const parseChecks = (field) => {
  const containsValidate = (str) => str.match('validate');
  const validations = filterObjectByKey(field.dataset, containsValidate);

  if (field.required) validations['validateNotNull'] = true;
  return validations;
};

const validations = {
  validateNotNull: (field) => {
    if (!field.value) return { error: 'Field cannot be null' };
  },

  validateMustMatch: (field, matchField) => {
    const matchFieldEl = document.querySelector(`input#${matchField}`);
    if (!field.value != matchFieldEl.value) {
      return {
        error: 'Field must match the one before it',
      };
    }
  },

  validateLength: (field, compStr) => {
    const [comparator, compValue] = compStr.split(' ');
    const value = field.value;
    switch (comparator) {
      case '==':
        if (value == compValue)
          return { error: `Must be ${compValue} characters long` };
    }
  },
};
