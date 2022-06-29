import React, { useState, useEffect } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import { uiConfig } from '../lib/firebase';
import 'firebase/compat/auth';

/* コンポーネント */
import TodoItem from './TodoItem';
import Input from './Input';
import Filter from './Filter';

/* カスタムフック */
// import useStorage from '../hooks/storage';
import useFirestore from '../hooks/firestore';

/* ライブラリ */
import { getKey } from "../lib/util";

function Todo() {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const [items, putItems, clearItems] = useFirestore();

  const [filter, setFilter] = React.useState('ALL');

  const displayItems = items.filter(item => {
    if (filter === 'ALL') return true;
    if (filter === 'TODO') return !item.done;
    if (filter === 'DONE') return item.done;
  });

  const handleCheck = checked => {
    const newItems = items.map(item => {
      if (item.key === checked.key) {
        item.done = !item.done;
      }
      return item;
    });
    putItems(newItems);
  };

  const handleAdd = text => {
    putItems([...items, { key: getKey(), text, done: false }]);
  };

  const handleFilterChange = value => setFilter(value);
  if (!isSignedIn) {
    return (
      <div>
        <h1>My App</h1>
        <p>Please sign-in:</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }

  return (
    <div>
      <h1>My App</h1>
      <p>Welcome {firebase.auth().currentUser.displayName}! You are now signed-in!</p>
      <a onClick={() => firebase.auth().signOut()}>Sign-out</a>
      <article class="panel is-danger">
        <div className="panel-heading">
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-calendar-check"></i>
            </span>
            <span> ITSS Todoアプリ</span>
          </span>
        </div>
        <Input onAdd={handleAdd} />
        <Filter
          onChange={handleFilterChange}
          value={filter}
        />
        {displayItems.map(item => (
          <TodoItem
            key={item.key}
            item={item}
            onCheck={handleCheck}
          />
        ))}
        <div className="panel-block">
          {displayItems.length} items
        </div>
        <div className="panel-block">
          <button className="button is-light is-fullwidth" onClick={clearItems}>
            全てのToDoを削除
          </button>
        </div>
      </article>
    </div>
  );

}

export default Todo;