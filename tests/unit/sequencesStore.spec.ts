import sequences from '@/assets/sequences'
import {
  EditedSequence,
  Sequence,
  sequencesStore,
  SEQUENCES_LOCAL_STORAGE_KEY
} from '@/store/sequencesStore'

describe('SequencesStore', () => {
  const dummySequence: Sequence = { name: 'dummy-name', data: ['dummy-data'] }

  beforeEach(() => {
    localStorage.setItem(SEQUENCES_LOCAL_STORAGE_KEY, JSON.stringify(sequences))
    sequencesStore.sequences.splice(0)
  })

  it('should initialize sequences from local storage', () => {
    sequencesStore.initSequences()

    expect(getStoredSequences()).toHaveLength(sequences.length)
  })

  it('should initialize sequences from assets when no local storage items exist', () => {
    localStorage.removeItem(SEQUENCES_LOCAL_STORAGE_KEY)
    sequencesStore.initSequences()

    expect(sequencesStore.sequences).toHaveLength(sequences.length)
  })

  it('should start and stop editing of sequence', () => {
    sequencesStore.sequences = [dummySequence]
    const editedSequence = getSequenceToEdit(0)
    sequencesStore.startEditSequence(editedSequence)

    expect(sequencesStore.editedSequence).toBe(editedSequence)

    sequencesStore.stopEditSequence()
    expect(sequencesStore.editedSequence).toBeNull()
  })

  it('should save edited sequence', () => {
    sequencesStore.sequences = [dummySequence]
    const sequenceId = 0
    const editedSequence = getSequenceToEdit(sequenceId)

    sequencesStore.startEditSequence(editedSequence)
    editedSequence.name = 'changed-name'
    editedSequence.data = 'changed-data'

    sequencesStore.saveEditedSequence(sequenceId)

    const savedSequence = sequencesStore.sequences[sequenceId]
    expect(savedSequence.name).toBe(editedSequence.name)
    expect(savedSequence.data.join('\n')).toBe(editedSequence.data)

    const localStorageSavedSequence = getStoredSequences()[sequenceId]
    expect(localStorageSavedSequence.name).toBe(editedSequence.name)
    expect(localStorageSavedSequence.data.join('\n')).toBe(editedSequence.data)
  })

  it('should return undefined if error during saveEditSequence', () => {
    sequencesStore.sequences = [dummySequence]

    let result = sequencesStore.saveEditedSequence(0)
    expect(result).toBeUndefined() // no edited sequence available

    const sequenceId = 0
    const editedSequence = getSequenceToEdit(sequenceId)

    sequencesStore.startEditSequence(editedSequence)

    result = sequencesStore.saveEditedSequence(sequencesStore.sequences.length)
    expect(result).toBeUndefined() // wrong sequence id
  })

  it('should save sequences to local storage', () => {
    sequencesStore.sequences = [dummySequence]
    sequencesStore.saveSequencesToLocalStorage()

    const storedSequences = getStoredSequences()
    expect(storedSequences).toHaveLength(1)
    expect(storedSequences[0].name).toBe(dummySequence.name)
    expect(storedSequences[0].data).toStrictEqual(dummySequence.data)
  })

  it('should add sequence', () => {
    sequencesStore.addSequence(dummySequence)

    expect(sequencesStore.sequences).toHaveLength(1)
    expect(sequencesStore.sequences[0]).toBe(dummySequence)
  })

  it('should remove sequence', () => {
    sequencesStore.sequences = [dummySequence]
    sequencesStore.removeSequence(0)

    expect(sequencesStore.sequences).toHaveLength(0)
  })

  it('should return undefined when passing wrong id to remove sequence', () => {
    sequencesStore.sequences = [dummySequence]
    let result = sequencesStore.removeSequence(-1)
    expect(result).toBeUndefined()

    result = sequencesStore.removeSequence(sequencesStore.sequences.length)
    expect(result).toBeUndefined()
  })

  function getSequenceToEdit(index: number): EditedSequence {
    const sequenceToEdit = sequencesStore.sequences[index]
    return {
      name: sequenceToEdit.name,
      data: sequenceToEdit.data.join('\n')
    }
  }

  function getStoredSequences(): Sequence[] {
    return JSON.parse(localStorage.getItem(SEQUENCES_LOCAL_STORAGE_KEY)!)
  }
})
