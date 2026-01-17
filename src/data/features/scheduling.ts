import type { Feature } from '../../types';

export const schedulingFeature: Feature = {
  id: 'scheduling',
  name: 'Job Scheduling & Dispatching',
  description: 'Schedule jobs and dispatch your team efficiently',
  icon: 'CalendarMonth',
  version: '3.0.1',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.scheduling', negated: true },
          { variable: 'addons.scheduling', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Stop the scheduling chaos. See your whole team\'s schedule at a glance and dispatch jobs with one click.',
        },
      ],
      navigation: [
        {
          name: 'Scheduling Pricing',
          description: 'Self-serve page for scheduling and dispatching pricing',
          url: '/pricing/scheduling',
          navigationType: 'hcp_sell_page',
        },
        {
          name: 'Scheduling Overview',
          description: 'Help article explaining the scheduling and dispatching features',
          url: 'https://help.housecallpro.com/scheduling',
          navigationType: 'hcp_help_article',
        },
      ],
      calendlyTypes: [
        { name: 'Scheduling Demo', url: 'https://calendly.com/hcp-sales/scheduling', team: 'sales', description: 'See the scheduling features' },
      ],
      prompt: 'Help the pro understand how scheduling and dispatching can save hours every week.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'billing.plan.scheduling', negated: false },
          { variable: 'scheduling.setup_complete', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'create-first-customer', required: true },
        { itemId: 'set-business-hours', required: true },
        { itemId: 'add-team-member', required: false, stageSpecificNote: 'Skip if you work alone' },
        { itemId: 'schedule-first-job', required: true },
        { itemId: 'dispatch-first-job', required: false, stageSpecificNote: 'Required only if you have team members' },
        { itemId: 'rep-training-session-scheduled', required: false },
      ],
      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Set your business hours, add team members, and schedule your first job.',
        },
      ],
      navigation: [
        {
          name: 'Calendar',
          description: 'View and manage schedule',
          url: '/calendar',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Team Settings',
          description: 'Manage team members',
          url: '/settings/team',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Using the Dispatch Board',
          description: 'Video tutorial on dispatching jobs',
          url: 'https://youtube.com/watch?v=hcp-dispatch',
          navigationType: 'hcp_video',
        },
      ],
      calendlyTypes: [
        { name: 'Scheduling Setup', url: 'https://calendly.com/hcp-onboarding/scheduling', team: 'onboarding', description: 'Get help setting up your schedule' },
      ],
      prompt: 'Guide the pro through adding team members, setting business hours, and scheduling their first job.',
      tools: [],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'scheduling.setup_complete', negated: false },
          { variable: 'scheduling.job_count', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'ready-to-go',
          title: 'Scheduling Active',
          content: 'Your scheduling is set up! Enable online booking to let customers book 24/7.',
        },
      ],
      navigation: [
        {
          name: 'Calendar',
          description: 'Your team schedule',
          url: '/calendar',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Online Booking',
          description: 'Let customers book online',
          url: '/settings/online-booking',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Encourage the pro to enable online booking and sync their calendar.',
      tools: [],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'scheduling.job_count', negated: false },
          { variable: 'scheduling.recent_activity', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'success',
          title: 'Scheduling Pro',
          content: 'Your scheduling is running smoothly! Add GPS tracking to see your team in real-time.',
        },
      ],
      navigation: [
        {
          name: 'Calendar',
          description: 'Your team schedule',
          url: '/calendar',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'GPS Tracking',
          description: 'See your team\'s location in real-time',
          url: '/settings/gps',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the experienced scheduling user optimize routes and explore GPS tracking.',
      tools: [],
    },
  },
};
