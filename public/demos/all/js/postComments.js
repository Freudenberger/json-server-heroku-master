const postsEndpoint = '../../posts';
const usersEndpoint = '../../users';
const commentsEndpoint = '../../comments';


async function issueGetRequest(post_id)
{
    const postUrl = `${postsEndpoint}/${post_id}`
    const postsData = await Promise.all([postUrl].map((url) => fetch(url).then((r) => r.json())));
    const userUrl = `${usersEndpoint}/${postsData[0].user_id}`
    const usersData = await Promise.all([userUrl].map((url) => fetch(url).then((r) => r.json())));

    const comments = await Promise.all([commentsEndpoint].map((url) => fetch(url).then((r) => r.json())));

    const postData = postsData[0]
    const userData = usersData[0]
    const userComments = comments[0]

    if (userData.firstname === undefined) {
        postData.user_name = "Unknown user";
    } else {
        postData.user_name = `${userData.firstname} ${userData.lastname}`;
    }
    postData.comments = []
    for (let j = 0; j < userComments.length; j++) {
        if (userComments[j].post_id === postData.id) {
            postData.comments.push(userComments[j]);
        }
    }
    // sort comments by date:
    postData.comments.sort((a,b) => a.date < b.date);

    displayPostsData(postsData);
    attachEventHandlers();
};

const getImagesHTML = (images) => {
    let htmlData = "";
    if (images !== undefined && images.length > 0) {
        htmlData += `<div align="center" ><img src="${images[0].replace('256','512')}" style="width: 512px;"/></div>`;
//        for (image of images) {
//            htmlData += `<img src="${image}" />`;
//            htmlData += `<br>`
//        }
    }
    return htmlData
};

//            <i class="fas fa-trash delete" id="${item.id}"></i>
//        <label>id:</label><span>${item.id}</span><br>
const getItemHTML = (item) => {
    return `<div>
        <div class="controls">
            <i class="fas fa-edit edit" id="${item.id}"></i>
        </div>
        ${getImagesHTML(item.images)}<br>
        <label>title:</label><span>${item.title}</span><br>
        <label>user name:</label><span>${item.user_name}</span><br>
        <label>date:</label><span>${item.date}</span><br>
        <label></label><span>${item.body}</span><br>
    </div>`;
};
//        <hr><br>
//        <label>comments:</label><br>
//        ${getCommentsHTML(item.comments)}

const getCommentsHTML = (comments) => {
    let htmlData = "";
    if (comments.length == 0) {
    htmlData = `<div>
        <span>No Comments</span><br>
    </div>`;
    }
    else {
        for (item of comments) {
            htmlData += getCommentHTML(item);
            htmlData += `<hr><br>`
        }
    }
    return htmlData
};

const getCommentHTML = (comments) => {
    return `<div>
        <label>id:</label><span>${comments.id}</span><br>
        <label>date:</label><span>${comments.date}</span><br>
        <label>comment:</label><span>${comments.body}</span><br>
    </div>`;
};

const displayPostsData = (data) => {
    const container = document.querySelector("#container");
    container.innerHTML = "";
    for (item of data) {
        displayItem(item, container);
    }
    const containerComments = document.querySelector("#containerComments");
    containerComments.innerHTML = "";
    for (item of data) {
        displayComments(item, containerComments);
    }
};

const displayComments = (item, container) => {
    itemHTML = getCommentsHTML(item.comments);
    container.innerHTML += `<div align="center" ><div class="card-wrapper-wide" align="left">${itemHTML}</div></div><br>`;
};
const displayItem = (item, container) => {
    itemHTML = getItemHTML(item);
    container.innerHTML += `<div align="center" ><div class="card-wrapper-wide" align="left">${itemHTML}</div></div>`;
};

function getParams()
{
    var values = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) { values[key] = value;});
    return values;
}

const post_id = getParams()['id']
issueGetRequest(post_id);






