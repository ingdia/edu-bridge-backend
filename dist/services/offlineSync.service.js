"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offlineSyncService = void 0;
const database_1 = __importDefault(require("../config/database"));
exports.offlineSyncService = {
    async getModulesForOffline(studentId) {
        const student = await database_1.default.studentProfile.findUnique({
            where: { id: studentId },
            select: { gradeLevel: true }
        });
        if (!student) {
            throw new Error('Student not found');
        }
        return await database_1.default.learningModule.findMany({
            where: {
                isActive: true
            },
            orderBy: { orderIndex: 'asc' },
            select: {
                id: true,
                title: true,
                description: true,
                type: true,
                contentUrl: true,
                difficulty: true,
                estimatedDuration: true,
                orderIndex: true
            }
        });
    },
    async syncProgress(progressData) {
        const results = [];
        for (const data of progressData) {
            try {
                const existing = await database_1.default.progress.findUnique({
                    where: {
                        studentId_moduleId: {
                            studentId: data.studentId,
                            moduleId: data.moduleId
                        }
                    }
                });
                if (existing) {
                    const updated = await database_1.default.progress.update({
                        where: {
                            studentId_moduleId: {
                                studentId: data.studentId,
                                moduleId: data.moduleId
                            }
                        },
                        data: {
                            score: data.score,
                            feedback: data.feedback,
                            completedAt: data.completedAt,
                            timeSpent: data.timeSpent,
                            isSynced: true,
                            lastSyncedAt: new Date()
                        }
                    });
                    results.push({ success: true, progress: updated });
                }
                else {
                    const created = await database_1.default.progress.create({
                        data: {
                            studentId: data.studentId,
                            moduleId: data.moduleId,
                            score: data.score,
                            feedback: data.feedback,
                            completedAt: data.completedAt,
                            timeSpent: data.timeSpent,
                            isSynced: true,
                            lastSyncedAt: new Date()
                        }
                    });
                    results.push({ success: true, progress: created });
                }
            }
            catch (error) {
                results.push({ success: false, error: error.message, data });
            }
        }
        return results;
    },
    async syncSubmissions(submissions) {
        const results = [];
        for (const data of submissions) {
            try {
                const created = await database_1.default.exerciseSubmission.create({
                    data: {
                        studentId: data.studentId,
                        moduleId: data.moduleId,
                        exerciseType: data.exerciseType,
                        submissionContent: data.submissionContent,
                        submittedAt: data.submittedAt,
                        isSynced: true,
                        lastSyncedAt: new Date()
                    }
                });
                results.push({ success: true, submission: created });
            }
            catch (error) {
                results.push({ success: false, error: error.message, data });
            }
        }
        return results;
    },
    async getUnsyncedProgress(studentId) {
        return await database_1.default.progress.findMany({
            where: {
                studentId,
                isSynced: false
            },
            include: {
                module: {
                    select: {
                        title: true,
                        type: true
                    }
                }
            }
        });
    },
    async getUnsyncedSubmissions(studentId) {
        return await database_1.default.exerciseSubmission.findMany({
            where: {
                studentId,
                isSynced: false
            },
            include: {
                module: {
                    select: {
                        title: true,
                        type: true
                    }
                }
            }
        });
    },
    async markAsSynced(progressIds, submissionIds) {
        const progressUpdate = database_1.default.progress.updateMany({
            where: { id: { in: progressIds } },
            data: {
                isSynced: true,
                lastSyncedAt: new Date()
            }
        });
        const submissionUpdate = database_1.default.exerciseSubmission.updateMany({
            where: { id: { in: submissionIds } },
            data: {
                isSynced: true,
                lastSyncedAt: new Date()
            }
        });
        await database_1.default.$transaction([progressUpdate, submissionUpdate]);
        return { progressCount: progressIds.length, submissionCount: submissionIds.length };
    }
};
//# sourceMappingURL=offlineSync.service.js.map