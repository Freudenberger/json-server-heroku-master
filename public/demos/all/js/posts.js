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
        <label>id:</label><span>${item.id}</span><br>
        <label>user_id:</label><span>${item.user_id}</span><br>
        <label>date:</label><span>${item.date}</span><br>
        <label>body:</label><span>${item.body}</span><br>
    </div>`;
};

const displayPostsData = (data) => {
    console.log(data)
    const container = document.querySelector("#postContainer");
    container.innerHTML = "";
    for (item of data) {
        displayItem(item, container);
    }
};

const displayItem = (item, container) => {
    itemHTML = getItemHTML(item);
    container.innerHTML += `
        <div class="card-wrapper">${itemHTML}</div>
    `;
};

issueGetRequest();