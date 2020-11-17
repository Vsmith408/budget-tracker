const FILES_TO_CACHE = []

const CACHE = 'v1'
const RUNTIME = 'runtime'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(self.skipWaiting())
  )
})
