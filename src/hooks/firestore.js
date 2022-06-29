import { useState, useEffect } from 'react';
import db from '../lib/firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc, getDoc} from "firebase/firestore";

const STORAGE_KEY = 'itss-todo';

function useFirestore() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchAllDocs() {
        const q = collection(db, "Todo");
        const querySnapshot = await getDocs(q);
        const arr = []
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            arr.push({...doc.data(), "key": doc.id});
        });
        setItems(arr);
    }
    fetchAllDocs();

    }, []);
    

  const putItems = items => {
    async function putDoc(item){
        const dataref = doc(db, "Todo", item.key);
        const docSnapshot = await getDoc(dataref);
        if (docSnapshot.exists()){
            await updateDoc(dataref, {
                text: item.text,
                done: item.done
            });
        }
        else{
            await setDoc(dataref, {
                text: item.text,
                done: item.done
            }

            )
        }
    }

    items.map(item => {
      putDoc(item);
    });
    
    setItems  (items);
  };

  const clearItems = () => {
    async function deleteDocument(item) {
      await deleteDoc(doc(db, "Todo", item.key));
    }

    items.map(item => {
        deleteDocument(item);
    });

    setItems([]);
    
  };

  return [items, putItems, clearItems];
}

export default useFirestore;