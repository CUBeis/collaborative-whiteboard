import { useEffect, useMemo, useState } from 'react'
import {
  createTLStore,
  defaultShapeUtils,
} from 'tldraw'
import type {
  TLAnyShapeUtilConstructor,
  TLRecord,
  TLStoreWithStatus
} from 'tldraw'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

const DEFAULT_SHAPE_UTILS: TLAnyShapeUtilConstructor[] = []

export function useYjsStore({
  roomId,
  shapeUtils = DEFAULT_SHAPE_UTILS,
}: {
  roomId: string
  shapeUtils?: TLAnyShapeUtilConstructor[]
}) {
  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: 'loading',
  })

  // Ensure store and ydoc are only created once per room
  const { store, ydoc, provider } = useMemo(() => {
    const store = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
    })

    const ydoc = new Y.Doc()
    const provider = new WebrtcProvider(roomId, ydoc)

    return { store, ydoc, provider }
  }, [roomId, shapeUtils])

  useEffect(() => {
    const ymap = ydoc.getMap<TLRecord>('tldraw')

    // 1. Sync Yjs -> tldraw
    // When remote changes arrive via WebRTC, update our local Tldraw store
    const handleChange = (event: Y.YMapEvent<TLRecord>) => {
      const toRemove: TLRecord['id'][] = []
      const toPut: TLRecord[] = []

      event.changes.keys.forEach((change, key) => {
        switch (change.action) {
          case 'add':
          case 'update':
            {
              const record = ymap.get(key)
              if (record) {
                toPut.push(record)
              }
            }
            break
          case 'delete':
            toRemove.push(key as TLRecord['id'])
            break
        }
      })

      if (toRemove.length || toPut.length) {
        store.mergeRemoteChanges(() => {
          if (toRemove.length) store.remove(toRemove)
          if (toPut.length) store.put(toPut)
        })
      }
    }

    ymap.observe(handleChange)

    // 2. Sync tldraw -> Yjs
    // When the user draws locally, send those changes to the Yjs document
    let isInitialSync = true
    
    const unlisten = store.listen(
      (history) => {
        if (history.source !== 'user') return

        ydoc.transact(() => {
          Object.values(history.changes.added).forEach((record) => {
            ymap.set(record.id, record)
          })
          Object.values(history.changes.updated).forEach(([_, record]) => {
            ymap.set(record.id, record)
          })
          Object.values(history.changes.removed).forEach((record) => {
            ymap.delete(record.id)
          })
        })
      },
      { scope: 'document', source: 'user' }
    )

    // Push initial document state to Yjs if we are the first one in the room
    if (isInitialSync) {
      ydoc.transact(() => {
        for (const record of store.allRecords()) {
          if (!ymap.has(record.id)) {
            ymap.set(record.id, record)
          }
        }
      })
      isInitialSync = false
    }

    setStoreWithStatus({
      status: 'synced-remote',
      connectionStatus: 'online',
      store,
    })

    return () => {
      ymap.unobserve(handleChange)
      unlisten()
      provider.disconnect()
      ydoc.destroy()
    }
  }, [store, ydoc, provider])

  return storeWithStatus
}