const issuePutRequest = (id, data, responseHandler) => {
    // update data on the server:
    const url = postsEndpoint + '/' + id;
    console.log('PUT request:', url, data);
    fetch(url, {
            method: 'put',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseHandler);
};

const issueDeleteRequest = (id, responseHandler) => {
    // delete data on the server:
    const url = postsEndpoint + '/' + id;
    console.log('DELETE request:', url);
    fetch(url, { method: 'delete' })
        .then(responseHandler);
};

const issuePostRequest = (data, responseHandler) => {
   // create data on the server:
   console.log('POST request:', postsEndpoint, data);
   fetch(postsEndpoint, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(responseHandler);
};

const handleUpdate = (ev) => {
    const id = ev.target.getAttribute('data-id');
    const container = ev.target.parentElement.parentElement;
    const data = {
        'title': container.querySelector('#title').value,
        'body': container.querySelector('#body').value,
        'user_id': container.querySelector('#user_id').value,
        'date': container.querySelector('#date').value,
    };
    const callback = (item) => {
        container.innerHTML = getItemHTML(item);
        attachEventHandlers();
    };
    issuePutRequest(id, data, callback)
};

const handleCreate = () => {
    const container = document.querySelector('.add-new-panel');
    data = {
        'title': container.querySelector('#title').value,
        'body': container.querySelector('#body').value,
    }
    issuePostRequest(data, issueGetRequest);
    document.querySelector('.add-new-panel').classList.remove('active');
};

const handleDelete = (ev) => {
    const id = ev.target.id;
    const areYouSure = confirm('Are you sure that you want to delete item #' + id + '?')
    if (!areYouSure) {
        return;
    }
    issueDeleteRequest(id, issueGetRequest);
};

const attachEventHandlers = () => {
    for (elem of document.querySelectorAll('.delete')) {
        elem.onclick = handleDelete;
    }
    for (elem of document.querySelectorAll('.edit')) {
        elem.onclick = showEditForm;
    }
//    document.querySelector('#add-new').onclick = () => {
//        const container = document.querySelector('.add-new-panel');
//        container.querySelector('.firstname').value = '';
//        container.querySelector('.firstname').value = '';
//        container.classList.add('active');
//    };
    document.querySelector('.close').onclick = () => {
        document.querySelector('.add-new-panel').classList.remove('active');
    };
    document.querySelector('.add-new-panel .cancel').onclick = () => {
        document.querySelector('.add-new-panel').classList.remove('active');
    };
    document.querySelector('.update.save').onclick = handleCreate;

};

const attachFormEventHandlers = (item, container) => {
    container.querySelector('.update').onclick = handleUpdate;
    container.querySelector('.cancel').onclick = () => {
        container.innerHTML = getItemHTML(item);
        attachEventHandlers();
    }
};

const showEditForm = (ev) => {
    const id = ev.target.id;
    const url = postsEndpoint + '/' + id;
    const cardElement = ev.target.parentElement.parentElement;
    fetch(url)
        .then(response => response.json())
        .then(item => {
            displayForm(item, cardElement);
            attachFormEventHandlers(item, cardElement);
        });
    return false;
};

const displayForm = (item, container) => {
    container.innerHTML = `
        <div style="margin-top:7px; ">
            <label>id:</label><span>${item.id}</span><br>
            <label>title:</label>
            <input type="text" id="title" value="${item.title}"><br>
            </br>
            <label>body:</label><br>
            <textarea rows="4" type="text" id="body" value="${item.body}">${item.body}</textarea><br>
            <input style="visibility:hidden;" type="text" id="user_id" value="${item.user_id}"><br>
            <input style="visibility:hidden;" type="text" id="date" value="${item.date}"><br>

    <div align="center" >
            <label></label><br>
            <button type="button" data-id="${item.id}" class="update button-primary">Update</button>
            <button type="button" class="cancel">Cancel</button>
        </div></div>
    `;
};