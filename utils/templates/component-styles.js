/* tslint:disable */
module.exports = (componentName) => ({
  content: `// Generated with util/create-component.js
import styled from 'styled-components';

export const ${componentName} = styled.div\`
  /* Write styles here */
\`;
`,
  type: 'styles',
  extension: `.styles.ts`
})
