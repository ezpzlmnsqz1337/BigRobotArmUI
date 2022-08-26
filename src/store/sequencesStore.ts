import sequences from '@/assets/sequences'

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

export const sequencesStore: SequencesStore = {
  sequences: [],
  editedSequence: null,
  initSequences() {
    const seqs = localStorage.getItem('sequences')
    this.sequences = seqs ? JSON.parse(seqs) : sequences
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
    localStorage.setItem('sequences', JSON.stringify(this.sequences))
  },
  addSequence(sequence: Sequence) {
    if (!sequence) return
    this.sequences.push(sequence)
    this.saveSequencesToLocalStorage()
  },
  removeSequence(sequenceId: number) {
    if (sequenceId < 0 || sequenceId > this.sequences.length - 1) return
    this.sequences.splice(sequenceId, 1)
    this.saveSequencesToLocalStorage()
  }
}
