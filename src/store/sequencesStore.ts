import sequences from '@/assets/sequences'

export const SEQUENCES_LOCAL_STORAGE_KEY = 'sequences'

export interface Sequence {
  name: string
  data: string[]
}

export interface EditedSequence {
  name: string
  data: string
}

export interface SequencesStore {
  sequences: Sequence[]
  editedSequence: EditedSequence | null
  initSequences(): void
  startEditSequence(sequence: EditedSequence): void
  stopEditSequence(): void
  saveEditedSequence(sequenceId: number): void
  saveSequencesToLocalStorage(): void
  addSequence(sequence: Sequence): void
  removeSequence(sequenceId: number): void
}

function copySequences(source: Sequence[]): Sequence[] {
  return source.map(sequence => ({
    name: sequence.name,
    data: [...sequence.data]
  }))
}

function isSequence(value: unknown): value is Sequence {
  if (!value || typeof value !== 'object') return false

  const sequence = value as Partial<Sequence>
  return (
    typeof sequence.name === 'string' &&
    Array.isArray(sequence.data) &&
    sequence.data.every(item => typeof item === 'string')
  )
}

function parseStoredSequences(stored: string): Sequence[] | undefined {
  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || !parsed.every(isSequence)) return

  return parsed
}

export const sequencesStore: SequencesStore = {
  sequences: [],
  editedSequence: null,
  initSequences() {
    const stored = localStorage.getItem(SEQUENCES_LOCAL_STORAGE_KEY)

    if (!stored) {
      this.sequences = copySequences(sequences)
      return
    }

    try {
      const storedSequences = parseStoredSequences(stored)
      if (storedSequences) {
        this.sequences = storedSequences
        return
      }
    } catch {
      // Corrupted local storage should not prevent the app from booting; fall
      // back to the bundled default sequences below.
    }

    this.sequences = copySequences(sequences)
  },
  startEditSequence(sequence: EditedSequence) {
    this.editedSequence = sequence
  },
  stopEditSequence() {
    this.editedSequence = null
  },
  saveEditedSequence(sequenceId: number) {
    if (sequenceId < 0 || sequenceId > this.sequences.length - 1) return

    const editedSequence = this.editedSequence
    if (!editedSequence) return

    const sequence = this.sequences[sequenceId]
    sequence.name = editedSequence.name
    sequence.data.splice(0)
    sequence.data.push(...editedSequence.data.split('\n'))

    this.stopEditSequence()
    this.saveSequencesToLocalStorage()
  },
  saveSequencesToLocalStorage() {
    localStorage.setItem(
      SEQUENCES_LOCAL_STORAGE_KEY,
      JSON.stringify(this.sequences)
    )
  },
  addSequence(sequence: Sequence) {
    this.sequences.push(sequence)
    this.saveSequencesToLocalStorage()
  },
  removeSequence(sequenceId: number) {
    if (sequenceId < 0 || sequenceId > this.sequences.length - 1) return
    this.sequences.splice(sequenceId, 1)
    this.saveSequencesToLocalStorage()
  }
}
