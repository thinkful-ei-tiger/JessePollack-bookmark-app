import api from './api'
import store from './store'
import $ from 'jquery'


function generateHTMLTemplate(items){
    let result = `<h1> My Bookmarks</h1>
    <div class="buttons">
        <button class="new">New</button>
        <button class="filter">Filter By</button>
    </div>
    <div class="bookmarks"></div>`
    items.forEach((item) => result += generateEntryTemplate(item))
    result += ` </div>
    </body>
    </html>`
    return result
}

function handleClickOnStars(){
    $('body').on('click', '.stars', function(e){
        $(this).siblings().removeClass("checked")
        $(this).addClass("checked")
        let currId = parseInt($(this).attr('id').substring(1), 10)
        for (let i = 0; i < currId; i++){
            $(`#n${i+1}`).attr('src', 'src/photos/full_star.png')
        }
    })
}

function handleHoverOverStars(){
    $('body').on('mouseover', '.stars', function(e){
        $('.stars').css('cursor', 'pointer')
        let currId = parseInt($(this).attr('id').substring(1), 10)
        for (let i = 0; i < currId; i++){
            $(`#n${i+1}`).attr('src', 'src/photos/full_star.png')
        }
    })
    $('body').on('mouseout', '.stars', function(e){
    if ($('.stars').hasClass('checked'))
    $('.checked').nextAll().attr('src', 'src/photos/emptystar.png')
    else $('.stars').attr('src', 'src/photos/emptystar.png')
    //settimeout to delay the turning of white just for a bit? to make the stars not go blank every time you hover between them?
    })
}

function handleNewClick(){
$('body').on('click', '.new', function(e){
    store.adding = true
    render()
})
}
function generateEntryTemplate(item){
    let newEntry=`
        <div class="entry">
        <span>${item.title}</span>
        <span>`
        let star
            for (let i = 0; i < 5; i++){
                if (i < item.rating) star="full_star.png"
                else star = "emptystar.png"
                newEntry+=  `<img src="src/photos/${star}"></img>`
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
    <img class="stars" id="n1" src="src/photos/emptystar.png">
    <img class="stars" id="n2" src="src/photos/emptystar.png">
    <img class="stars" id="n3" src="src/photos/emptystar.png">
    <img class="stars" id="n4" src="src/photos/emptystar.png">
    <img class="stars" id="n5" src="src/photos/emptystar.png">
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
        let rating = 0;
        rating = parseInt($('.checked').attr("id").substring(1))
        //figure out how to make rating optional
        let title = $('.title').val()
        api.addBookmark(newURL, description, rating, title).then(data => {
            store.addItem(data)
            store.adding = false;
            render()
        }).catch(err => console.log(err.message))

    }

    
    )
}

function render(){
    if (!store.adding){
   $('body').html(generateHTMLTemplate(store.items.bookmarks))
    }
     else
    $('body').html(generateNewCreationTemplate())
}

function handleEventListeners(){
    handleNewBookmarkSubmit()
    handleHoverOverStars()
    handleNewClick()
    handleClickOnStars()
}

export default{
    handleEventListeners
}