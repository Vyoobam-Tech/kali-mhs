import mongoose, { Schema, Document, Model } from 'mongoose';
import {
    IJob,
    IJobApplication,
    JobStatus,
    JobType,
    JobLocationType,
    ExperienceLevel,
    ApplicationStatus,
} from '@domain/career.interface';

// Job Document
export interface IJobDocument extends Omit<IJob, 'id'>, Document { }

// Job Application Document
export interface IJobApplicationDocument extends Omit<IJobApplication, 'id'>, Document { }

// Job Model interface
export interface IJobModel extends Model<IJobDocument> {
    findBySlug(slug: string): Promise<IJobDocument | null>;
    findActive(): Promise<IJobDocument[]>;
}

// Job Application Model interface
export interface IJobApplicationModel extends Model<IJobApplicationDocument> {
    findByJob(jobId: string): Promise<IJobApplicationDocument[]>;
    findByApplicant(email: string): Promise<IJobApplicationDocument[]>;
}

/**
 * Job Schema
 */
const jobSchema = new Schema<IJobDocument, IJobModel>(
    {
        title: {
            type: String,
            required: [true, 'Job title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
            index: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        department: {
            type: String,
            required: [true, 'Department is required'],
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(JobStatus),
            default: JobStatus.DRAFT,
            required: true,
            index: true,
        },
        jobType: {
            type: String,
            enum: Object.values(JobType),
            required: [true, 'Job type is required'],
            index: true,
        },
        locationType: {
            type: String,
            enum: Object.values(JobLocationType),
            required: [true, 'Location type is required'],
        },
        location: {
            city: String,
            state: String,
            country: String,
        },
        experienceLevel: {
            type: String,
            enum: Object.values(ExperienceLevel),
            required: [true, 'Experience level is required'],
        },
        // Job Details
        description: String,
        responsibilities: [String],
        requirements: [String],
        niceToHave: [String],
        benefits: [String],
        // Compensation
        salaryRange: {
            min: Number,
            max: Number,
            currency: { type: String, default: 'INR' },
        },
        showSalary: {
            type: Boolean,
            default: false,
        },
        // Application
        applicationDeadline: Date,
        openings: {
            type: Number,
            default: 1,
            min: 1,
        },
        screeningQuestions: [
            {
                question: { type: String, required: true },
                isRequired: { type: Boolean, default: false },
            },
        ],
        // Assignment
        hiringManager: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        recruiter: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        // SEO
        tags: [String],
        metaTitle: String,
        metaDescription: String,
        // Analytics
        viewCount: {
            type: Number,
            default: 0,
        },
        applicationCount: {
            type: Number,
            default: 0,
        },
        // Audit
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        publishedAt: Date,
        publishedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        closedAt: Date,
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (_doc: any, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                if (ret.isDeleted) delete ret.isDeleted;
                return ret;
            },
        },
    }
);

// Indexes
jobSchema.index({ title: 'text', description: 'text' });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ department: 1, status: 1 });
jobSchema.index({ isDeleted: 1 });

// Pre-save hook to generate slug
jobSchema.pre('save', function (next) {
    if (!this.slug && this.title) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Static methods
jobSchema.statics.findBySlug = function (this: IJobModel, slug: string) {
    return this.findOne({ slug, isDeleted: false });
};

jobSchema.statics.findActive = function (this: IJobModel) {
    return this.find({
        status: JobStatus.ACTIVE,
        isDeleted: false,
    }).sort({ createdAt: -1 });
};

/**
 * Job Application Schema
 */
const jobApplicationSchema = new Schema<IJobApplicationDocument, IJobApplicationModel>(
    {
        job: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: Object.values(ApplicationStatus),
            default: ApplicationStatus.SUBMITTED,
            required: true,
            index: true,
        },
        // Applicant Details
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            index: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
        },
        currentLocation: String,
        linkedinUrl: String,
        portfolioUrl: String,
        // Documents
        resumeUrl: {
            type: String,
            required: [true, 'Resume is required'],
        },
        coverLetterUrl: String,
        // Experience
        currentCompany: String,
        currentDesignation: String,
        totalExperience: Number,
        noticePeriod: String,
        currentSalary: Number,
        expectedSalary: Number,
        // Screening Answers
        screeningAnswers: [
            {
                question: String,
                answer: String,
            },
        ],
        // Interview
        interviewSchedule: {
            date: Date,
            time: String,
            location: String,
            meetingUrl: String,
            notes: String,
        },
        // Assignment
        assignedTo: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        // Notes & Feedback
        internalNotes: String,
        feedback: String,
        // Timeline
        submittedAt: {
            type: Date,
            default: Date.now,
        },
        reviewedAt: Date,
        interviewedAt: Date,
        // Candidate Scoring (admin enriched)
        candidateScore: {
            overall: { type: Number, min: 0, max: 100 },
            experience: { type: Number, min: 0, max: 100 },
            skills: { type: Number, min: 0, max: 100 },
            culture: { type: Number, min: 0, max: 100 },
            education: { type: Number, min: 0, max: 100 },
            autoCalculated: { type: Boolean, default: false },
            scoredAt: Date,
            scoredBy: { type: Schema.Types.ObjectId, ref: 'User' },
        },
        // Internal notes (array, timestamped)
        adminNotes: [
            {
                note: { type: String, required: true },
                addedBy: { type: Schema.Types.ObjectId, ref: 'User' },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        // Audit
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (_doc: any, ret: any) {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Indexes
jobApplicationSchema.index({ job: 1, status: 1 });
jobApplicationSchema.index({ email: 1 });
jobApplicationSchema.index({ assignedTo: 1, status: 1 });
jobApplicationSchema.index({ submittedAt: -1 });

// Static methods
jobApplicationSchema.statics.findByJob = function (this: IJobApplicationModel, jobId: string) {
    return this.find({ job: jobId }).sort({ submittedAt: -1 });
};

jobApplicationSchema.statics.findByApplicant = function (this: IJobApplicationModel, email: string) {
    return this.find({ email }).sort({ submittedAt: -1 });
};

// Export models
export const JobModel = mongoose.model<IJobDocument, IJobModel>('Job', jobSchema);
export const JobApplicationModel = mongoose.model<IJobApplicationDocument, IJobApplicationModel>(
    'JobApplication',
    jobApplicationSchema
);
