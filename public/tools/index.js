fetch('/db')
    .then(response => {
        return response.json();
    })
    .then(data => {
        const urls = [];
        let count = 0;
        for (endpoint in data) {
            count += data[endpoint].length;
            urls.push(`<a href="/${endpoint}">/${endpoint}</a><sup>${data[endpoint].length}x</sup>`);
        }
        urls.push(`<a href="../db">/db</a><sup>${count}x</sup>`);
        document.getElementById('resources').innerHTML = urls.join('<br>');
    });

const swaggerElement = document.querySelector("#swagger");
const pathToSchema = `${window.location.origin}${window.location.pathname}/swagger/openapi_rest_demo.json`
swaggerElement.href = `https://editor.swagger.io/?url=${pathToSchema.replace('index.html', '').replace(/\/\//g, "/")}`