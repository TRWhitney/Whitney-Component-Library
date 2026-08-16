export {appearanceProviderContract} from './appearance-provider.contract.js';
export {
  buttonContract,
  buttonGroupContract,
  iconButtonContract,
  linkContract,
  toggleButtonContract,
  toolbarContract,
} from './action.contracts.js';
export {
  dividerContract,
  inlineGroupContract,
  responsiveGridContract,
  scrollRegionContract,
  sectionContract,
  stackContract,
  surfaceContract,
} from './layout.contracts.js';
export {
  renderAgentIndex,
  renderContractDocumentation,
  renderTypeScriptExamples,
  toComponentManifest,
  validateComponentContracts,
  type ComponentContract,
  type ComponentManifest,
  type ContractExample,
} from './component-contract.js';

import {appearanceProviderContract} from './appearance-provider.contract.js';
import {
  buttonContract,
  buttonGroupContract,
  iconButtonContract,
  linkContract,
  toggleButtonContract,
  toolbarContract,
} from './action.contracts.js';
import {
  dividerContract,
  inlineGroupContract,
  responsiveGridContract,
  scrollRegionContract,
  sectionContract,
  stackContract,
  surfaceContract,
} from './layout.contracts.js';

export const componentContracts = [
  appearanceProviderContract,
  buttonContract,
  buttonGroupContract,
  dividerContract,
  iconButtonContract,
  inlineGroupContract,
  linkContract,
  responsiveGridContract,
  scrollRegionContract,
  sectionContract,
  stackContract,
  surfaceContract,
  toggleButtonContract,
  toolbarContract,
] as const;
