const urlBase = 'https://jsonplaceholder.typicode.com/posts' //esta es la URL para interactuar
let posts = [] //aca se inician los posteos como un array vacio

function getData(){
    fetch(urlBase)
    .then(res => res.json())
    .then(data => {
        posts = data
        renderPostList()
        //metodo para mostrar el posteo por pantalla
    })
    .catch(error => console.error('Error al llamar a la API', error))
}

function renderPostList(){
    const postList = document.getElementById('postList');
    postList.innerHTML = '';

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem'); //le damos nombre a la clase para poder aplicarle estilo css mas adelante
        listItem.innerHTML = `
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Borrar</button>

        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <label for="editTitle">Título: </label>
            <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            <label for="editBody"> Comentario: </label>
            <textarea id="editBody-${post.id}" required>${post.body}</textarea>
            <button onclick="updatePost(${post.id})"> Actualizar </button>
        </div>
        `

        postList.appendChild(listItem)     
    })
}

function postData(){
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = document.getElementById('postTitle').value;
    const postBody = document.getElementById('postBody').value;

    if(postTitle.trim() == '' || postBody.trim() == '' ){
        alert('Los campos son obligatorios')
        return
    }

    fetch(urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(res => res.json())
        .then(data => {
            posts.push(data)
            renderPostList();
            postTitleInput.value = ''
            postBodyInput.value = ''
        })
    .catch(error => console.error('Error al querer crear un posteo', error))
}

function editPost(id){
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
}

function updatePost(id){
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
    .then(res => res.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === data.id)
        if(index != -1){
            posts[index] = data
        }else{
            alert('Hubo un error al actualizr la informacion del posteo')
        }
        renderPostList()
    })
    .catch(error => console.error('Error al querer actualizar un posteo', error))
}