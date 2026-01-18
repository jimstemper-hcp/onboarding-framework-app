import { invoicingFeature } from './invoicing';
import { paymentsFeature } from './payments';
import { automatedCommsFeature } from './automatedComms';
import { schedulingFeature } from './scheduling';
import { estimatesFeature } from './estimates';
import { csrAiFeature } from './csrAi';
import { reviewsFeature } from './reviews';
// New features for Frontline Onboarding Plan
import { accountSetupFeature } from './accountSetup';
import { customersFeature } from './customers';
import { addOnsFeature } from './addOns';
import { servicePlansFeature } from './servicePlans';
import { onlineBookingFeature } from './onlineBooking';
import { reportingFeature } from './reporting';
import type { Feature } from '../../types';

export const features: Feature[] = [
  invoicingFeature,
  paymentsFeature,
  automatedCommsFeature,
  schedulingFeature,
  estimatesFeature,
  csrAiFeature,
  reviewsFeature,
  // New features for Frontline Onboarding Plan
  accountSetupFeature,
  customersFeature,
  addOnsFeature,
  servicePlansFeature,
  onlineBookingFeature,
  reportingFeature,
];

export {
  invoicingFeature,
  paymentsFeature,
  automatedCommsFeature,
  schedulingFeature,
  estimatesFeature,
  csrAiFeature,
  reviewsFeature,
  // New features
  accountSetupFeature,
  customersFeature,
  addOnsFeature,
  servicePlansFeature,
  onlineBookingFeature,
  reportingFeature,
};
