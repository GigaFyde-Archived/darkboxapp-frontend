import React from 'react';
import Viewport from '@monaco-editor/react';

type Props = { enabled: boolean };

export default function Editor({ enabled }: Props) {
  return (
    <Viewport
      theme="dark"
      height="95vh"
      width="100vw"
      options={{ readOnly: !enabled }}
    />
  );
}
