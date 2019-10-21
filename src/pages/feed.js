import Button from '../components/button.js';
import Textarea from '../components/textarea.js';


function Feed(props) {
  loadPost()
    const template =`
      <form id ="formPost">
      ${Textarea({ class: 'Text1', placeholder: ''})}
      ${Button({ class: 'mytext', onclick:formPost, title: 'ENVIAR' })}
      ${Button({ class: 'btn-logout', onclick:logOut, title: 'SAIR' })}
      </form>
      <ul id="posts"></ul>
      `
      return template;
    }
  
    //essa percorre os posts do template e carrega eles
    function loadPost () {
      const loading = document.querySelector('.loading');
      loading.innerHTML=""
      const user = firebase.auth().currentUser;
     const collectionPost = firebase.firestore().collection('posts')
      collectionPost.where('user', '==', user.uid).get().then(snap => {snap.forEach(post => {
      addingPost(post)
  
      }) 
    }) 
    }
    
  // essa função cria o objeto do post no banco de dados e cria o card
  function formPost(){
    const id = firebase.auth().currentUser.uid;
    const text = document.querySelector('.Text1').value;
    const post = {
      user: id,
      likes : 0,
      comments:[],
      text: text,
      time: new Date().toLocaleString('pt-BR'),
    }
    firebase.firestore().collection('posts').add(post)
      .then(res => {
        document.querySelector('#posts').innerHTML += `
        <section class='card-post'>
        <p class='post-text'>${post.text}</p>
        <p class='likes'>${post.likes}</>
        <p class='date-time'>${post.time}</p> 
        </section>
        `
      })
  }
    
  // esta busca os posts do banco de dados e adiciona no template
  function addingPost(post){
    const listPost = document.querySelector('#posts');
    const templatePost = `
    <section class='card-post'>
    <div class='card-texts'>
    <p class='post-text'>${post.data().text}</p>
    <p class='likes'>${post.data().likes}
    <p class='date-time'>${post.data().time}</p>
    ${Button({ dataId: post.id, class: 'btn-delete', onclick:deletePost, title: 'EXCLUIR' })}
    </div>
    </section>
    `
    listPost.innerHTML += templatePost
  }
  
  //Função de logout
  function logOut () {
    firebase.auth().signOut();
  }

  // função de deletar 
  function deletePost (event){
    const id = event.target.dataset.id;
    firebase.firestore().collection('posts').doc(id).delete();
    event.target.parentElement.remove();
  };
    
  

  export default Feed;