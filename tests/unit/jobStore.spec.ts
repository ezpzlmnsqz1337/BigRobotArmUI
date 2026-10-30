import { JobStatus, jobStore } from '@/store/jobStore'

describe('JobStore', () => {
  const createJob = (overrides: Partial<JobStatus> = {}): JobStatus => ({
    jobId: 'job-1',
    name: 'Demo',
    status: 'running',
    currentIndex: 1,
    total: 3,
    ...overrides
  })

  beforeEach(() => {
    jobStore.clear()
  })

  it('should expose the error of a failed job', () => {
    jobStore.applyJobStatus(createJob({ status: 'failed', error: 'boom' }))

    expect(jobStore.lastError).toBe('boom')
  })

  it('should clear a stale error when a later job update has no error', () => {
    jobStore.applyJobStatus(createJob({ status: 'failed', error: 'boom' }))
    jobStore.applyJobStatus(createJob({ status: 'running' }))

    expect(jobStore.lastError).toBeNull()
  })

  it('should promote a running job to active and drop it from the queue', () => {
    jobStore.applyJobStatus(createJob({ status: 'queued', jobId: 'job-2' }))
    jobStore.applyJobStatus(createJob({ status: 'running', jobId: 'job-2' }))

    expect(jobStore.activeJob?.jobId).toBe('job-2')
    expect(jobStore.queuedJobs).toHaveLength(0)
  })

  it('should reset all state when cleared', () => {
    jobStore.applyJobStatus(createJob({ status: 'failed', error: 'boom' }))
    jobStore.clear()

    expect(jobStore.activeJob).toBeNull()
    expect(jobStore.queuedJobs).toHaveLength(0)
    expect(jobStore.lastError).toBeNull()
  })
})
