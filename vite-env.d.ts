/// <reference types="vite/client" />

// This tells TypeScript that any import ending with .svg?react is a React component.
declare module '*.svg?react' {
  import { FC, SVGProps } from 'react';
  const ReactComponent: FC<SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
