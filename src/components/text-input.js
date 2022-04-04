module.export = function (label, name) {
  return `
    <label class="usa-label" for="input-type-text">${label}</label>
    <input
      class="usa-input"
      id="${name}"
      name="${name}"
      type="text"
    />
  `;
};
