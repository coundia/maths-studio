import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        class?: string;
      };
    }
  }
}

const A = () => <button>Hello</button>;
const B = () => <math-field>Hello</math-field>;
