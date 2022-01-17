const endpoint = '../../posts';
const issueGetRequest = () => {
    // get data from the server:
    console.log('GET request:', endpoint);
    fetch(endpoint)
        .then(response => response.json())
        .then(displayPostsData)
        .then(attachEventHandlers);
};

const getItemHTML = (item) => {
    return `<div>
//        <div class="controls">
//            <i class="fas fa-edit edit" id="${item.id}"></i>
//            <i class="fas fa-trash delete" id="${item.id}"></i>
//        </div>
        <label>id:</label><span>${item.id}</span><br>
        <label>user_id:</label><span>${item.user_id}</span><br>
        <label>date:</label><span>${item.date}</span><br>
        <label>body:</label><span>${item.body}</span><br>
//        <label>avatar:</label><img src="${item.avatar}" />
    </div>`;
};

const displayItem = (item, container) => {
    itemHTML = getItemHTML(item);
    container.innerHTML += `
        <div class="card-wrapper">${itemHTML}</div>
    `;
};

// posts:
const displayPostsData = (data) => {
    console.log(data)
    const container = document.querySelector("#postContainer");
    container.innerHTML = "";
    for (item of data) {
        displayItem(item, container);
    }
};

issueGetRequest();