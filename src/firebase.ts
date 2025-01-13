import { initializeApp } from 'firebase/app'
import { collection, documentId, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth'
import { CollectionNames } from './helpers/enums'

export const firebaseConfig = {
  apiKey: 'AIzaSyAHFEqDv0ViceSFE1LNOGuoKKaFrvIfmt8',
  authDomain: 'pizzeria-6b20e.firebaseapp.com',
  projectId: 'pizzeria-6b20e',
  storageBucket: 'pizzeria-6b20e.appspot.com',
  messagingSenderId: '1043463210729',
  appId: '1:1043463210729:web:1859950de14aa728bd1278',
  measurementId: 'G-SSTHVKC4RR',
}

export const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)

export const db = getFirestore(firebaseApp)

export const pizzasRef = collection(db, CollectionNames.pizzas)

export const paninosRef = collection(db, CollectionNames.paninos)

export const calzonesRef = collection(db, CollectionNames.calzones)

export const saucesRef = collection(db, CollectionNames.sauces)

export const ingredientsRef = collection(db, CollectionNames.ingredients)

export const usersRef = collection(db, 'Users')

export const usersCartRef = collection(db, 'UsersCart')

export function getCurrentUser(): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe()
        resolve(user)
      },
      reject,
    )
  })
}

export const isAdmin = async () => {
  const user = await getCurrentUser()
  if (!user) return false
  try {
    const queryById = query(usersRef, where(documentId(), '==', user.uid))
    const querySnapshot = await getDocs(queryById)
    const roles = querySnapshot.docs.map((doc) => doc.data().roles)[0]
    return roles.includes('admin')
  } catch (error) {
    console.error('Error getting user roles:', error)
    return false
  }
}
