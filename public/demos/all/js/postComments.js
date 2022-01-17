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
};

const getImagesHTML = (images) => {
    let htmlData = "";
    if (images !== undefined) {
        for (image of images) {
            htmlData += `<img src="${image}" />`;
            htmlData += `<br>`
        }
    }
    return htmlData
};

const getItemHTML = (item) => {
    return `<div>
        <label>id:</label><span>${item.id}</span><br>
        <label>user name:</label><span>${item.user_name}</span><br>
        <label>date:</label><span>${item.date}</span><br>
        <label>title:</label><span>${item.title}</span><br>
        ${getImagesHTML(item.images)}
        <label>description:</label><span>${item.body}</span><br>
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