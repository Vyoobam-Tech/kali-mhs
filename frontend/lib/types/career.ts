export enum JobStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    CLOSED = 'CLOSED',
    ON_HOLD = 'ON_HOLD',
}

export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP',
    FREELANCE = 'FREELANCE',
}

export enum JobLocationType {
    ONSITE = 'ONSITE',
    REMOTE = 'REMOTE',
    HYBRID = 'HYBRID',
}

export enum ExperienceLevel {
    INTERN = 'INTERN',
    ENTRY = 'ENTRY',
    MID = 'MID',
    SENIOR = 'SENIOR',
    LEAD = 'LEAD',
    EXECUTIVE = 'EXECUTIVE',
}

export enum ApplicationStatus {
    SUBMITTED = 'SUBMITTED',
    SCREENING = 'SCREENING',
    UNDER_REVIEW = 'UNDER_REVIEW',
    SHORTLISTED = 'SHORTLISTED',
    INTERVIEW = 'INTERVIEW',
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
    INTERVIEWED = 'INTERVIEWED',
    OFFER = 'OFFER',
    OFFERED = 'OFFERED',
    ACCEPTED = 'ACCEPTED',
    HIRED = 'HIRED',
    REJECTED = 'REJECTED',
    WITHDRAWN = 'WITHDRAWN',
}

export interface Job {
    id: string;
    title: string;
    slug: string;
    department: string;
    status: JobStatus;

    jobType: JobType;
    locationType: JobLocationType;
    location?: {
        city?: string;
        state?: string;
        country?: string;
    };
    experienceLevel: ExperienceLevel;

    description?: string;
    responsibilities?: string[];
    requirements?: string[];
    niceToHave?: string[];
    benefits?: string[];

    salaryRange?: {
        min: number;
        max: number;
        currency: string;
    };
    showSalary: boolean;

    applicationDeadline?: string;
    openings: number;

    applicationCount: number;
    viewCount: number;

    createdAt: string;
    updatedAt: string;
}

export interface CandidateScore {
    overall?: number;
    experience?: number;
    skills?: number;
    culture?: number;
    education?: number;
    autoCalculated?: boolean;
    scoredAt?: string;
}

export interface AdminNote {
    note: string;
    addedBy?: string;
    addedAt: string;
}

export interface JobApplication {
    id: string;
    jobId: string;
    job?: Pick<Job, 'id' | 'title' | 'department'>;
    status: ApplicationStatus;

    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    currentLocation?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;

    resumeUrl: string;
    coverLetterUrl?: string;

    currentCompany?: string;
    currentDesignation?: string;
    totalExperience?: number;
    noticePeriod?: string;
    currentSalary?: number;
    expectedSalary?: number;

    candidateScore?: CandidateScore;
    adminNotes?: AdminNote[];
    internalNotes?: string;

    submittedAt: string;
    reviewedAt?: string;
    interviewedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface JobFilters {
    department?: string;
    type?: JobType;
    status?: JobStatus;
    search?: string;
    page?: number;
    limit?: number;
}
