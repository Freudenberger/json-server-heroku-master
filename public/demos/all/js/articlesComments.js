const endpoint = '../../api/articles';
const endpoints = [
  '../../api/articles',
  '../../api/users',
  '../../api/comments'
];


async function issueGetRequest()
{
    // get data from the server:
    console.log('GET request:', endpoints);
    const results = await Promise.all(endpoints.map((url) => fetch(url).then((r) => r.json())));
    const articlesData = results[0]
    const usersData = results[1]
    const userComments = results[2]

    for (let i = 0; i < articlesData.length; i++) {
        for (let j = 0; j < usersData.length; j++) {
            if (usersData[j].id === articlesData[i].user_id) {
                articlesData[i].user_name = `${usersData[j].firstname} ${usersData[j].lastname}`;
                break;
            }
        }
        if (articlesData[i].user_name === undefined) {
            articlesData[i].user_name = "Unknown user";
        }
        articlesData[i].comments = []
        for (let j = 0; j < userComments.length; j++) {
            if (userComments[j].article_id === articlesData[i].id) {
                articlesData[i].comments.push(userComments[j]);
            }
        }
        // sort comments by date:
        articlesData[i].comments.sort((a,b) => a.date < b.date);
    }

    displayArticlesData(articlesData);
};

const getItemHTML = (item) => {
    return `<div>
        <label>id:</label><span>${item.id}</span><br>
        <label>user name:</label><span>${item.user_name}</span><br>
        <label>date:</label><span>${item.date}</span><br>
        <label>title:</label><span>${item.title}</span><br>
        <label>description:</label><span>${item.body}</span><br>
        <hr><br>
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

const displayArticlesData = (data) => {
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