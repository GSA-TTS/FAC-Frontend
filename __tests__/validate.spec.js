import { parseChecks } from '../src/js/validate';

const ueidFormGroup = `
<div class="usa-form-group">
  <label class="usa-label" for="auditee_ueid">
    Auditee Unique Entity Identifier (UEI)
      <abbr title="required" class="usa-hint usa-hint--required">*</abbr>
  </label>
  <ul class="usa-error-message" id="auditee_ueid-error-message" role="alert">
      <li id="auditee_ueid-not-null" hidden="">
        Can't be null
      </li>
      <li id="auditee_ueid-length" hidden="">
        UEI is twelve characters long
      </li>
  </ul>
  <input class="usa-input" id="auditee_ueid" name="auditee_ueid" aria-required="true" required="" data-validate-not-null="" data-validate-length="== 12" data-validate-must-match="confirm_auditee_ueid" aria-describedby="auditee_ueid-error-message">
</div>
`;

test('extracts validations from DOM attributes', () => {
  document.body.innerHTML = ueidFormGroup;

  const input = document.getElementById('auditee_ueid');
  const { validateNotNull, validateLength, validateMustMatch } =
    parseChecks(input);

  expect(validateNotNull).toBe('');
  expect(validateLength).toBe('== 12');
  expect(validateMustMatch).toBe('confirm_auditee_ueid');
});
