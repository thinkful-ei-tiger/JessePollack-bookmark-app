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
        return result
    })
}

function addBookmark(urlInput, descrip, rate, titleInput){
    let input = {title: titleInput, url: urlInput, desc: descrip, rating: rate}
    for (let key in input){
        if (input[key] == undefined) delete input[key]
    }
    input = JSON.stringify(input)
    return listAPIfetch(BASE_URL, {method: 'POST', headers: new Headers({'Content-Type': 'application/json'}), body: input})
}

function getItems(){
    return listAPIfetch(BASE_URL)
}

function deleteItem(id){
    return listAPIfetch(`${BASE_URL}/${id}`, {method: 'DELETE'})
}

export default{
    addBookmark,
    getItems,
    deleteItem
}