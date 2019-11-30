const axios = require('axios').default;

function register(user, password) {
    return axios.post("http://127.0.0.1", {"login": user, "password": password});
}


export {register}