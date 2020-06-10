import React, {useEffect, useState} from 'react';
import './App.css';
const url = 'http://34.226.241.143';

function App() {
  const [passVal, setPassVal] = useState('');
  const [postState, setPostState] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [postId, setPostId] = useState(0);
  const [maxPost, setMaxPost] = useState(0);
  const [postSelection, setPostSelection] = useState(0);
  return (
    <div className="App">
      <div>
        <p>{postId === 0 || postId === '0' ? 'new post' : 'editing post ' +postId}</p>
      </div>
      <div>
        <EditSelector setMaxPost={setMaxPost} maxPost={maxPost} postSelection={postSelection} setPostSelection={setPostSelection} />
        <button onClick={()=>{getPost(postSelection,{setText, setTitle, setPostId})}}>edit post</button>
      </div>
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

function EditSelector(props){
  const {setMaxPost, maxPost, postSelection, setPostSelection} = props;
  useEffect(
    ()=>{
      if(maxPost === 0 || maxPost === '0'){
        fetch(`${url}/api/posts/0`)
          .then(res=>res.json())
          .then(data=>{
            setMaxPost(data[0].id)
          })
      }
    }
  )
  const selections = []
  for(let i = 1; i <= maxPost; i++){
    selections.push(<option value={i} key={'option' + i}>{i}</option>)
  }
  selections.push(<option value={0} key='new' >new</option>)
  return(<select defaultValue={0} onChange={(e)=>{setPostSelection(e.target.value)}}>
    {selections}
    </select>)
}

function submitPost(data, postStatus){
  postStatus.set(true);
  const destination = `${url}/api/posts/${data.id ||''}`;
  console.log('submitting to', destination)
  fetch(destination, {
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

function getPost(postId, page={setText:null, setTitle:null, setPostId:null}){
  if(postId === 0 || postId === '0'){
    page.setText('');
    page.setTitle('');
    return
  }
  console.log('fetching to', `${url}/api/posts/${postId}`)
  fetch(`${url}/api/posts/${postId}`)
    .then(response=>response.json())
    .then(data=>{
      console.log(data);
      if(data.length){
        const post = data[0];
        page.setText(post.body);
        page.setTitle(post.title||'');
        page.setPostId(post.id);
      }
    })
    .catch(err=>console.error('err fetching post', err))
}

export default App;
