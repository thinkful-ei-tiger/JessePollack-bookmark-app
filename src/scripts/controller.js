import api from './api'
import store from './store'
import $ from 'jquery'


function generateHTMLTemplate(items){
    let result = `<h1> My Bookmarks</h1>
    <div class="buttons">
        <button>New</button>
        <button>Filter By</button>
    </div>
    <div class="bookmarks"></div>`
    items.forEach((item) => result += generateEntryTemplate(item))
    result += ` </div>
    </body>
    </html>`
}

function handleHoverOverStars(){
    $('body').on('mouseover', '.stars', function(e){
        console.log("hello")
        let currId = parseInt($(this).attr('id').substring(1), 10)
        for (let i = 0; i < currId; i++){
            $(`#n${i+1}`).attr('src', 'full_star.png')
        }
    })
}

function handleNewClick(){
$('body').on('click', '.new', function(e){
    store.store.adding = true
    render()
})
}
function generateEntryTemplate(item){
    let newEntry=`
        <div class="entry">
        <span>Hello</span>
        <span>`
        let star
            for (let i = 0; i < 5; i++){
                if (i < item.rating) star="full star.png"
                else star = "emptystar.png"
                newEntry+=  `<img src="photos/${star}"></img>`
            }
      newEntry+= `</span>
    </div>`
    return newEntry
    }

function generateNewCreationTemplate(){
let newCreationTemplate =  `<h1>My Bookmarks</h1>
<form class="new-bookmark">
<label for="inputbookmark">Add New Bookmark:</label>
<input type="textbox" name="inputbookmark" class="inputbm">
<div class="entry-selected"> 
<input type="textbox" class="title" placeholder="Title of Page">
<span>
    <img class="stars" id="n1" src="photos/emptystar.png">
    <img class="stars" id="n2" src="photos/emptystar.png">
    <img class="stars" id="n3" src="photos/emptystar.png">
    <img class="stars" id="n4" src="photos/emptystar.png">
    <img class="stars" id="n5" src="photos/emptystar.png">
</span>
<input type="textarea" class="description" placeholder="Add a description (optional)">
<div class="e-buttons">
<button>Cancel</button>
<button type="submit">Create</button>
</div>
</div>
</form>`
return newCreationTemplate
}


function handleNewBookmarkSubmit(){
    $('body').on('submit', '.new-bookmark', function(e){
        e.preventDefault()
        let newURL = $('.inputbm').val()
        let description = $('.description').val()
        let rating = $('.rating').val()
        let title = $('.title').val()
        api.addBookmark(newURL, description, rating, title).then(data => {
            store.addItem(data)
            render()
        }).catch(err => renderError(err.message))
    }

    
    )
}

function render(){
    console.log(store.adding)
    if (!store.adding)
   $('body').html(generateHTMLTemplate(store.items))
    if (store.adding)
    $('body').html(generateNewCreationTemplate())
}

function handleEventListeners(){
    handleHoverOverStars()
    handleNewClick()
}

export default{
    handleEventListeners
}