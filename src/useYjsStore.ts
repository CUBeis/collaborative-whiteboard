import { useEffect, useState } from 'react'
import {
  createTLStore,
  defaultShapeUtils,
} from 'tldraw'
import type {
  TLAnyShapeUtilConstructor,
  TLRecord,
  TLStoreWithStatus
} from 'tldraw'
import { YKeyValue } from 'y-utility/y-keyvalue'
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

  useEffect(() => {
    const store = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
    })

    const doc = new Y.Doc()
    const provider = new WebrtcProvider(roomId, doc)
    const yArr = doc.getArray<{ key: string; val: TLRecord }>(`tl_${roomId}`)
    const yStore = new YKeyValue(yArr)

    // 1. Sync tldraw -> Yjs
    const unlisten = store.listen(
      (entry) => {
        if (entry.source !== 'user') return

        doc.transact(() => {
          Object.entries(entry.changes.added).forEach(([id, record]) => {
            yStore.set(id, record)
          })
          Object.entries(entry.changes.updated).forEach(([_, [, to]]) => {
            yStore.set(to.id, to)
          })
          Object.entries(entry.changes.removed).forEach(([id, _]) => {
            yStore.delete(id)
          })
        })
      },
      { scope: 'document', source: 'user' }
    )

    // 2. Sync Yjs -> tldraw
    yStore.on('change', (changes: Map<string, { action: string; newValue: any }>) => {
      store.mergeRemoteChanges(() => {
        changes.forEach((change, id) => {
          if (change.action === 'delete') {
            store.remove([id as any])
          } else {
            store.put([change.newValue as any])
          }
        })
      })
    })

    setStoreWithStatus({
      status: 'synced-remote',
      connectionStatus: 'online',
      store,
    })

    return () => {
      unlisten()
      provider.disconnect()
      doc.destroy()
    }
  }, [roomId, shapeUtils])

  return storeWithStatus
}
