import { useEffect, useRef, useState } from 'react'
import { createTLStore, defaultShapeUtils } from 'tldraw'
import type { TLRecord, TLStore } from 'tldraw'
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'

export function useYjsStore({ roomId }: { roomId: string }): TLStore | null {
  // useState initializer ensures store is created exactly once
  const [store] = useState<TLStore>(() =>
    createTLStore({ shapeUtils: [...defaultShapeUtils] })
  )
  const [isReady, setIsReady] = useState(false)
  // Prevent double-setup in any React mode
  const setupDone = useRef(false)

  useEffect(() => {
    if (setupDone.current) return
    setupDone.current = true

    const ydoc = new Y.Doc()
    const provider = new WebrtcProvider(roomId, ydoc)
    const ymap = ydoc.getMap<TLRecord>('tldraw')

    // Yjs → tldraw
    const handleYjsChange = (event: Y.YMapEvent<TLRecord>) => {
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

    ymap.observe(handleYjsChange)

    // Push initial store state into Yjs
    ydoc.transact(() => {
      for (const record of store.allRecords()) {
        if (!ymap.has(record.id)) ymap.set(record.id, record)
      }
    })

    // tldraw → Yjs
    const unsub = store.listen(
      ({ changes }) => {
        ydoc.transact(() => {
          Object.values(changes.added).forEach((r) => ymap.set(r.id, r))
          Object.values(changes.updated).forEach(([, r]) => ymap.set(r.id, r))
          Object.values(changes.removed).forEach((r) => ymap.delete(r.id))
        })
      },
      { scope: 'document', source: 'user' }
    )

    setIsReady(true)

    return () => {
      ymap.unobserve(handleYjsChange)
      unsub()
      provider.disconnect()
      ydoc.destroy()
    }
  }, []) // empty deps — run once only

  return isReady ? store : null
}