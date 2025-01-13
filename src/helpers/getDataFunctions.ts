import { db } from '@/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import type { CollectionNamesType, MenuItemType } from './types'

export const getProducts = async (collectionName: CollectionNamesType) => {
  const collectionRef = collection(db, collectionName)
  const queryByName = query(collectionRef, orderBy('name'))
  const querySnapshot = await getDocs(queryByName)
  const response = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as MenuItemType[]

  return response
}
