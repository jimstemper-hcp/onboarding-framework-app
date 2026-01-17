import type { Feature } from '../../types';

export const schedulingFeature: Feature = {
  id: 'scheduling',
  name: 'Job Scheduling & Dispatching',
  description: 'Schedule jobs and dispatch your team efficiently',
  icon: 'CalendarMonth',
  version: '3.0.1',

  stages: {
    notAttached: {
      conditions: [
        'Pro does not have Scheduling feature in their current plan',
        'Pro has not purchased Scheduling as an add-on',
      ],
      valueProp: 'Stop the scheduling chaos. See your whole team\'s schedule at a glance and dispatch jobs with one click.',
      sellPageUrl: '/pricing/scheduling',
      learnMoreResources: [
        { title: 'Scheduling Overview', url: 'https://help.housecallpro.com/scheduling', type: 'article' },
      ],
      calendlyTypes: [
        { name: 'Scheduling Demo', url: 'https://calendly.com/hcp-sales/scheduling', team: 'sales', description: 'See the scheduling features' },
      ],
      upgradeTools: [],
      upgradePrompt: 'Help the pro understand how scheduling and dispatching can save hours every week.',
      repTalkingPoints: [
        'See your whole team\'s availability in one place',
        'Dispatch jobs with drag-and-drop simplicity',
        'Reduce drive time with smart routing suggestions',
      ],
    },
    attached: {
      conditions: [
        'Pro has Scheduling feature in their plan',
        'Pro has not added team members or scheduled a job',
      ],
      requiredTasks: [
        { id: 'scheduling-add-employee', title: 'Add your team members', description: 'Add employees so you can assign jobs to them', estimatedMinutes: 3, actionUrl: '/settings/team', completionEvent: 'team.member_added' },
        { id: 'scheduling-set-hours', title: 'Set your business hours', description: 'Define when your business is available for jobs', estimatedMinutes: 2, actionUrl: '/settings/schedule', completionEvent: 'schedule.hours_set' },
        { id: 'scheduling-first-job', title: 'Schedule your first job', description: 'Create and schedule a job to see the calendar in action', estimatedMinutes: 3, actionUrl: '/calendar', completionEvent: 'job.scheduled' },
      ],
      productPages: [
        { name: 'Calendar', path: '/calendar', description: 'View and manage schedule' },
        { name: 'Team Settings', path: '/settings/team', description: 'Manage team members' },
      ],
      tooltipUrls: [],
      videos: [
        { title: 'Using the Dispatch Board', url: 'https://youtube.com/watch?v=hcp-dispatch', durationSeconds: 240 },
      ],
      calendlyTypes: [
        { name: 'Scheduling Setup', url: 'https://calendly.com/hcp-onboarding/scheduling', team: 'onboarding', description: 'Get help setting up your schedule' },
      ],
      mcpTools: [],
      agenticPrompt: 'Guide the pro through adding team members, setting business hours, and scheduling their first job.',
      repTalkingPoints: [
        'First, let\'s add your team members so you can assign jobs',
        'Setting your business hours helps customers book at the right times',
        'Try scheduling a job to see how the calendar works',
      ],
    },
    activated: {
      conditions: [
        'Pro has added team members and scheduled at least one job',
        'Pro has scheduled fewer than 20 jobs total',
      ],
      optionalTasks: [
        { id: 'scheduling-online-booking', title: 'Enable online booking', description: 'Let customers book appointments from your website', estimatedMinutes: 5, actionUrl: '/settings/online-booking', completionEvent: 'booking.enabled' },
        { id: 'scheduling-sync-calendar', title: 'Sync with Google Calendar', description: 'Keep your personal calendar in sync', estimatedMinutes: 2, actionUrl: '/settings/integrations/google', completionEvent: 'calendar.synced' },
      ],
      productPages: [{ name: 'Calendar', path: '/calendar', description: 'Your team schedule' }],
      calendlyTypes: [],
      mcpTools: [],
      engagementPrompt: 'Encourage the pro to enable online booking and sync their calendar.',
      repTalkingPoints: [
        'Your scheduling is all set up!',
        'Have you considered enabling online booking? Customers love being able to book 24/7',
      ],
    },
    engaged: {
      conditions: [
        'Pro has scheduled 20 or more jobs',
        'Pro has scheduled a job within the last 7 days',
      ],
      advancedTips: ['Use the mobile app to check and update schedules on the go', 'Set up job tags to organize by job type'],
      successMetrics: ['Schedule utilization over 80%', 'Drive time under 20% of day'],
      upsellOpportunities: ['Add GPS tracking to see your team in real-time'],
      repTalkingPoints: ['Your scheduling is running smoothly!', 'Want to see your team\'s locations in real-time?'],
    },
  },
};
