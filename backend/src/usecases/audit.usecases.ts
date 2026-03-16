import { AuditLogModel, IAuditLogDocument } from '@infrastructure/database/models/Audit.model';
import { ICreateAuditLog, IAuditLog, AuditAction, AuditLevel } from '@domain/audit.interface';
import { AppError } from '@middlewares/errorHandler';

export class AuditUseCases {
    static async createAuditLog(logData: ICreateAuditLog): Promise<IAuditLog> {
        const auditLog = new AuditLogModel(logData);
        await auditLog.save();
        return auditLog.toJSON() as IAuditLog;
    }

    static async getAuditLogs(
        page: number = 1,
        limit: number = 50,
        action?: AuditAction,
        level?: AuditLevel,
        userId?: string,
        startDate?: Date,
        endDate?: Date
    ) {
        const skip = (page - 1) * limit;
        const filter: any = {};
        if (action) filter.action = action;
        if (level) filter.level = level;
        if (userId) filter['actor.userId'] = userId;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = startDate;
            if (endDate) filter.createdAt.$lte = endDate;
        }

        const [logs, total] = await Promise.all([
            AuditLogModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('actor.userId', 'firstName lastName email'),
            AuditLogModel.countDocuments(filter),
        ]);

        return {
            logs: logs.map((l) => l.toJSON() as IAuditLog),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }

    static async getAuditLogById(logId: string): Promise<IAuditLog> {
        const log = await AuditLogModel.findById(logId).populate('actor.userId', 'firstName lastName email');
        if (!log) throw new AppError(404, 'Audit log not found');
        return log.toJSON() as IAuditLog;
    }

    static async getHighRiskActivities(limit: number = 20): Promise<IAuditLog[]> {
        const logs = await AuditLogModel.find({ riskScore: { $gte: 70 } })
            .sort({ riskScore: -1, createdAt: -1 })
            .limit(limit)
            .populate('actor.userId', 'firstName lastName email');

        return logs.map((l) => l.toJSON() as IAuditLog);
    }

    static async getAuditStats() {
        const stats = await AuditLogModel.aggregate([
            {
                $group: {
                    _id: '$action',
                    count: { $sum: 1 },
                    avgRisk: { $avg: '$riskScore' },
                },
            },
        ]);

        const levelStats = await AuditLogModel.aggregate([
            {
                $group: {
                    _id: '$level',
                    count: { $sum: 1 },
                },
            },
        ]);

        return { byAction: stats, byLevel: levelStats };
    }
}
