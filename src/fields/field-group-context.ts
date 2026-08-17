'use client';

import {createContext, useContext} from 'react';

export const FieldGroupDisabledContext = createContext(false);

export function useFieldGroupDisabled(): boolean {
  return useContext(FieldGroupDisabledContext);
}
