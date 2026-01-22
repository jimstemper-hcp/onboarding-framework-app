import type { Feature } from '../../types';

export const employeesFeature: Feature = {
  id: 'employees',
  name: 'Employees',
  description: 'Add and manage your team members, assign jobs, and track performance',
  icon: 'People',
  version: '1.1.0',
  releaseStatus: 'published',

  stages: {
    // =========================================================================
    // NOT ATTACHED - Pro hasn't enabled employee management
    // =========================================================================
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
          content: 'Teams using digital employee management report 30% better job coordination and 25% fewer missed appointments.',
        },
      ],

      navigation: [
        {
          name: 'Team Management Overview',
          description: 'Learn about managing your team in Housecall Pro',
          url: 'https://help.housecallpro.com/team-management',
          navigationType: 'hcp_help',
        },
        {
          name: 'Mobile App for Technicians',
          description: 'Video showing the technician mobile experience',
          url: 'https://www.youtube.com/watch?v=hcp-tech-app',
          navigationType: 'hcp_video',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about employees:
1. Explain the benefits of adding their team to Housecall Pro
2. Reference the help article: "Team Management Overview"
3. Highlight: 30% better job coordination, mobile app for technicians

Key benefits to emphasize:
- Each technician gets their own mobile app
- Real-time job updates and notifications
- GPS tracking for dispatching
- Performance tracking and reports

## Chat Experience
When the user asks about employees at this stage:
- Response: "Great question about team management! Let me explain how it works."
- Priority Action: tip
- Suggested CTA: "Learn More" - Adding your team lets you dispatch jobs and track who's where in real-time. Each employee gets their own mobile app.
- Escalation Triggers: can't access employees, team feature not showing`,

      tools: [],
    },

    // =========================================================================
    // ATTACHED - Pro has access but hasn't added first employee
    // Navigation-focused: Guide to real employee addition (no sample employees)
    // =========================================================================
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
          content: 'Add your first team member to start dispatching jobs. They\'ll receive an email invite with access to the mobile app.',
        },
        {
          id: 'no-sample-data',
          title: 'Real Data Only',
          content: 'Unlike other features, employees should always be real team members. Guide the pro through adding a real employee rather than sample data.',
        },
        {
          id: 'invite-flow',
          title: 'Invite Flow',
          content: 'Collect employee name and email, then send invite. They\'ll set up their own password and download the mobile app.',
        },
      ],

      navigation: [
        {
          name: 'Adding Employees Guide',
          description: 'Step-by-step guide to adding team members',
          url: 'https://help.housecallpro.com/adding-employees',
          navigationType: 'hcp_help',
        },
        {
          name: 'Employee Roles Video',
          description: 'Understanding different employee roles and permissions',
          url: 'https://www.youtube.com/watch?v=hcp-employee-roles',
          navigationType: 'hcp_video',
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

      prompt: `When user asks about employees:
1. Explain how employee management helps with dispatching and tracking
2. Do NOT offer sample data - employees should always be real team members
3. Ask: "What's your first team member's name and email? I'll help you send them an invite."

If they want to add an employee:
- Collect info conversationally: first name, last name, email
- Ask about role: "What role should they have? Technician (field work), Office (scheduling), or Admin (full access)?"
- Show preview before sending invite:
  | Field | Value |
  |-------|-------|
  | Name | [First] [Last] |
  | Email | [email] |
  | Role | [role] |
- Explain: "They'll receive an email to set up their password and download the mobile app."
- After confirmation, use hcp_add_employee to send invite

If they have questions about roles:
- **Technician**: Can view assigned jobs, mark complete, collect payments on mobile app
- **Office**: Can schedule jobs, manage customers, send invoices
- **Admin**: Full access to all features including reports and settings

## Chat Experience
When the user asks about employees at this stage:
- Response: "Adding your team lets you dispatch jobs and track who's where!"
- Priority Action: navigation
- Suggested CTA: "Add Team Member" - What's your first team member's name and email? I'll walk you through sending them an invite.
- Escalation Triggers: invite not received, permission issues, wrong role, can't log in`,

      tools: [
        {
          name: 'hcp_add_employee',
          description: 'Add a new employee and send them an invite',
          parameters: {
            first_name: { type: 'string', description: 'Employee first name', required: true },
            last_name: { type: 'string', description: 'Employee last name', required: true },
            email: { type: 'string', description: 'Employee email address', required: true },
            role: { type: 'string', description: 'Employee role: technician, office, or admin', required: true },
            mobile_number: { type: 'string', description: 'Employee phone number (optional)' },
          },
        },
        {
          name: 'hcp_list_employees',
          description: 'List current employees',
          parameters: {
            limit: { type: 'number', description: 'Maximum number to return' },
            role: { type: 'string', description: 'Filter by role' },
          },
        },
        {
          name: 'navigate_to_employees',
          description: 'Navigate to the employees page',
          parameters: {
            action: { type: 'string', description: 'Action: list, add' },
          },
        },
      ],
    },

    // =========================================================================
    // ACTIVATED - Pro has added employee, ready to dispatch
    // Focus on dispatch workflow and first job assignment
    // =========================================================================
    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'employees.first_added', negated: false },
          { variable: 'employees.first_assigned', negated: true },
        ],
      },

      onboardingItems: [
        { itemId: 'assign-job-to-employee', required: true, stageSpecificNote: 'Assign a job to see the dispatch workflow in action' },
      ],

      contextSnippets: [
        {
          id: 'ready-to-assign',
          title: 'Ready to Assign',
          content: 'Your team member is set up! Now assign them to a job to see the dispatch workflow in action.',
        },
        {
          id: 'pro-tip',
          title: 'Pro Tip',
          content: 'Use the dispatch board for a visual overview of who\'s doing what. Drag and drop jobs to assign or reschedule.',
        },
      ],

      navigation: [
        {
          name: 'Dispatching Jobs Guide',
          description: 'Learn how to dispatch jobs to your team',
          url: 'https://help.housecallpro.com/dispatching-jobs',
          navigationType: 'hcp_help',
        },
        {
          name: 'Dispatch Board Tutorial',
          description: 'Video walkthrough of the dispatch board',
          url: 'https://www.youtube.com/watch?v=hcp-dispatch-board',
          navigationType: 'hcp_video',
        },
        {
          name: 'Dispatch Board',
          description: 'Visual job assignment and scheduling',
          url: '/dispatch',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Employees',
          description: 'View and manage your team',
          url: '/employees',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Jobs',
          description: 'View available jobs to assign',
          url: '/jobs',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [],

      prompt: `When user asks about employees:
1. Acknowledge they've added their first team member - great progress!
2. Explain the dispatch workflow
3. Offer: "Would you like to assign a job to your team member now?"

Dispatch workflow to explain:
1. Jobs can be assigned when created or from the dispatch board
2. Employee receives notification on mobile app
3. They can see job details, customer info, and directions
4. Real-time status updates as they work

If they want to assign:
- Use hcp_list_jobs to find unassigned jobs
- Use hcp_list_employees to show available team members
- Show assignment preview
- Use hcp_assign_job to make the assignment
- Navigate to dispatch board to see the result

## Chat Experience
When the user asks about employees at this stage:
- Response: "Great job setting up your team! Now let's dispatch your first job."
- Priority Action: navigation
- Suggested CTA: "Open Dispatch Board" - Would you like to assign a job to your team member? I can help you get started with dispatching.
- Escalation Triggers: employee not seeing jobs, dispatch not working, wrong employee assigned, can't reassign`,

      tools: [
        {
          name: 'hcp_list_employees',
          description: 'List employees to see who\'s available',
          parameters: {
            limit: { type: 'number', description: 'Maximum number to return' },
            role: { type: 'string', description: 'Filter by role' },
          },
        },
        {
          name: 'hcp_list_jobs',
          description: 'List jobs to find one to assign',
          parameters: {
            status: { type: 'string', description: 'Filter by status: unassigned, scheduled' },
            limit: { type: 'number', description: 'Maximum number to return' },
          },
        },
        {
          name: 'hcp_assign_job',
          description: 'Assign a job to an employee',
          parameters: {
            job_id: { type: 'string', description: 'Job ID to assign', required: true },
            employee_id: { type: 'string', description: 'Employee ID to assign to', required: true },
          },
        },
        {
          name: 'navigate_to_dispatch',
          description: 'Navigate to the dispatch board',
          parameters: {},
        },
      ],
    },

    // =========================================================================
    // ENGAGED - Pro is actively managing their team
    // =========================================================================
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
          content: 'Your team is up and running! Explore advanced features like GPS tracking, time tracking, and performance reports.',
        },
        {
          id: 'advanced-tip',
          title: 'Advanced Tip',
          content: 'Use GPS tracking to optimize routes and reduce drive time. Performance reports help identify your top performers.',
        },
      ],

      navigation: [
        {
          name: 'GPS Tracking Guide',
          description: 'Set up real-time team tracking',
          url: 'https://help.housecallpro.com/gps-tracking',
          navigationType: 'hcp_help',
        },
        {
          name: 'Team Performance Video',
          description: 'How to use team performance reports',
          url: 'https://www.youtube.com/watch?v=hcp-team-reports',
          navigationType: 'hcp_video',
        },
        {
          name: 'Dispatch Board',
          description: 'Manage job assignments',
          url: '/dispatch',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Employees',
          description: 'View and manage your team',
          url: '/employees',
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
          url: '/dispatch/gps',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Time Tracking',
          description: 'View time logs and timesheets',
          url: '/reports/time',
          navigationType: 'hcp_navigate',
        },
      ],

      calendlyTypes: [
        {
          name: 'Team Optimization Review',
          url: 'https://calendly.com/hcp-success/team-review',
          team: 'support',
          description: 'Optimize your team management workflow',
        },
      ],

      prompt: `When user asks about employees:
1. Provide advanced tips for team management
2. Offer to help with advanced features:
   - "Would you like to enable GPS tracking to see your team in real-time?"
   - "Would you like to view your team's performance reports?"
   - "Would you like to set up time tracking for timesheets?"
3. Help with ongoing team management needs

Advanced features to highlight:
- GPS tracking for real-time location
- Route optimization to reduce drive time
- Performance reports and analytics
- Time tracking and timesheets
- Commission tracking

## Chat Experience
When the user asks about employees at this stage:
- Response: "Your team is running smoothly! Here are some advanced tips."
- Priority Action: tip
- Suggested CTA: "View Reports" - Would you like to see your team's performance reports? You can also enable GPS tracking to see real-time locations and optimize routes.
- Escalation Triggers: employee locked out, payroll issue, time tracking wrong, GPS not working, employee left company`,

      tools: [
        {
          name: 'hcp_list_employees',
          description: 'List employees',
          parameters: {
            limit: { type: 'number', description: 'Maximum number to return' },
            role: { type: 'string', description: 'Filter by role' },
          },
        },
        {
          name: 'hcp_get_employee_schedule',
          description: 'Get an employee\'s schedule',
          parameters: {
            employee_id: { type: 'string', description: 'Employee ID', required: true },
            date_range: { type: 'string', description: 'Date range for schedule' },
          },
        },
        {
          name: 'hcp_get_team_performance',
          description: 'Get team performance metrics',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
            period: { type: 'string', description: 'Time period: week, month, quarter' },
          },
        },
        {
          name: 'hcp_update_employee',
          description: 'Update employee information or role',
          parameters: {
            employee_id: { type: 'string', description: 'Employee ID', required: true },
            role: { type: 'string', description: 'New role' },
            active: { type: 'boolean', description: 'Whether employee is active' },
          },
        },
        {
          name: 'hcp_get_gps_locations',
          description: 'Get current GPS locations for team',
          parameters: {
            proId: { type: 'string', description: 'The pro account ID', required: true },
          },
        },
      ],
    },
  },
};
