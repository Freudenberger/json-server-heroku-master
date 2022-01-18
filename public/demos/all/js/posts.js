const postsEndpoint = '../../posts'
const usersEndpoint = '../../users'


async function issueGetRequest()
{
    // get data from the server:
    const results = await Promise.all([postsEndpoint, usersEndpoint].map((url) => fetch(url).then((r) => r.json())));
    const postsData = results[0]
    const usersData = results[1]

    for (let i = 0; i < postsData.length; i++) {
        for (let j = 0; j < usersData.length; j++) {
            if (usersData[j].id?.toString() === postsData[i].user_id?.toString()) {
                postsData[i].user_name = `${usersData[j].firstname} ${usersData[j].lastname}`;
                postsData[i].user_id = usersData[j].id;
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
    if (images !== undefined && images.length > 0) {
        htmlData += `<div align="center" ><img src="${images[0]}" /></div>`;
//        for (image of images) {
//            htmlData += `<img src="${image}" />`;
//            htmlData += `<br>`
//        }
    }
    return htmlData
};


//        <label>id:</label><span>${item.id}</span><br>
const getItemHTML = (item) => {
    return `<div>
        <a href="post.html?id=${item.id}">${getImagesHTML(item.images)}</a><br>
        <div align="center" ><strong>${item.title}</strong></div><br>
        <label>user name:</label><span><a href="user.html?id=${item.user_id}">${item.user_name}</a></span><br>
        <label>date:</label><span>${item.date}</span><br>
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