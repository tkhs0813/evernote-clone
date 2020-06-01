import React, { useEffect, useState } from "react";
import { app } from "firebase";
const firebase = require('firebase');

export const AuthContext = React.createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)

  const login = async (email, password, history) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      history.push('/')
    } catch (error) {
      alert(error)
    }
  }

  const signup = async (email, password, history) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      history.push('/')
    } catch (error) {
      alert(error)
    }
  }

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setCurrentUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        login,
        signup,
        currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}