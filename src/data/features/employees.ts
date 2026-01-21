import type { Feature } from '../../types';

export const employeesFeature: Feature = {
  id: 'employees',
  name: 'Employees',
  description: 'Add and manage your team members, assign jobs, and track performance',
  icon: 'People',
  version: '1.0.0',
  releaseStatus: 'published',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'employees.enabled', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Manage your entire team from one place. Add employees, assign jobs, and track who\'s doing what in real-time.',
        },
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Teams using digital employee management report 30% better job coordination.',
        },
      ],
      navigation: [
        {
          name: 'Team Management Overview',
          description: 'Learn about managing your team in Housecall Pro',
          url: 'https://help.housecallpro.com/team-management',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the pro understand the benefits of adding their team to Housecall Pro.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'employees.enabled', negated: false },
          { variable: 'employees.first_added', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'add-employees', required: true },
      ],
      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Add your first employee to start assigning jobs and tracking team performance. Employees get their own mobile app access.',
        },
      ],
      navigation: [
        {
          name: 'Adding Employees',
          description: 'Step-by-step guide to adding team members',
          url: 'https://help.housecallpro.com/adding-employees',
          navigationType: 'hcp_help',
        },
        {
          name: 'Employees',
          description: 'View and manage your team',
          url: '/employees',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Add Employee',
          description: 'Add a new team member',
          url: '/employees/new',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [
        {
          name: 'Team Setup Help',
          url: 'https://calendly.com/hcp-onboarding/team-setup',
          team: 'onboarding',
          description: 'Get help adding your team members',
        },
      ],
      prompt: 'Guide the pro through adding their first employee. Explain mobile app access and permissions.',
      tools: [
        {
          name: 'hcp_add_employee',
          description: 'Add a new employee to the account',
          parameters: {
            first_name: { type: 'string', description: 'Employee first name', required: true },
            last_name: { type: 'string', description: 'Employee last name', required: true },
            email: { type: 'string', description: 'Employee email address', required: true },
            role: { type: 'string', description: 'Employee role (technician, office, admin)' },
          },
        },
      ],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'employees.first_added', negated: false },
          { variable: 'employees.first_assigned', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'assign-job-to-employee', required: true },
      ],
      contextSnippets: [
        {
          id: 'ready-to-assign',
          title: 'Ready to Assign',
          content: 'Your employee is added! Now assign them to a job to see the dispatch workflow in action.',
        },
      ],
      navigation: [
        {
          name: 'Employees',
          description: 'View and manage your team',
          url: '/employees',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Dispatch Board',
          description: 'Assign jobs to employees',
          url: '/dispatch',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Assigning Jobs',
          description: 'Learn how to dispatch jobs to your team',
          url: 'https://help.housecallpro.com/dispatching-jobs',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the pro assign their first job to an employee and understand the dispatch workflow.',
      tools: [
        {
          name: 'hcp_assign_job',
          description: 'Assign a job to an employee',
          parameters: {
            job_id: { type: 'string', description: 'Job ID to assign', required: true },
            employee_id: { type: 'string', description: 'Employee ID to assign to', required: true },
          },
        },
      ],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'employees.first_assigned', negated: false },
          { variable: 'employees.recent_activity', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'power-user',
          title: 'Power User',
          content: 'Your team is up and running! Explore advanced features like GPS tracking and performance reports.',
        },
      ],
      navigation: [
        {
          name: 'Employees',
          description: 'View and manage your team',
          url: '/employees',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Dispatch Board',
          description: 'Assign jobs to employees',
          url: '/dispatch',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Team Reports',
          description: 'View employee performance reports',
          url: '/reports/team',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'GPS Tracking',
          description: 'Track your team in real-time',
          url: 'https://help.housecallpro.com/gps-tracking',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [],
      prompt: 'The pro is actively managing their team. Help them with advanced features like GPS tracking and reports.',
      tools: [
        {
          name: 'hcp_get_employee_schedule',
          description: 'Get an employee\'s schedule',
          parameters: {
            employee_id: { type: 'string', description: 'Employee ID', required: true },
            date_range: { type: 'string', description: 'Date range for schedule' },
          },
        },
      ],
    },
  },
};
