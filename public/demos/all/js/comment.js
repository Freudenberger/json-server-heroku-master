const commentsEndpoint = '../../api/comments';


async function issueGetRequest(comment_id)
{
    const commentUrl = `${commentsEndpoint}/${comment_id}`
    const commentsData = await Promise.all([commentUrl].map((url) => fetch(url).then((r) => r.json())));

    const commentData = commentsData[0]

    displayCommentData(commentData);
    attachEventHandlers();
};


//            <i class="fas fa-trash delete" id="${item.id}"></i>
//        <label>id:</label><span>${item.id}</span><br>
const getItemHTML = (item) => {
    return `<div style="width:500px;">
        <div class="controls" >
            <i class="fas fa-edit edit" id="${item.id}"></i>
        </div>
        <label>id:</label><span>${item.id}</span><br>
        <label>date:</label><span>${item.date}</span><br>
        <label>comment:</label><span>${item.body}</span><br>
    </div>`;
};
//        <hr><br>
//        <label>comments:</label><br>
//        ${getCommentsHTML(item.comments)}

const displayCommentData = (item) => {
    const container = document.querySelector("#container");
    container.innerHTML = "";
    displayItem(item, container);
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

const comment_id = getParams()['id']
issueGetRequest(comment_id);




const issuePutRequest = (id, data, responseHandler) => {
    // update data on the server:
    const url = commentsEndpoint + '/' + id;
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
    const url = commentsEndpoint + '/' + id;
    console.log('DELETE request:', url);
    fetch(url, { method: 'delete' })
        .then(responseHandler);
};

const issuePostRequest = (data, responseHandler) => {
   // create data on the server:
   console.log('POST request:', commentsEndpoint, data);
   fetch(commentsEndpoint, {
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
        'body': container.querySelector('#body').value,
        'id': container.querySelector('#user_id').value,
        'date': '22-01-2022',
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
    const url = commentsEndpoint + '/' + id;
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
            </br>
            <label>body:</label><br>
            <textarea rows="4" type="text" id="body" style="width:350px;" value="${item.body}">${item.body}</textarea><br>
            <input style="visibility:hidden;" type="text" id="date" value="${item.date}"><br>

    <div align="center" >
            <label></label><br>
            <button type="button" data-id="${item.id}" class="update button-primary">Update</button>
            <button type="button" class="cancel">Cancel</button>
        </div></div>
    `;
};