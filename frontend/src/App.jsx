import { useState } from 'react';
import './App.css';
import axios from "axios";
import Modal from "./components/modal/Modal";
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';

export default function App() {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [newItem, setNewItem] = useState("");
  const [tasks, setTasks] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  function alertCalendar(title) {
    if (!signedIn) {
      alert("Please sign in to add task to Google Calendar!");
    } else {
      setCurrentTitle(title);
      setButtonPopup(true);
    }  
  }

  function handleSubmit(e) {
    e.preventDefault();
    const inputForm = document.getElementById("task-input");
    if (!inputForm.value) {
      alert("Please enter a task");
    } else { 
    setTasks(currentTasks => {
      return [
        ...currentTasks,
        { id: crypto.randomUUID(), title: newItem, edit: "Edit", readOnly: true},
      ];
    });
    setNewItem("");
    }
  }

  function deleteTask(id) {
    setTasks(currentTasks => {
      return currentTasks.filter(task => task.id !== id);
    });
  }

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar');
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      await axios.post(import.meta.env.VITE_AUTH_URL, {token});
      setSignedIn(true);
    } catch (error) {
      console.log(error);
    }
  }

  function editTask(id) {
    setTasks(currentTasks => {
      return currentTasks.map(task => {
        if (task.id === id && task.edit === "Edit") {
          return {...task, edit: "Save", readOnly: false};
        } else if (task.id === id && task.edit === "Save") {
          return {...task, edit: "Edit", readOnly: true};
        }
        return task;
      })
    });
  }

  function changeTitle(e, id) {
    setTasks(currentTasks => {
      return currentTasks.map(task => {
        if (task.id === id) {
          return {...task, title: e};
        }
        return task;
      });
    });
  }

  const handleForm = (e) => {
    e.preventDefault();
    axios.post(import.meta.env.VITE_CALENDAR_URL, {currentTitle, startTime, endTime});
    alert("Task successfully added to Google Calendar!");
  }

  return (
    <>
      <header>
        <div>
          <button className="sign-in" onClick={() => login()} style={{color: '#000000'}}>
            <img className="google-logo" src="googlelogo.png"></img>
            Sign in to add tasks to Google Calendar
          </button>
        </div>
        <h1>Task List</h1>
        <div className="container">
          <form onSubmit={handleSubmit}>
            <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" id="task-input" placeholder="Enter your tasks here" />
            <input type="submit" className="add-task" value="Add Task"/>
          </form>
        </div>
        <h2>Tasks</h2>
      </header>
      {tasks.map(task => {
        return (
          <div className="task" key={task.id}>
            <button className="delete" onClick={() => deleteTask(task.id)}>X</button>
            <input className="task-text-input" value={task.title} readOnly={task.readOnly} onChange={e => changeTitle(e.target.value, task.id)}></input>
            <button className="calendar" onClick={() => alertCalendar(task.title)}>Calendar</button>
            <button className="edit" onClick={() => editTask(task.id)}>{task.edit}</button>
            <Modal trigger={buttonPopup} setTrigger={setButtonPopup} onClick={currentTitle}>
              <form onSubmit={handleForm}>
                <label htmlFor="start">Start time:</label>
                <input type="datetime-local" className="start" name="task-start" value={startTime} onChange={e =>setStartTime(e.target.value)}/>
                <br></br>
                <label htmlFor="end">End time:</label>
                <input type="datetime-local" className="end" name="task-end" value={endTime} onChange={e =>setEndTime(e.target.value)}/>
                <button type='submit' className="add-task-calendar">Add to Calendar</button>
              </form>
            </Modal>
          </div>
        );
      })}
    </>
  );
}