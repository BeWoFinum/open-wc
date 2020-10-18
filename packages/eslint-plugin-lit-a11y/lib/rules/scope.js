/**
 * @fileoverview Enforce scope prop is only used on <th> elements.
 * @author open-wc
 */

const { TemplateAnalyzer } = require('../../template-analyzer/template-analyzer.js');
const { elementHasAttribute } = require('../utils/elementHasAttribute.js');
const { isHtmlTaggedTemplate } = require('../utils/isLitHtmlTemplate.js');
const { hasLitHtmlImport, createValidLitHtmlSources } = require('../utils/utils.js');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const validScopeValues = ['col', 'row', 'rowgroup', 'colgroup'];

/** @type {import("eslint").Rule.RuleModule} */
const ScopeRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce scope prop is only used on <th> elements.',
      category: 'Accessibility',
      recommended: false,
    },
    fixable: null,
    schema: [],
  },
  create(context) {
    let isLitHtml = false;
    const validLitHtmlSources = createValidLitHtmlSources(context);

    return {
      ImportDeclaration(node) {
        if (hasLitHtmlImport(node, validLitHtmlSources)) {
          isLitHtml = true;
        }
      },
      TaggedTemplateExpression(node) {
        if (isHtmlTaggedTemplate(node) && isLitHtml) {
          const analyzer = TemplateAnalyzer.create(node);

          analyzer.traverse({
            enterElement(element) {
              if (
                element.name !== 'th' &&
                !element.name.includes('-') &&
                elementHasAttribute(element, 'scope')
              ) {
                const loc = analyzer.getLocationForAttribute(element, 'scope');
                context.report({
                  loc,
                  message: 'The scope attribute may only be used on <th> elements.',
                });
              } else if (
                element.name === 'th' &&
                elementHasAttribute(element, 'scope') &&
                !validScopeValues.includes(element.attribs.scope)
              ) {
                const loc = analyzer.getLocationForAttribute(element, 'scope');
                context.report({
                  loc,
                  message:
                    '"{{scope}}" is not a valid value for the scope attribute. The valid values are: {{validScopes}}.',
                  data: {
                    scope: element.attribs.scope,
                    validScopes: validScopeValues.join(', '),
                  },
                });
              }
            },
          });
        }
      },
    };
  },
};

module.exports = ScopeRule;
