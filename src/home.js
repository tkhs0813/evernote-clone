import React, { useState, useEffect, useContext } from 'react';

import SidebarComponent from './sidebar/sidebar';
import EditorComponent from './editor/editor';
import { AuthContext } from "./auth/AuthProvider";

const firebase = require('firebase');

const Home = () => {
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState(null);
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser)

  useEffect(() => {
    const abortController = new AbortController();
    firebase
      .firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('notes')
      .onSnapshot(serverupdate => {
        const notes = serverupdate.docs.map(_doc => {
          const data = _doc.data();
          data['id'] = _doc.id;
          return data;
        });
        console.log({ notes })
        setNotes(notes);
      });

    return function cleanup() {
      abortController.abort();
    }
  }, []);

  const selectNote = (note, index) => {
    setSelectedNoteIndex(index);
    setSelectedNote(note);
  }

  const noteUpdate = (id, noteObj) => {
    firebase
      .firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('notes')
      .doc(id)
      .update({
        title: noteObj.title,
        body: noteObj.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
  }

  const newNote = async (title) => {
    const note = {
      title: title,
      body: ''
    }
    const newFromDB = await firebase
      .firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('notes')
      .add({
        title: note.title,
        body: note.body,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
    const newID = newFromDB.id;
    await setNotes([...notes, note])
    const newNoteIndex = notes.indexOf(notes.filter(note => note.id === newID)[0])
    setSelectedNote(notes[newNoteIndex]);
    setSelectedNoteIndex(newNoteIndex);
  }

  const deleteNote = async (note) => {
    const noteIndex = notes.indexOf(note);
    await setNotes(notes.filter(n => n !== note))
    if (selectedNoteIndex === noteIndex) {
      setSelectedNoteIndex(null);
      setSelectedNote(null);
    } else {
      if (notes.length > 1) {
        selectNote(notes[selectedNoteIndex - 1], selectedNoteIndex - 1)
      } else {
        setSelectedNoteIndex(null);
        setSelectedNote(null);
      }
    }

    firebase
      .firestore()
      .collection('users')
      .doc(currentUser.uid)
      .collection('notes')
      .doc(note.id)
      .delete()
  }

  return (
    <div className="app-container">
      <SidebarComponent
        selectedNoteIndex={selectedNoteIndex}
        notes={notes}
        deleteNote={deleteNote}
        selectNote={selectNote}
        newNote={newNote}></SidebarComponent>
      {
        selectedNote ?
          <EditorComponent selectedNote={selectedNote}
            selectedNoteIndex={selectedNoteIndex}
            notes={notes}
            noteUpdate={noteUpdate}></EditorComponent>
          : null
      }
      <button onClick={() => firebase.auth().signOut()}>SignOut</button>
    </div >
  )
}

// class Home extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       selectedNoteIndex: null,
//       selectedNote: null,
//       notes: null
//     };
//   }
//   render() {
//     return (
//       <div className="app-container">
//         <SidebarComponent
//           selectedNoteIndex={this.state.selectedNoteIndex}
//           notes={this.state.notes}
//           deleteNote={this.deleteNote}
//           selectNote={this.selectNote}
//           newNote={this.newNote}></SidebarComponent>
//         {
//           this.state.selectedNote ?
//             <EditorComponent selectedNote={this.state.selectedNote}
//               selectedNoteIndex={this.state.selectedNoteIndex}
//               notes={this.state.notes}
//               noteUpdate={this.noteUpdate}></EditorComponent>
//             : null
//         }
//         <button onClick={() => firebase.auth().signOut()}>SignOut</button>
//       </div >
//     )
//   }

//   componentDidMount = () => {
//     firebase
//       .firestore()
//       .collection('notes')
//       .onSnapshot(serverupdate => {
//         const notes = serverupdate.docs.map(_doc => {
//           const data = _doc.data();
//           data['id'] = _doc.id;
//           return data;
//         });
//         console.log({ notes })
//         this.setState({ notes })
//       });
//   }

//   selectNote = (note, index) => {
//     this.setState({ selectedNoteIndex: index, selectedNote: note })
//   }

//   noteUpdate = (id, noteObj) => {
//     firebase
//       .firestore()
//       .collection('notes')
//       .doc(id)
//       .update({
//         title: noteObj.title,
//         body: noteObj.body,
//         timestamp: firebase.firestore.FieldValue.serverTimestamp()
//       });
//   }

//   newNote = async (title) => {
//     const note = {
//       title: title,
//       body: ''
//     }
//     const newFromDB = await firebase
//       .firestore()
//       .collection('notes')
//       .add({
//         title: note.title,
//         body: note.body,
//         timestamp: firebase.firestore.FieldValue.serverTimestamp()
//       })
//     const newID = newFromDB.id;
//     await this.setState({ notes: [...this.state.notes, note] })
//     const newNoteIndex = this.state.notes.indexOf(this.state.notes.filter(note => note.id === newID)[0])
//     this.setState({ selectedNote: this.state.notes[newNoteIndex], selectedNoteIndex: newNoteIndex })
//   }

//   deleteNote = async (note) => {
//     const noteIndex = this.state.notes.indexOf(note);
//     await this.setState({ notes: this.state.notes.filter(n => n !== note) })
//     if (this.state.selectedNoteIndex === noteIndex) {
//       this.setState({ selectedNoteIndex: null, selectedNote: null })
//     } else {
//       this.state.notes.length > 1 ?
//         this.selectNote(this.state.notes[this.state.selectedNoteIndex - 1], this.state.selectedNoteIndex - 1) :
//         this.setState({ selectedNoteIndex: null, selectedNote: null })
//     }

//     firebase
//       .firestore()
//       .collection('notes')
//       .doc(note.id)
//       .delete()
//   }
// }

export default Home;
