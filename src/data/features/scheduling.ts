import type { Feature } from '../../types';

export const schedulingFeature: Feature = {
  id: 'scheduling',
  name: 'Job Scheduling & Dispatching',
  description: 'Schedule jobs and dispatch your team efficiently',
  icon: 'CalendarMonth',
  version: '3.0.1',
  releaseStatus: 'draft',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro doesn't have access to scheduling
    // =========================================================================
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
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Never double-book again - visual calendar shows all technicians in real-time.',
        },
      ],

      navigation: [
        {
          name: 'Scheduling & Calendar Overview',
          description: 'Complete guide to scheduling and dispatching',
          url: 'https://help.housecallpro.com/scheduling-overview',
          navigationType: 'hcp_help',
        },
        {
          name: 'Dispatch Board Tutorial',
          description: 'Video walkthrough of the dispatch board',
          url: 'https://www.youtube.com/watch?v=hcp-dispatch',
          navigationType: 'hcp_video',
        },
        {
          name: 'Scheduling Pricing',
          description: 'Self-serve page for scheduling and dispatching pricing',
          url: '/pricing/scheduling',
          navigationType: 'hcp_external',
        },
        {
          name: 'Scheduling Overview',
          description: 'Help article explaining the scheduling and dispatching features',
          url: 'https://help.housecallpro.com/scheduling',
          navigationType: 'hcp_help',
        },
      ],

      calendlyTypes: [
        {
          name: 'Scheduling Demo',
          url: 'https://calendly.com/hcp-sales/scheduling',
          team: 'sales',
          description: 'See the scheduling features in action',
        },
      ],

      prompt: `When user asks about scheduling:
1. First, explain how the visual calendar helps manage all jobs and team members
2. Reference the help article: "Scheduling & Calendar Overview"
3. Mention the key benefit: never double-book again
4. Then say: "I notice you don't have scheduling enabled yet. I can schedule a demo to show you how to manage your calendar and dispatch jobs efficiently."
5. If interested, provide the Calendly link

Key points to emphasize:
- Visual calendar for all jobs and team members
- Drag and drop to reschedule
- One-click dispatch to technicians
- Online booking for customers

## Chat Experience
When the user asks about scheduling at this stage:
- Response: "Great question about scheduling! Let me explain how the calendar and dispatch board work."
- Priority Action: call
- Suggested CTA: "Talk to Sales" - Scheduling isn't enabled on your account yet. I can schedule a demo to show you how to manage your calendar and dispatch jobs efficiently.
- Escalation Triggers: pricing, team size, cost`,

      tools: [
        {
          name: 'check_plan_eligibility',
          description: 'Check if the pro is eligible to add scheduling',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'schedule_sales_call',
          description: 'Schedule a sales demo call',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ATTACHED - Pro has access but hasn't set up calendar
    // =========================================================================
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
        {
          id: 'sample-flow',
          title: 'Sample Data Option',
          content: 'Offer to create a sample job to demonstrate the scheduling workflow.',
        },
      ],

      navigation: [
        {
          name: 'Calendar Setup Guide',
          description: 'How to set up your calendar and business hours',
          url: 'https://help.housecallpro.com/calendar-setup',
          navigationType: 'hcp_help',
        },
        {
          name: 'Using the Dispatch Board',
          description: 'Video tutorial on dispatching jobs',
          url: 'https://youtube.com/watch?v=hcp-dispatch',
          navigationType: 'hcp_video',
        },
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
      ],

      calendlyTypes: [
        {
          name: 'Scheduling Setup',
          url: 'https://calendly.com/hcp-onboarding/scheduling',
          team: 'onboarding',
          description: 'Get help setting up your schedule',
        },
      ],

      prompt: `When user asks about scheduling:
1. First explain how the calendar works with help article reference
2. Then ask: "Would you like to create a sample job to see how scheduling works, or schedule a real job?"

If SAMPLE:
- Create sample job with customer
- Show it on the calendar
- Demonstrate drag-and-drop rescheduling
- Offer next steps: enable online booking, add team members

If REAL:
- Ask about the job: customer, date/time, work description
- Create the job on their calendar
- Show them how to dispatch if they have team members

Always show previews before creating and get confirmation.

## Chat Experience
When the user asks about scheduling at this stage:
- Response: "You have scheduling! Let's set up your calendar and business hours."
- Priority Action: onboarding
- Suggested CTA: "Setup Calendar" - Would you like to create a sample job to see how scheduling works, or schedule a real job right now?
- Escalation Triggers: calendar not loading, can't schedule, team not showing`,

      tools: [
        {
          name: 'create_sample_job',
          description: 'Create a sample job for demo',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'create_job',
          description: 'Create a real job',
          parameters: {
            customerId: { type: 'string', description: 'Customer ID', required: true },
            scheduledDate: { type: 'string', description: 'When to schedule' },
            description: { type: 'string', description: 'Job description' },
          },
        },
        {
          name: 'set_business_hours',
          description: 'Configure business hours',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            hours: { type: 'object', description: 'Business hours by day' },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has calendar set up
    // =========================================================================
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
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Enable online booking and add the dispatch board for team management.',
        },
      ],

      navigation: [
        {
          name: 'Online Booking Guide',
          description: 'How to enable 24/7 customer booking',
          url: 'https://help.housecallpro.com/online-booking',
          navigationType: 'hcp_help',
        },
        {
          name: 'Dispatch Board Video',
          description: 'Video on using the dispatch board',
          url: 'https://www.youtube.com/watch?v=hcp-dispatch-board',
          navigationType: 'hcp_video',
        },
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

      prompt: `When user asks about scheduling:
1. Provide help content - calendar is ready
2. Offer these specific actions:
   - "Would you like to enable online booking so customers can book 24/7?"
   - "Would you like to create your first job to try the calendar?"
   - "Would you like to set up dispatch if you have a team?"
3. For each action, explain the benefit and guide them through

Key actions to offer:
1. Online booking - enable 24/7 customer self-service
2. Create job - try the calendar features
3. Dispatch setup - for teams with multiple techs

## Chat Experience
When the user asks about scheduling at this stage:
- Response: "Your scheduling is set up! Ready to schedule your first job."
- Priority Action: navigation
- Suggested CTA: "Create Job" - What would you like to do? 1. Enable online booking for 24/7 appointments 2. Create your first job on the calendar 3. Set up dispatch for your team
- Escalation Triggers: job not showing, customer can't book, dispatch error`,

      tools: [
        {
          name: 'enable_online_booking',
          description: 'Enable customer online booking',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            services: { type: 'array', description: 'Services to offer for booking' },
          },
        },
        {
          name: 'create_job',
          description: 'Create a job on the calendar',
          parameters: {
            customerName: { type: 'string', description: 'Customer name', required: true },
            scheduledDate: { type: 'string', description: 'Date and time' },
            description: { type: 'string', description: 'Job description' },
          },
        },
        {
          name: 'configure_dispatch',
          description: 'Set up dispatch board',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },

    // =========================================================================
    // ENGAGED - Pro is actively using scheduling
    // =========================================================================
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
        {
          id: 'advanced-tip',
          title: 'Advanced Tip',
          content: 'Enable route optimization and GPS tracking for maximum efficiency.',
        },
      ],

      navigation: [
        {
          name: 'GPS Tracking Guide',
          description: 'How to track your team in real-time',
          url: 'https://help.housecallpro.com/gps-tracking',
          navigationType: 'hcp_help',
        },
        {
          name: 'Route Optimization Video',
          description: 'Video on optimizing technician routes',
          url: 'https://www.youtube.com/watch?v=hcp-routes',
          navigationType: 'hcp_video',
        },
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

      prompt: `When user asks about scheduling:
1. Provide advanced tips for power users
2. Offer to help with advanced features:
   - "Would you like to set up GPS tracking to see your team in real-time?"
   - "Would you like to enable route optimization to reduce drive time?"
   - "Would you like to see your scheduling analytics?"
3. Explain how these features improve efficiency

Advanced features to highlight:
- GPS tracking for real-time team visibility
- Route optimization to minimize drive time
- Time tracking for accurate job records
- Scheduling analytics and insights

## Chat Experience
When the user asks about scheduling at this stage:
- Response: "You're a power scheduler! Your scheduling is running smoothly."
- Priority Action: tip
- Suggested CTA: "Try Dispatch" - Would you like to set up GPS tracking to see your team's location in real-time? You can also try the dispatch board for better team management.
- Escalation Triggers: gps not working, team location wrong, schedule conflict`,

      tools: [
        {
          name: 'enable_gps_tracking',
          description: 'Enable GPS tracking for team',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'enable_route_optimization',
          description: 'Enable route optimization',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
        {
          name: 'get_scheduling_analytics',
          description: 'Get scheduling performance metrics',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            period: { type: 'string', description: 'Time period' },
          },
        },
      ],
    },
  },
};
