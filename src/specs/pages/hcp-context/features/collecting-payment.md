# Collecting Payment Feature

## Overview
The Collecting Payment feature enables pros to accept payments from customers through various methods including credit cards, ACH, and in-person payments.

## Key Features
- Multiple payment method support
- Payment processor integration
- Auto-pay configuration
- Payment reminders
- Receipt generation

## Stage Contexts

### Not Attached
- Benefit messaging: "Accept payments instantly from anywhere"
- Payment method discovery

### Attached
- Onboarding items: Connect payment processor, process first payment
- Payment setup guides

### Activated
- Onboarding items: Enable auto-pay, configure payment reminders
- Advanced payment features

### Engaged
- Payment analytics
- Revenue tracking

## Data Dependencies
- Reads: Invoice data, customer data, payment processor config
- Writes: Payment records, processor settings

## Status
Shipped - Core billing feature integrated with invoicing.
