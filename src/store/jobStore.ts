export interface JobStatus {
  jobId: string
  name: string
  status: string
  currentIndex: number
  total: number
  lastResponse?: string | null
  error?: string | null
  cancelRequested?: boolean
  createdAt?: number | null
  startedAt?: number | null
  finishedAt?: number | null
}

export interface JobStore {
  activeJob: JobStatus | null
  queuedJobs: JobStatus[]
  lastError: string | null
  applyJobStatus(job: JobStatus | null): void
  setQueueStatus(jobs: JobStatus[]): void
  setError(message: string | null): void
  clear(): void
}

export const jobStore: JobStore = {
  activeJob: null,
  queuedJobs: [],
  lastError: null,
  applyJobStatus(job: JobStatus | null) {
    if (!job) {
      this.activeJob = null
      this.queuedJobs = []
      return
    }

    this.lastError = job.error ?? this.lastError
    const queueIndex = this.queuedJobs.findIndex(x => x.jobId === job.jobId)

    if (job.status === 'queued') {
      if (this.activeJob && this.activeJob.jobId !== job.jobId) {
        if (queueIndex >= 0) {
          this.queuedJobs.splice(queueIndex, 1, job)
        } else {
          this.queuedJobs.push(job)
        }
      } else {
        this.activeJob = job
      }
      return
    }

    if (job.status === 'running') {
      if (queueIndex >= 0) {
        this.queuedJobs.splice(queueIndex, 1)
      }
      this.activeJob = job
      return
    }

    if (queueIndex >= 0) {
      this.queuedJobs.splice(queueIndex, 1)
    }

    this.activeJob = job
  },
  setQueueStatus(jobs: JobStatus[]) {
    if (!jobs.length) {
      this.activeJob = null
      this.queuedJobs = []
      return
    }

    const [activeJob, ...queuedJobs] = jobs
    this.activeJob = activeJob
    this.queuedJobs = queuedJobs
  },
  setError(message: string | null) {
    this.lastError = message
  },
  clear() {
    this.activeJob = null
    this.queuedJobs = []
    this.lastError = null
  }
}
