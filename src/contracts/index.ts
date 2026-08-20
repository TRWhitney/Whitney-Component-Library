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
  fieldContract,
  fieldGroupContract,
  formSectionContract,
  numberFieldContract,
  searchFieldContract,
  textAreaContract,
  textFieldContract,
} from './field.contracts.js';
export {
  checkboxContract,
  checkboxGroupContract,
  radioGroupContract,
  segmentedControlContract,
  switchContract,
} from './choice.contracts.js';
export {comboBoxContract, selectContract} from './selection.contracts.js';
export {rangeSliderContract, sliderContract} from './range.contracts.js';
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
import {
  fieldContract,
  fieldGroupContract,
  formSectionContract,
  numberFieldContract,
  searchFieldContract,
  textAreaContract,
  textFieldContract,
} from './field.contracts.js';
import {
  checkboxContract,
  checkboxGroupContract,
  radioGroupContract,
  segmentedControlContract,
  switchContract,
} from './choice.contracts.js';
import {comboBoxContract, selectContract} from './selection.contracts.js';
import {rangeSliderContract, sliderContract} from './range.contracts.js';

export const componentContracts = [
  appearanceProviderContract,
  buttonContract,
  buttonGroupContract,
  checkboxContract,
  checkboxGroupContract,
  comboBoxContract,
  dividerContract,
  fieldContract,
  fieldGroupContract,
  formSectionContract,
  iconButtonContract,
  inlineGroupContract,
  linkContract,
  numberFieldContract,
  rangeSliderContract,
  responsiveGridContract,
  radioGroupContract,
  scrollRegionContract,
  searchFieldContract,
  sectionContract,
  selectContract,
  sliderContract,
  segmentedControlContract,
  stackContract,
  surfaceContract,
  switchContract,
  textAreaContract,
  textFieldContract,
  toggleButtonContract,
  toolbarContract,
] as const;
