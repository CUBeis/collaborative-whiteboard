import { useEffect, useMemo, useState } from 'react'
import { createTLStore, defaultShapeUtils } from 'tldraw'
import type { TLAnyShapeUtilConstructor, TLRecord, TLStoreWithStatus } from 'tldraw'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
 
export function useYjsStore({
  roomId,
  shapeUtils = [] as TLAnyShapeUtilConstructor[],
}: {
  roomId: string
  shapeUtils?: TLAnyShapeUtilConstructor[]
}) {
  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({ status: 'loading' })

  const store = useMemo(() => createTLStore({
    shapeUtils: [...defaultShapeUtils, ...shapeUtils],
  }), [roomId])

  useEffect(() => {
    const ydoc = new Y.Doc()
    const provider = new WebrtcProvider(roomId, ydoc)
    const ymap = ydoc.getMap<TLRecord>('tldraw')

    const handleChange = (event: Y.YMapEvent<TLRecord>) => {
      const toRemove: TLRecord['id'][] = []
      const toPut: TLRecord[] = []
      event.changes.keys.forEach((change, key) => {
        if (change.action === 'add' || change.action === 'update') {
          const record = ymap.get(key)
          if (record) toPut.push(record)
        } else if (change.action === 'delete') {
          toRemove.push(key as TLRecord['id'])
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

    // Push initial local state into Yjs
    ydoc.transact(() => {
      for (const record of store.allRecords()) {
        if (!ymap.has(record.id)) ymap.set(record.id, record)
      }
    })

    const unlisten = store.listen(
      ({ changes, source }) => {
        if (source !== 'user') return
        ydoc.transact(() => {
          Object.values(changes.added).forEach((r) => ymap.set(r.id, r))
          Object.values(changes.updated).forEach(([, r]) => ymap.set(r.id, r))
          Object.values(changes.removed).forEach((r) => ymap.delete(r.id))
        })
      },
      { scope: 'document', source: 'user' }
    )

    setStoreWithStatus({ status: 'synced-remote', connectionStatus: 'online', store })

    return () => {
      ymap.unobserve(handleChange)
      unlisten()
      provider.disconnect()
      ydoc.destroy()
    }
  }, [store, roomId])

  return storeWithStatus
}