import { mockDayNotes } from "./mock-data"
import type { DayNote } from "./types"

const DAY_NOTES_STORAGE_KEY = "travelshare_day_notes"

export function getAllDayNotes(): DayNote[] {
  if (typeof window === "undefined") return mockDayNotes

  try {
    const stored = localStorage.getItem(DAY_NOTES_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      return parsed.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }))
    }
  } catch (error) {
    console.error("Error loading day notes from localStorage:", error)
  }

  return mockDayNotes
}

export function getDayNotesByTripId(tripId: string): DayNote[] {
  const allNotes = getAllDayNotes()
  return allNotes.filter((note) => note.tripId === tripId)
}

export function saveDayNote(tripId: string, date: string, userId: string, content: string): DayNote {
  const allNotes = getAllDayNotes()
  const existingNote = allNotes.find((note) => note.tripId === tripId && note.date === date)

  if (existingNote) {
    // Update existing note
    existingNote.content = content
    existingNote.updatedAt = new Date()
    existingNote.userId = userId
  } else {
    // Create new note
    const newNote: DayNote = {
      id: `note_${Date.now()}`,
      tripId,
      date,
      userId,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    allNotes.push(newNote)
  }

  // Save to localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(DAY_NOTES_STORAGE_KEY, JSON.stringify(allNotes))
    } catch (error) {
      console.error("Error saving day notes to localStorage:", error)
    }
  }

  return existingNote || allNotes[allNotes.length - 1]
}

export function deleteDayNote(noteId: string): boolean {
  const allNotes = getAllDayNotes()
  const filteredNotes = allNotes.filter((note) => note.id !== noteId)

  if (filteredNotes.length === allNotes.length) {
    return false // Note not found
  }

  // Save to localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(DAY_NOTES_STORAGE_KEY, JSON.stringify(filteredNotes))
    } catch (error) {
      console.error("Error deleting day note from localStorage:", error)
      return false
    }
  }

  return true
}
