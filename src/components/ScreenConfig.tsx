import React from 'react';
import { SetupFlow, SetupFlowProps } from './SetupFlow';

export type ScreenConfigProps = SetupFlowProps;

/**
 * ScreenConfig
 * Vertical single-column configuration component for session initialization.
 * Features elegant clickable list items with subtle dividers, minimal iconography,
 * generous negative space, and integrated 'Surprise Me' instant conversation profile flow.
 */
export const ScreenConfig: React.FC<ScreenConfigProps> = (props) => {
  return <SetupFlow {...props} />;
};

export { SetupFlow };
export default ScreenConfig;
