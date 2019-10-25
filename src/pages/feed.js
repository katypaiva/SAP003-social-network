import Button from '../components/button.js';
import Textarea from '../components/textarea.js';

function Feed(props) {
  loadPost()
  const template = `
    <header class='header-feed'><img class='logo-feed' src='img/Logo.png'/></header>    
    <div class='send-post'>
    ${Textarea({
    class: 'post-textarea',
    placeholder: 'O que tem de novidade?'
  })} 
    ${Button({
    class: 'send-btn',
    onclick: formPost,
    title: `<img class='img-sendBtn' src='../img/send-btn.png'/>`
  })}
    </div>
    <div id="posts"></div>
    ${Button({
    class: 'btn-logout',
    onclick: logOut,
    title: 'SAIR'
  })}
    `
  return template;
}

//essa percorre os posts do template e carrega eles
function loadPost() {
  const loading = document.querySelector('.loading');
  loading.innerHTML = ""
  const user = firebase.auth().currentUser;
  const collectionPost = firebase.firestore().collection('posts')
  collectionPost.orderBy('time', 'desc').get().then(snap => {
    snap.forEach(post => {
      if (post.data().user == user.uid) {
        addingPost(post)
      }
    })
  })
}

// essa função cria o objeto do post no banco de dados e cria o card
function formPost() {
  const id = firebase.auth().currentUser.uid;
  const text = document.querySelector('.post-textarea').value;
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
          <section class='card-post' data-id='${res.id}'>
          <div class='card-texts'>
          <p class='post-text' data-id='${res.id}'>${post.text}</p>
          <p class='likes'>${post.likes}</p>
          <p class='date-time'>${post.time}</p>
        <div class='post-buttons'>
          ${Button.component({
        dataId: res.id,
        class: 'btn-delete',
        onclick: deletePost,
        title: 'EXCLUIR'
      })}
      
          ${Button.component({
        dataId: res.id,
        class: 'btn-edit',
        onclick: editPost,
        title: 'EDITAR'
      })}


          ${Button.component({
        dataId: res.id,
        class: 'btn-save',
        onclick: saveEditPost,
        title: 'SALVAR'
      })}
        </div>
        </div>
        </section>
        `
    })
}

// esta busca os posts do banco de dados e adiciona no template
function addingPost(post) {
  const listPost = document.querySelector('#posts');
  const templatePost = `
      <section class='card-post' data-id='${post.id}'>
      <div class='card-texts'>
      <p class='post-text' data-id='${post.id}'>${post.data().text}</p>
      <p class='likes'><img class='like-logo' src='../img/like-btn-disable.png'/>${post.data().likes}</p>
      <p class='date-time'>${post.data().time}</p>
      <div class='post-buttons'>
      ${Button({
    dataId: post.id,
    class: 'btn-delete',
    onclick: deletePost,
    title: 'EXCLUIR'
  })}
      ${Button({
    dataId: post.id,
    class: 'btn-edit',
    onclick: editPost,
    title: 'EDITAR'
  })}
      ${Button({
    dataId: post.id,
    class: 'btn-save',
    onclick: saveEditPost,
    title: 'SALVAR'
  })}
      </div>
      </div>
      </section>
      `
  listPost.innerHTML += templatePost
}

// função de deletar 
function deletePost(event) {
  const id = event.target.dataset.id;
  firebase.firestore().collection('posts').doc(id).delete();
    document.querySelector(`.card-post[data-id='${id}']`).remove();
};
// função de editar
function editPost(event) {
  const id = event.target.dataset.id;
  const textPost = document.querySelector(`.post-text[data-id='${id}']`);
  textPost.setAttribute('contentEditable', 'true');
  textPost.onblur = () => {
  }

};
// função de salvar a edição 
function saveEditPost(event) {
  const id = event.target.dataset.id;
  const saveText = document.querySelector(`.post-text[data-id='${id}']`);
  const newText = saveText.textContent;
  firebase.firestore().collection('posts').doc(id).update({
    text: newText,
  });
  saveText.setAttribute('contentEditable', 'false');
}

window.deletePost = deletePost;
window.editPost = editPost;
window.saveEditPost = saveEditPost;

//Função de logout
function logOut() {
  firebase.auth().signOut();
}

export default Feed;



