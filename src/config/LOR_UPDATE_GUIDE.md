# LoR Template System - Update Guide

## How to Update LOR for a New Year

You **do NOT need to modify any component code**. Simply update `lorTemplates.ts` with the new year's template.

### Steps:

1. Open `/src/config/lorTemplates.ts`

2. Add a new entry to the `lorTemplates` object:

```typescript
export const lorTemplates: Record<number, LORTemplate> = {
  2027: {
    year: 2027,
    date: 'May 5, 2027',  // Update the date
    headerText: 'Letter of Recommendation',
    paragraphs: [
      'First paragraph with {{name}}, {{rollNo}}, {{branch}} placeholders...',
      'Second paragraph...',
    ],
    signature: {
      signatureName: 'Dr. John Doe',  // Optional
      position: 'Director',
      organization: 'School of Technology',
      address: 'Pandit Deendayal Energy University, Gandhinagar, Gujarat, India',
    },
  },
  // ... previous years remain unchanged
};
```

### Available Placeholders:

- `{{name}}` - Student's full name
- `{{rollNo}}` - Student's roll number (optional)
- `{{branch}}` - Student's branch/department

### Key Points:

- The system **automatically uses the current year's template** based on `new Date().getFullYear()`
- If no template exists for the current year, it falls back to the most recent template available
- Keep previous years' templates in the file for reference
- Roll numbers are now included if available in student profile data

### Example Changes from 2025 to 2026:

```typescript
// 2025: Mentioned "B.Tech/B.Sc." and "NGO"
// 2026: Mentions only "B.Tech" and "Organization"
// 2026: Includes roll number in placeholders: {{name}} ({{rollNo}})
// 2026: Different signature format with formal title
```

That's it! No code changes needed ever again. Just update the config file.
