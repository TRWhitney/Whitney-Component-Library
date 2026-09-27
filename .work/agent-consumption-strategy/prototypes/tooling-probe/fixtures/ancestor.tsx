import {Switch} from '@trwhitney/component-library';

// This component can be valid under a provider supplied by its host.
export function HostWrappedSetting() {
  return <Switch label="Desktop alerts" defaultSelected />;
}
