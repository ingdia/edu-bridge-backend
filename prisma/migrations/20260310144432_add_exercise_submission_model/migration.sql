-- CreateTable
CREATE TABLE "ExerciseSubmission" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "exerciseType" "ExerciseType" NOT NULL,
    "submissionContent" JSONB NOT NULL,
    "score" INTEGER,
    "feedback" TEXT,
    "rubricScores" JSONB,
    "isPassed" BOOLEAN,
    "evaluatedAt" TIMESTAMP(3),
    "evaluatedBy" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isSynced" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExerciseSubmission_studentId_submittedAt_idx" ON "ExerciseSubmission"("studentId", "submittedAt");

-- CreateIndex
CREATE INDEX "ExerciseSubmission_moduleId_exerciseType_idx" ON "ExerciseSubmission"("moduleId", "exerciseType");

-- CreateIndex
CREATE INDEX "ExerciseSubmission_status_evaluatedAt_idx" ON "ExerciseSubmission"("status", "evaluatedAt");

-- CreateIndex
CREATE INDEX "ExerciseSubmission_studentId_status_idx" ON "ExerciseSubmission"("studentId", "status");

-- AddForeignKey
ALTER TABLE "ExerciseSubmission" ADD CONSTRAINT "ExerciseSubmission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSubmission" ADD CONSTRAINT "ExerciseSubmission_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "LearningModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSubmission" ADD CONSTRAINT "ExerciseSubmission_evaluatedBy_fkey" FOREIGN KEY ("evaluatedBy") REFERENCES "MentorProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
