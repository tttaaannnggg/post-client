import React, {useEffect, useState} from 'react';
import './App.css';
const url = 'http://34.226.241.143';

function App() {
  const [passVal, setPassVal] = useState('');
  const [postState, setPostState] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  return (
    <div className="App">
      <div>
        <input type="password" placeholder='password' value={passVal} onChange={
          (e)=>{
            setPassVal(e.target.value)
          }
        }></input> 
        <button onClick={()=>{
          if(!text.length || postState){
            return;
          }
          const data = {body: text, pass:passVal, title:title, author: 'tang'}
          localStorage.setItem('lastPost', JSON.stringify(data));
          setText('');
          submitPost(data, {get:postState, set:setPostState})
        }}>
          submit post
        </button>
      </div>
      <div>
        <input placeholder='title' value={title}onChange={
          (e)=>{
            setTitle(e.target.value);
          }
        }></input>
      </div>
      <textarea rows="50" value={text} onChange={
        (e)=>{
          setText(e.target.value);
        }
      }/>
    </div>
  );
}

function submitPost(data, postStatus){
  postStatus.set(true);
  fetch(`${url}/api/posts`, {
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(res=>{
    console.log('sent!')
    setTimeout(()=>postStatus.set(false), 1000);
  })
} 

export default App;
