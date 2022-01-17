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

const getItemHTML = (item) => {
    return `<div>
        <label>id:</label><span>${item.id}</span><br>
        <label>user name:</label><span>${item.user_name}</span><br>
        <label>date:</label><span>${item.date}</span><br>
        <label>title:</label><span>${item.title}</span><br>
        <label>body:</label><span>${item.body}</span><br>
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