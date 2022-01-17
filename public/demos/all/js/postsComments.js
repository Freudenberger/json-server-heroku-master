const endpoint = '../../posts';
const endpoints = [
  '../../posts',
  '../../users',
  '../../comments'
];


async function issueGetRequest()
{
    // get data from the server:
    console.log('GET request:', endpoints);
    const results = await Promise.all(endpoints.map((url) => fetch(url).then((r) => r.json())));
    const postsData = results[0]
    const usersData = results[1]
    const userComments = results[2]

    for (let i = 0; i < postsData.length; i++) {
        for (let j = 0; j < usersData.length; j++) {
            if (usersData[j].id === postsData[i].user_id) {
                postsData[i].user_name = `${usersData[j].firstname} ${usersData[j].lastname}`;
                break;
            }
        }
        if (postsData[i].user_name === undefined) {
            postsData[i].user_name = "Unknown user";
        }
        postsData[i].comments = []
        for (let j = 0; j < userComments.length; j++) {
            if (userComments[j].post_id === postsData[i].id) {
                postsData[i].comments.push(userComments[j]);
            }
        }
        // sort comments by date:
        postsData[i].comments.sort((a,b) => a.date < b.date);
    }

    displayPostsData(postsData);
};

const getItemHTML = (item) => {
    return `<div>
        <label>id:</label><span>${item.id}</span><br>
        <label>user name:</label><span>${item.user_name}</span><br>
        <label>date:</label><span>${item.date}</span><br>
        <label>title:</label><span>${item.title}</span><br>
        <label>description:</label><span>${item.body}</span><br>
        <label>comments:</label><br>
        ${getCommentsHTML(item.comments)}
    </div>`;
};

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
    console.log(data)
    const container = document.querySelector("#container");
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