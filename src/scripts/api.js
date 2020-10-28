const BASE_URL = `https://thinkful-list-api.herokuapp.com/jesse/bookmarks`

function listAPIfetch(...inputs){
    let error
    fetch(...inputs).then((res) => {
        if (!res.ok) error = {code: res.status}
        return res.json()
    }).then(result => {
        if (error){
            error.message = data.message
            return Promise.reject(error)
        }
        return result
    })
}

function addBookmark(url, descrip, rate, title){
    return listAPIfetch(BASE_URL, 'POST', {title:title, url: url, desc: descrip, rating: rate})
}