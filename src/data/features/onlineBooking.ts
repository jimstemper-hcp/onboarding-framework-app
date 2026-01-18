import type { Feature } from '../../types';

export const onlineBookingFeature: Feature = {
  id: 'online-booking',
  name: 'Online Booking',
  description: 'Let customers book appointments online directly from your website',
  icon: 'EventAvailable',
  version: '1.0.0',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'online_booking.access', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Online booking lets customers schedule 24/7, reducing phone calls and increasing bookings.',
        },
      ],
      navigation: [
        {
          name: 'Online Booking Overview',
          description: 'Learn about online booking benefits',
          url: 'https://help.housecallpro.com/online-booking',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [
        {
          name: 'Online Booking Demo',
          url: 'https://calendly.com/hcp-sales/online-booking',
          team: 'sales',
          description: 'See how online booking can increase your appointments',
        },
      ],
      prompt: 'Explain the benefits of online booking for customer convenience and business growth.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'online_booking.access', negated: false },
          { variable: 'online_booking.configured', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'online-booking', required: true },
      ],
      contextSnippets: [
        {
          id: 'setup',
          title: 'Setup Required',
          content: 'Configure your online booking settings including available services, time windows, and employee availability.',
        },
      ],
      navigation: [
        {
          name: 'Online Booking Settings',
          description: 'Configure online booking',
          url: '/settings/online-booking',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [
        {
          name: 'Online Booking Setup',
          url: 'https://calendly.com/hcp-onboarding/online-booking',
          team: 'onboarding',
          description: 'Get help setting up online booking',
        },
      ],
      prompt: 'Guide the pro through configuring online booking settings.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'online_booking.configured', negated: false },
          { variable: 'online_booking.first_booking', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'promote',
          title: 'Promote Your Booking',
          content: 'Online booking is live! Share your booking link on your website and social media.',
        },
      ],
      navigation: [
        {
          name: 'Booking Link',
          description: 'Get your shareable booking link',
          url: '/settings/online-booking/link',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the pro promote their online booking link to get their first booking.',
      tools: [],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'online_booking.first_booking', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'success',
          title: 'Bookings Coming In',
          content: 'Customers are booking online! Monitor your booking metrics and adjust availability as needed.',
        },
      ],
      navigation: [
        {
          name: 'Booking Analytics',
          description: 'View online booking metrics',
          url: '/reports/online-booking',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Offer tips for optimizing online booking conversion and managing availability.',
      tools: [],
    },
  },
};
