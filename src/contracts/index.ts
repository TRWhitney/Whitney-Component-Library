export {appearanceProviderContract} from './appearance-provider.contract.js';
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
  dividerContract,
  inlineGroupContract,
  responsiveGridContract,
  scrollRegionContract,
  sectionContract,
  stackContract,
  surfaceContract,
] as const;
