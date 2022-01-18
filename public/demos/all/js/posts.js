const endpoint = '../../posts';
const endpoints = [
  '../../posts',
  '../../users'
];

async function issueGetRequest()
{
    // get data from the server:
    console.log('GET request:', endpoints);
    const results = await Promise.all(endpoints.map((url) => fetch(url).then((r) => r.json())));
    const postsData = results[0]
    const usersData = results[1]

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
    }

    displayPostsData(postsData);
};

const getImagesHTML = (images) => {
    let htmlData = "";
        for (image of images) {
            htmlData += `<img src="${image}" />`;
            htmlData += `<br>`
        }
    return htmlData
};


//        <label>id:</label><span>${item.id}</span><br>
const getItemHTML = (item) => {
    return `<div>
        <label>user name:</label><span>${item.user_name}</span><br>
        <label>date:</label><span>${item.date}</span><br>
        <label>title:</label><span>${item.title}</span><br>
        ${getImagesHTML(item.images)}
        <label></label><span>${item.body.substring(0, 200)}</span><br>
        <span><a href="post.html?id=${item.id}">See More...</a></span><br>
    </div>`;
};

const displayPostsData = (data) => {
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