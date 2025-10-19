"use client"

// Offline storage utilities for PWA functionality
export class OfflineStorage {
  private static readonly STORAGE_KEY = "travel-share-offline"
  private static readonly SYNC_QUEUE_KEY = "travel-share-sync-queue"

  // Store data for offline access
  static store(key: string, data: any): void {
    try {
      const storage = this.getStorage()
      storage[key] = {
        data,
        timestamp: Date.now(),
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage))
    } catch (error) {
      console.error("[OfflineStorage] Failed to store data:", error)
    }
  }

  // Retrieve stored data
  static retrieve(key: string): any | null {
    try {
      const storage = this.getStorage()
      const item = storage[key]
      return item ? item.data : null
    } catch (error) {
      console.error("[OfflineStorage] Failed to retrieve data:", error)
      return null
    }
  }

  // Add action to sync queue for when online
  static queueForSync(action: {
    type: "comment" | "reaction" | "location" | "activity"
    method: "POST" | "PUT" | "DELETE"
    url: string
    data?: any
    timestamp: number
  }): void {
    try {
      const queue = this.getSyncQueue()
      queue.push({
        ...action,
        id: `${action.type}-${Date.now()}-${Math.random()}`,
      })
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue))
    } catch (error) {
      console.error("[OfflineStorage] Failed to queue sync action:", error)
    }
  }

  // Get pending sync actions
  static getSyncQueue(): any[] {
    try {
      const queue = localStorage.getItem(this.SYNC_QUEUE_KEY)
      return queue ? JSON.parse(queue) : []
    } catch (error) {
      console.error("[OfflineStorage] Failed to get sync queue:", error)
      return []
    }
  }

  // Remove synced action from queue
  static removeSyncedAction(actionId: string): void {
    try {
      const queue = this.getSyncQueue()
      const filteredQueue = queue.filter((action: any) => action.id !== actionId)
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(filteredQueue))
    } catch (error) {
      console.error("[OfflineStorage] Failed to remove synced action:", error)
    }
  }

  // Clear all offline data
  static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      localStorage.removeItem(this.SYNC_QUEUE_KEY)
    } catch (error) {
      console.error("[OfflineStorage] Failed to clear storage:", error)
    }
  }

  // Check if data is stale (older than 1 hour)
  static isStale(key: string, maxAge = 3600000): boolean {
    try {
      const storage = this.getStorage()
      const item = storage[key]
      if (!item) return true
      return Date.now() - item.timestamp > maxAge
    } catch (error) {
      console.error("[OfflineStorage] Failed to check staleness:", error)
      return true
    }
  }

  private static getStorage(): any {
    try {
      const storage = localStorage.getItem(this.STORAGE_KEY)
      return storage ? JSON.parse(storage) : {}
    } catch (error) {
      console.error("[OfflineStorage] Failed to get storage:", error)
      return {}
    }
  }
}

// Background sync utilities
export class BackgroundSync {
  // Register background sync
  static async register(tag: string): Promise<void> {
    if ("serviceWorker" in navigator && "sync" in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register(tag)
        console.log(`[BackgroundSync] Registered sync: ${tag}`)
      } catch (error) {
        console.error(`[BackgroundSync] Failed to register sync: ${tag}`, error)
      }
    }
  }

  // Sync offline comments
  static async syncComments(): Promise<void> {
    const queue = OfflineStorage.getSyncQueue()
    const commentActions = queue.filter((action: any) => action.type === "comment")

    for (const action of commentActions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: action.data ? JSON.stringify(action.data) : undefined,
        })

        if (response.ok) {
          OfflineStorage.removeSyncedAction(action.id)
          console.log("[BackgroundSync] Synced comment:", action.id)
        }
      } catch (error) {
        console.error("[BackgroundSync] Failed to sync comment:", error)
      }
    }
  }

  // Sync offline reactions
  static async syncReactions(): Promise<void> {
    const queue = OfflineStorage.getSyncQueue()
    const reactionActions = queue.filter((action: any) => action.type === "reaction")

    for (const action of reactionActions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: action.data ? JSON.stringify(action.data) : undefined,
        })

        if (response.ok) {
          OfflineStorage.removeSyncedAction(action.id)
          console.log("[BackgroundSync] Synced reaction:", action.id)
        }
      } catch (error) {
        console.error("[BackgroundSync] Failed to sync reaction:", error)
      }
    }
  }

  // Sync location updates
  static async syncLocationUpdates(): Promise<void> {
    const queue = OfflineStorage.getSyncQueue()
    const locationActions = queue.filter((action: any) => action.type === "location")

    for (const action of locationActions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: action.data ? JSON.stringify(action.data) : undefined,
        })

        if (response.ok) {
          OfflineStorage.removeSyncedAction(action.id)
          console.log("[BackgroundSync] Synced location update:", action.id)
        }
      } catch (error) {
        console.error("[BackgroundSync] Failed to sync location update:", error)
      }
    }
  }
}
