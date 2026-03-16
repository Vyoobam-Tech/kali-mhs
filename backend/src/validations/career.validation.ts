import { z } from 'zod';
import { JobStatus, JobType, JobLocationType, ExperienceLevel, ApplicationStatus } from '@domain/career.interface';

// Create Job Schema
export const createJobSchema = z.object({
    body: z.object({
        title: z.string().min(1).max(200),
        department: z.string().min(1),
        jobType: z.nativeEnum(JobType),
        locationType: z.nativeEnum(JobLocationType),
        experienceLevel: z.nativeEnum(ExperienceLevel),
        description: z.string().optional(),
        responsibilities: z.array(z.string()).optional(),
        requirements: z.array(z.string()).optional(),
    }),
});

// Update Job Schema
export const updateJobSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        title: z.string().optional(),
        status: z.nativeEnum(JobStatus).optional(),
    }),
});

// Get Job Schemas
export const getJobByIdSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
});

export const getJobBySlugSchema = z.object({
    params: z.object({ slug: z.string().min(1) }),
});

export const getJobsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
        status: z.nativeEnum(JobStatus).optional(),
        jobType: z.nativeEnum(JobType).optional(),
        department: z.string().optional(),
        search: z.string().optional(),
    }),
});

// Submit Application Schema
// NOTE: resumeUrl and coverLetterUrl are NOT validated here —
// they are server-side values set from the uploaded file (req.file.filename),
// not client-supplied fields. Validating them as URLs would always fail
// because multer provides a local filename, not a URL.
export const submitApplicationSchema = z.object({
    body: z.object({
        job: z.string().min(1, 'Job ID is required'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Valid email is required'),
        phone: z.string().min(7, 'Phone number is required'),
        currentCompany: z.string().optional(),
        currentDesignation: z.string().optional(),
        totalExperience: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
        noticePeriod: z.string().optional(),
        currentSalary: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
        expectedSalary: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
        currentLocation: z.string().optional(),
        linkedinUrl: z.string().url().optional().or(z.literal('')),
        portfolioUrl: z.string().url().optional().or(z.literal('')),
        coverLetter: z.string().optional(),
        // resumeUrl is set server-side from req.file — not validated from body
    }),
});

// Update Application Schema
export const updateApplicationStatusSchema = z.object({
    params: z.object({ id: z.string().min(1) }),
    body: z.object({
        status: z.nativeEnum(ApplicationStatus),
    }),
});

export const getApplicationsQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 20)),
        jobId: z.string().optional(),
        status: z.nativeEnum(ApplicationStatus).optional(),
    }),
});
