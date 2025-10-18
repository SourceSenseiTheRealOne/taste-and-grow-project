import { z } from 'zod';

export const registrationSchema = z.object({
  schoolName: z.string().min(2, 'School name must be at least 2 characters').max(100),
  cityRegion: z.string().min(2, 'City/Region must be at least 2 characters').max(100),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters').max(100),
  contactRole: z.enum(['teacher', 'principal', 'coordinator', 'other'], {
    required_error: 'Please select a role',
  }),
  contactEmail: z.string().email('Please enter a valid email address').max(255),
  studentCount: z.union([z.number().int().positive(), z.literal('')]).optional(),
  preferredLanguage: z.enum(['en', 'pt', 'fr'], {
    required_error: 'Please select a language',
  }),
});

export const activationSchema = z.object({
  experienceId: z.string().uuid('Invalid experience selected'),
  eventDate: z.date({
    required_error: 'Please select an event date',
  }).refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Event date must be in the future',
  }),
  fundraiserAmount: z.number().min(0, 'Fundraiser amount must be positive').max(100, 'Fundraiser amount cannot exceed €100'),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type ActivationFormData = z.infer<typeof activationSchema>;
