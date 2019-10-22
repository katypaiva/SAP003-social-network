import Button from '../components/button.js';
import Textarea from '../components/textarea.js';

function Feed(props) {
  loadPost()
  const template = `
    <img class="logo" src="img/Logo.png"/>
    <form id ="formPost">
    ${Textarea({ class: 'Text1', placeholder: '' })}
    ${window.Button.component({
    class: 'mytext',
    onclick: formPost,
    title: 'ENVIAR'
  })}
    </form>
    <div id="posts"></div>
    ${window.Button.component({
    class: 'btn-logout',
    onclick: logOut,
    title: 'SAIR'
  })}
    `
  return template;
}

//essa percorre os posts do template e carrega eles
function loadPost() {
  const user = firebase.auth().currentUser;
  const collectionPost = firebase.firestore().collection('posts')
  collectionPost.where('user', '==', user.uid).get().then(snap => {
    snap.forEach(post => {
      addingPost(post)
    })
  })
}

// essa função cria o objeto do post no banco de dados e adiciona o post atual no template
function formPost() {

  const id = firebase.auth().currentUser.uid
  const text = document.querySelector('.Text1').value;
  const post = {
    user: id,
    likes: 0,
    comments: [],
    text: text,
    time: new Date().toLocaleString('pt-BR'),
  }
  firebase.firestore().collection('posts').add(post)
    .then(res => {
      document.querySelector('#posts').innerHTML += `
      <section class='card-post'>
      <div class='card-texts'>
      <p class='post-text'>${post.text}</p>
      <p class='likes'>${post.likes}</>
      <p class='date-time'>${post.time}</p>
      </div>
      </section>
      `
    })

    
}
// esta busca os posts do banco de dados e posta todos na página
function addingPost(post) {
  const listPost = document.querySelector('#posts');
  const templatePost = `
  <section class='card-post'>
  <div class='card-texts'>
  <p class='post-text'>${post.data().text}</p>

  <p class='likes'><img class="like-logo" src="img/like-btn-able"/>${post.data().likes}
  <p class='date-time'>${post.data().time}</p>

  ${window.Button.component({
    class: 'btn-comment',
    onclick: commentPost,
    title: 'COMENTAR'
  })}
  <div id='card-post'></div>
  </div>
  </section>
  `
  listPost.innerHTML += templatePost
}

//Função que abre campo de comentário
function commentPost() {
  const commentInput = document.querySelector('#card-post');
  const templateComment = `
    <section class='card-comment'>
    <textarea></textarea>
    ${window.Button.component({
    class: 'btn-save-comment',
    onclick: teste,
    title: 'SALVAR'
  })}

  ${window.Button.component({
    class: 'btn-cancel-comment',
    onclick: cancelComment,
    title: 'CANCELAR'
  })}
    </section>
    `
  commentInput.innerHTML = templateComment;

  //Criar função que pega o valor e mandar pro banco/printa
  function teste() {
    console.log('aff');

  }
  //Função que cancela o comentário
  function cancelComment() {
    document.querySelector('#card-post').innerHTML = '';
    }
};

//Função de logout
function logOut() {
  firebase.auth().signOut();
}

export default Feed;
