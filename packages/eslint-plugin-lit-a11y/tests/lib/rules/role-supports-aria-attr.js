/**
 * @fileoverview Enforce that elements with a defined role contain only supported ARIA attributes for that role.
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/role-supports-aria-attr');
const { prependLitHtmlImport } = require('../../../lib/utils/utils.js');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});
ruleTester.run('role-supports-aria-attr', rule, {
  valid: [
    { code: "html`<div role='checkbox' aria-checked='true'></div>`" },
    { code: "html`<div role='presentation'></div>`" },
  ].map(prependLitHtmlImport),

  invalid: [
    {
      code: "html`<li aria-required role='radio' aria-checked='false'>Rainbow Trout</li>`",
      errors: [
        { message: 'The "radio" role must not be used with the "aria-required" attribute.\'' },
      ],
    },
    {
      code: "html`<div role='combobox' aria-checked='true'></div>`",
      errors: [
        { message: 'The "combobox" role must not be used with the "aria-checked" attribute.\'' },
      ],
    },
  ].map(prependLitHtmlImport),
});
