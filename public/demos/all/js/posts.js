const endpoint = '../../posts';
const endpoints = [
  '../../posts',
  '../../users'
];

//const issueGetRequest = () => {
//    // get data from the server:
//    console.log('GET request:', endpoint);
//    fetch(endpoint)
//        .then(response => response.json())
//        .then(displayPostsData);
//};

const issueGetRequest = () => {
    // get data from the server:
    console.log('GET request:', endpoints);
    const results = await Promise.all(endpoints.map((url) => fetch(url).then((r) => r.json())));
    const postsData = results[0]
    const usersData = results[1]

    for (const i = 0; i < postsData.length; i++) {
        for (const j = 0; j < usersData.length; j++) {
            if (usersData[j].id === postsData[i].user_id) {
                postsData[i] = `${usersData[j].firstname} ${usersData[j].lastname}`
            }
        }
    }

    displayPostsData(postsData)
};

const getItemHTML = (item) => {
    return `<div>
        <label>id:</label><span>${item.id}</span><br>
        <label>user name:</label><span>${item.user_name}</span><br>
        <label>date:</label><span>${item.date}</span><br>
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