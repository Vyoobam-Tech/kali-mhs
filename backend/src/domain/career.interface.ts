/**
 * Job Status
 */
export enum JobStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CLOSED = 'CLOSED',
    ON_HOLD = 'ON_HOLD',
}

/**
 * Job Type
 */
export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP',
    TEMPORARY = 'TEMPORARY',
}

/**
 * Job Location Type
 */
export enum JobLocationType {
    ON_SITE = 'ON_SITE',
    REMOTE = 'REMOTE',
    HYBRID = 'HYBRID',
}

/**
 * Experience Level
 */
export enum ExperienceLevel {
    ENTRY_LEVEL = 'ENTRY_LEVEL',
    MID_LEVEL = 'MID_LEVEL',
    SENIOR_LEVEL = 'SENIOR_LEVEL',
    EXECUTIVE = 'EXECUTIVE',
}

/**
 * Application Status
 */
export enum ApplicationStatus {
    SUBMITTED = 'SUBMITTED',
    UNDER_REVIEW = 'UNDER_REVIEW',
    SHORTLISTED = 'SHORTLISTED',
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
    INTERVIEWED = 'INTERVIEWED',
    OFFERED = 'OFFERED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
}

/**
 * Job Posting Interface
 */
export interface IJob {
    id: string;
    title: string;
    slug: string;
    department: string;
    location: string;
    locationType: JobLocationType;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    status: JobStatus;

    // Job Description
    shortDescription?: string;
    responsibilities: string[];
    requirements: string[];
    qualifications: string[];
    preferredSkills?: string[];

    // Compensation
    salaryRange?: string;
    currency?: string;
    showSalary: boolean;
    benefits?: string[];

    // Application
    applicationDeadline?: Date;
    numberOfOpenings: number;
    applicationCount: number;

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];

    // Analytics
    viewCount: number;

    // Audit
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;
    publishedAt?: Date;
    closedAt?: Date;
    isDeleted: boolean;
}

/**
 * Job Application Interface
 */
export interface IJobApplication {
    id: string;
    jobId: string;
    jobTitle: string; // Denormalized for easy access
    status: ApplicationStatus;

    // Applicant Information
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location?: string;
    currentCompany?: string;
    currentDesignation?: string;

    // Experience Details
    totalExperience: number; // in years
    relevantExperience?: number;
    currentSalary?: string;
    expectedSalary?: string;
    noticePeriod?: string;

    // Documents
    resumeUrl: string;
    coverLetterUrl?: string;
    portfolioUrl?: string;
    otherDocuments?: string[];

    // Additional Info
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    referralSource?: string;

    // Screening Questions (optional)
    screeningAnswers?: { question: string; answer: string }[];

    // Interview
    interviewScheduledFor?: Date;
    interviewNotes?: string;

    // Assignment
    assignedTo?: string; // User ID (HR/Recruiter)
    assignedAt?: Date;

    // Internal Notes
    notes?: string;

    // Timeline
    appliedAt: Date;
    reviewedAt?: Date;
    interviewedAt?: Date;
    offeredAt?: Date;
    respondedAt?: Date;

    // Audit
    createdAt: Date;
    updatedAt: Date;
    updatedBy?: string;
}

/**
 * Job Creation DTO
 */
export interface ICreateJob {
    title: string;
    department: string;
    location: string;
    locationType: JobLocationType;
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    responsibilities: string[];
    requirements: string[];
    qualifications: string[];
    numberOfOpenings: number;
    createdBy: string;
}

/**
 * Job Update DTO
 */
export interface IUpdateJob {
    title?: string;
    department?: string;
    status?: JobStatus;
    responsibilities?: string[];
    requirements?: string[];
    numberOfOpenings?: number;
    updatedBy: string;
}

/**
 * Job Application Creation DTO
 */
export interface ICreateJobApplication {
    jobId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    totalExperience: number;
    resumeUrl: string;
    coverLetterUrl?: string;
}

/**
 * Job Application Update DTO
 */
export interface IUpdateJobApplication {
    status?: ApplicationStatus;
    assignedTo?: string;
    interviewScheduledFor?: Date;
    notes?: string;
    updatedBy: string;
}
