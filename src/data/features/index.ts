import { invoicingFeature } from './invoicing';
import { paymentsFeature } from './payments';
import { automatedCommsFeature } from './automatedComms';
import { schedulingFeature } from './scheduling';
import { estimatesFeature } from './estimates';
import { csrAiFeature } from './csrAi';
import { reviewsFeature } from './reviews';
import type { Feature } from '../../types';

export const features: Feature[] = [
  invoicingFeature,
  paymentsFeature,
  automatedCommsFeature,
  schedulingFeature,
  estimatesFeature,
  csrAiFeature,
  reviewsFeature,
];

export {
  invoicingFeature,
  paymentsFeature,
  automatedCommsFeature,
  schedulingFeature,
  estimatesFeature,
  csrAiFeature,
  reviewsFeature,
};
