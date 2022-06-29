import React, { useState, useEffect } from 'react'

/* ライブラリ */
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import db from '../lib/firebase';
import { async } from '@firebase/util';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";




function UploadProfile({ user }) {
  const [isModal, setIsModal] = useState(false);
  const active = isModal ? "is-active" : "";
  async function getProfile() {
    const dataref = doc(db, "users", user);
    return getDoc(dataref);
  }

  const [imageUrl, setImageUrl] = useState(null);

  const uploadImage = async (image) => {
    const storage = getStorage();
    // const imageRef = ref(storage, `/images/${image.name}`);
    const storageRef = ref(storage, `/images/${image.name}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
        if (progress == 100) {

        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      async () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
        });
      }
    );
  };

  const updateUser = async (user, imageUrl) => {
    if (imageUrl != null && imageUrl != '[object Promise]') {
      try {
        const dataref = doc(db, "users", user);
        const docSnapshot = await getDoc(dataref);
        if (!docSnapshot.exists()) {
          await setDoc(dataref, { name: user, imageUrl: imageUrl });
        }
        else {
          await updateDoc(dataref, { name: user, imageUrl: imageUrl });
        }
      } catch (err) {
          console.log(err);
      }
    }
    getProfile().then(docSnapshot=>{
      try{
        console.log(docSnapshot.data()['imageUrl']);
        setImageUrl(docSnapshot.data()['imageUrl']);
      }
      catch (err) {
        console.log(err);
      }
    })
  }

  const handleImage = async event => {
    const image = event.target.files[0];
    await uploadImage(image);
  };

  useEffect(() => {
    updateUser(user, imageUrl);
  }, [imageUrl]);

  const handleClick = () => {
    setIsModal(!isModal);
  };

  const ImageViewer = () => {
    if (!imageUrl) {
      return <i class="fas fa-user"></i>
    } else {
      return (
        <div>
          <img src={imageUrl} />
        </div>
      )
    }
  }

  return (
    <div className="App">
      <div className={`modal ${active}`}>
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="file is-boxed" >
            <label class="file-label">
              <input class="file-input" type="file" name="resume" onChange={handleImage} />
              <span class="file-cta">
                <span class="file-icon">
                  <i class="fas fa-upload"></i>
                </span>
                <span class="file-label">画像を選択してください</span>
              </span>
            </label>
          </div>
          <button class="modal-close is-large" aria-label="close" onClick={handleClick}></button>
        </div>
      </div>
      <button onClick={handleClick} class="button is-primary is-inverted">
        <span class="icon">
          <ImageViewer />
        </span>
      </button>
    </div >
  );
}

export default UploadProfile
