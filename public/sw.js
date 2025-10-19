const CACHE_NAME = "travel-share-v1"
const STATIC_CACHE = "travel-share-static-v1"
const DYNAMIC_CACHE = "travel-share-dynamic-v1"

// Assets to cache on install
const STATIC_ASSETS = ["/", "/dashboard", "/login", "/register", "/manifest.json", "/offline.html"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker")
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        console.log("[SW] Static assets cached")
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker")
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("[SW] Service worker activated")
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip external requests
  if (url.origin !== location.origin) {
    return
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone()
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Fallback to cache for API requests
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            // Return offline response for failed API requests
            return new Response(JSON.stringify({ error: "Offline", message: "No network connection" }), {
              status: 503,
              statusText: "Service Unavailable",
              headers: { "Content-Type": "application/json" },
            })
          })
        }),
    )
    return
  }

  // Handle page requests with cache-first strategy
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Serve from cache
        return cachedResponse
      }

      // Fetch from network and cache
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })

          return response
        })
        .catch(() => {
          // Fallback to offline page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/offline.html")
          }
          return new Response("Offline", { status: 503 })
        })
    }),
  )
})

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("[SW] Background sync:", event.tag)

  if (event.tag === "location-update") {
    event.waitUntil(syncLocationUpdates())
  }

  if (event.tag === "comment-sync") {
    event.waitUntil(syncComments())
  }

  if (event.tag === "reaction-sync") {
    event.waitUntil(syncReactions())
  }
})

// Sync functions for offline data
async function syncLocationUpdates() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const requests = await cache.keys()
    const locationRequests = requests.filter((req) => req.url.includes("/api/location"))

    for (const request of locationRequests) {
      try {
        await fetch(request)
        await cache.delete(request)
        console.log("[SW] Synced location update")
      } catch (error) {
        console.log("[SW] Failed to sync location update:", error)
      }
    }
  } catch (error) {
    console.log("[SW] Background sync failed:", error)
  }
}

async function syncComments() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const requests = await cache.keys()
    const commentRequests = requests.filter((req) => req.url.includes("/api/comments"))

    for (const request of commentRequests) {
      try {
        await fetch(request)
        await cache.delete(request)
        console.log("[SW] Synced comment")
      } catch (error) {
        console.log("[SW] Failed to sync comment:", error)
      }
    }
  } catch (error) {
    console.log("[SW] Comment sync failed:", error)
  }
}

async function syncReactions() {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const requests = await cache.keys()
    const reactionRequests = requests.filter((req) => req.url.includes("/api/reactions"))

    for (const request of reactionRequests) {
      try {
        await fetch(request)
        await cache.delete(request)
        console.log("[SW] Synced reaction")
      } catch (error) {
        console.log("[SW] Failed to sync reaction:", error)
      }
    }
  } catch (error) {
    console.log("[SW] Reaction sync failed:", error)
  }
}

// Push notifications
self.addEventListener("push", (event) => {
  console.log("[SW] Push received:", event)

  const options = {
    body: "New activity in your trip!",
    icon: "/placeholder.svg?height=192&width=192",
    badge: "/placeholder.svg?height=96&width=96",
    vibrate: [200, 100, 200],
    data: {
      url: "/dashboard",
    },
    actions: [
      {
        action: "view",
        title: "View Trip",
        icon: "/placeholder.svg?height=48&width=48",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/placeholder.svg?height=48&width=48",
      },
    ],
  }

  if (event.data) {
    const data = event.data.json()
    options.body = data.body || options.body
    options.data.url = data.url || options.data.url
  }

  event.waitUntil(self.registration.showNotification("Travel Share", options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  console.log("[SW] Notification clicked:", event)

  event.notification.close()

  if (event.action === "view") {
    event.waitUntil(clients.openWindow(event.notification.data.url))
  }
})
