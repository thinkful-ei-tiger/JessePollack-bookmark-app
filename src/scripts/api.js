const BASE_URL = `https://thinkful-list-api.herokuapp.com/jesse/bookmarks`

function listAPIfetch(...inputs){
    let error
   return fetch(...inputs).then((res) => {
        if (!res.ok) error = {code: res.status}
        return res.json()
    }).then(result => {
        if (error){
            error.message = result.message
            return Promise.reject(error)
        }
        console.log(result)
        return result
    })
}

function addBookmark(urlInput, descrip, rate, titleInput){
    let input = JSON.stringify({title: titleInput, url: urlInput, desc: descrip, rating: rate})
    return listAPIfetch(BASE_URL, {method: 'POST', headers: new Headers({'Content-Type': 'application/json'}), body: input})
}

function getItems(){
    return listAPIfetch(BASE_URL)
}

export default{
    addBookmark
}