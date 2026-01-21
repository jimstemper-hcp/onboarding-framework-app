import type { Feature } from '../../types';

export const jobsFeature: Feature = {
  id: 'jobs',
  name: 'Jobs',
  description: 'Create, manage, and complete jobs for your customers',
  icon: 'Work',
  version: '1.0.0',
  releaseStatus: 'published',

  stages: {
    notAttached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'jobs.created_count', negated: true },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'value-prop',
          title: 'Value Proposition',
          content: 'Jobs are the core of your business. Track work from start to finish, and automatically generate invoices when jobs are completed.',
        },
        {
          id: 'stat-highlight',
          title: 'Key Statistic',
          content: 'Pros who use digital job management save an average of 5 hours per week on paperwork.',
        },
      ],
      navigation: [
        {
          name: 'Jobs Overview',
          description: 'Learn about job management in Housecall Pro',
          url: 'https://help.housecallpro.com/jobs-overview',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the pro understand how jobs work and the benefits of digital job management.',
      tools: [],
    },

    attached: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'jobs.enabled', negated: false },
          { variable: 'jobs.first_created', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'create-first-customer', required: true },
        { itemId: 'create-first-job', required: true },
      ],
      contextSnippets: [
        {
          id: 'setup-overview',
          title: 'Setup Overview',
          content: 'Create your first job by adding a customer, then scheduling the work. Jobs track everything from the initial request to completion.',
        },
      ],
      navigation: [
        {
          name: 'Creating Your First Job',
          description: 'Step-by-step guide to creating jobs',
          url: 'https://help.housecallpro.com/first-job',
          navigationType: 'hcp_help',
        },
        {
          name: 'Jobs',
          description: 'View and manage all jobs',
          url: '/jobs',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'New Job',
          description: 'Create a new job',
          url: '/jobs/new',
          navigationType: 'hcp_navigate',
        },
      ],
      calendlyTypes: [
        {
          name: 'Jobs Setup Help',
          url: 'https://calendly.com/hcp-onboarding/jobs-setup',
          team: 'onboarding',
          description: 'Get help setting up your job workflow',
        },
      ],
      prompt: 'Guide the pro through creating their first job. Offer to use sample data or real customer info.',
      tools: [
        {
          name: 'hcp_create_customer',
          description: 'Create a new customer in Housecall Pro',
          parameters: {
            first_name: { type: 'string', description: 'Customer first name', required: true },
            last_name: { type: 'string', description: 'Customer last name', required: true },
            email: { type: 'string', description: 'Customer email address' },
            mobile_number: { type: 'string', description: 'Customer phone number' },
          },
        },
        {
          name: 'hcp_create_job',
          description: 'Create a new job for a customer',
          parameters: {
            customer_id: { type: 'string', description: 'Customer ID', required: true },
            description: { type: 'string', description: 'Job description' },
            scheduled_start: { type: 'string', description: 'Scheduled start time' },
          },
        },
      ],
    },

    activated: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'jobs.first_created', negated: false },
          { variable: 'jobs.first_completed', negated: true },
        ],
      },
      onboardingItems: [
        { itemId: 'complete-first-job', required: true },
      ],
      contextSnippets: [
        {
          id: 'ready-to-complete',
          title: 'Ready to Complete',
          content: 'You\'ve created your first job! Complete it to generate an invoice and start the billing process.',
        },
      ],
      navigation: [
        {
          name: 'Jobs',
          description: 'View and manage all jobs',
          url: '/jobs',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Completing Jobs',
          description: 'Learn how to complete jobs and generate invoices',
          url: 'https://help.housecallpro.com/completing-jobs',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [],
      prompt: 'Help the pro complete their first job and understand the job-to-invoice workflow.',
      tools: [
        {
          name: 'hcp_complete_job',
          description: 'Mark a job as completed',
          parameters: {
            job_id: { type: 'string', description: 'Job ID to complete', required: true },
          },
        },
      ],
    },

    engaged: {
      accessConditions: {
        operator: 'AND',
        conditions: [
          { variable: 'jobs.first_completed', negated: false },
          { variable: 'jobs.recent_activity', negated: false },
        ],
      },
      onboardingItems: [],
      contextSnippets: [
        {
          id: 'power-user',
          title: 'Power User',
          content: 'You\'re using jobs like a pro! Check out advanced features like job templates and recurring jobs.',
        },
      ],
      navigation: [
        {
          name: 'Jobs',
          description: 'View and manage all jobs',
          url: '/jobs',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Job Templates',
          description: 'Create templates for common job types',
          url: '/settings/job-templates',
          navigationType: 'hcp_navigate',
        },
        {
          name: 'Advanced Job Features',
          description: 'Learn about recurring jobs and templates',
          url: 'https://help.housecallpro.com/advanced-jobs',
          navigationType: 'hcp_help',
        },
      ],
      calendlyTypes: [],
      prompt: 'The pro is an active jobs user. Help them with advanced features like templates and recurring jobs.',
      tools: [
        {
          name: 'hcp_create_job',
          description: 'Create a new job for a customer',
          parameters: {
            customer_id: { type: 'string', description: 'Customer ID', required: true },
            description: { type: 'string', description: 'Job description' },
            scheduled_start: { type: 'string', description: 'Scheduled start time' },
            line_items: { type: 'array', description: 'Services and prices' },
          },
        },
      ],
    },
  },
};
