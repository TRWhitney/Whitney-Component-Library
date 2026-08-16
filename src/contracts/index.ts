export {appearanceProviderContract} from './appearance-provider.contract.js';
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

export const componentContracts = [appearanceProviderContract] as const;
