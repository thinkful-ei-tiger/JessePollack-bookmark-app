import api from './api'
import store from './store'
import $ from 'jquery'


function generateHTMLTemplate(items){
    let result = `<h1> My Bookmarks</h1>
    <div class="buttons">
        <button class="new">New</button>
        <button type="dropdown" class="filter">Filter By</button>
        <select id="rating" name="rating"> 
      ` 
      for (let i = 0; i < 6; i++){
          let selected = ""
          if (i == store.items.filter) selected = "selected"
          result += `<option value=${i} ${selected}>${i}</option>`
          selected =""
      }
        result += `</select>
    </div>
    <div class="bookmarks">`
    items.forEach((item) =>{
        if (item.rating >= store.items.filter){
        result += generateEntryTemplate(item)
        if (item.expanded) result += generateExpandedView(item) 
        }
    })
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
    $('.checked').nextAll().attr('src', 'src/photos/emptystar2.png')
    else $('.stars').attr('src', 'src/photos/emptystar2.png')
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
    let ellipses =''
    if (item.title.length > 14) ellipses = '...'
    let newEntry=`
        <div class="entry" data-item-id=${item.id}>
        <span>${item.title.substring(0,14)}${ellipses}</span>
        <span>`
        if (item.rating != undefined){
        let star
            for (let i = 0; i < 5; i++){
                if (i < item.rating) star="full_star.png"
                else star = "emptystar2.png"
                newEntry+=  `<img src="src/photos/${star}"></img>`
            }
        }
        else{
            newEntry += `No Rating`
        }
      newEntry+= `</span>
    </div>`
    return newEntry
    }

function generateExpandedView(item){
    let newEntry = `<div class="entry-selected max-height">
    <div class="nospacing" style="border: none" data-item-id=${item.id}>
    <img class="edit" src="src/photos/edit_icon.png">
    <button class="visit" onclick="window.open('${item.url}','_blank')">Visit Site</button>
    `
       
    newEntry +=`</div>`
    if (!item.editing) newEntry += `<p>${item.desc}</p>`
    else newEntry += `<textarea class="editing">${item.desc}</textarea>
         <button class="done-editing">Done</button>
         ` 
        

   newEntry += `<img class="delete" src="src/photos/trashcan.png">
</div>`

return newEntry
}

function generateNewCreationTemplate(){
let newCreationTemplate =  `<h1>My Bookmarks</h1>`
let error=`
<div class="error">
    <div class="X">
        X
    </div>
    ${store.items.error}

</div>`

if (store.items.error) newCreationTemplate += error

newCreationTemplate +=`<form class="new-bookmark">
<label for="inputbookmark">Add New Bookmark:</label>
<input type="textbox" name="inputbookmark" class="inputbm" placeholder="Place link here...">
<div class="entry-selected" style="border: none"> 
<input type="textbox" class="title" placeholder="Title of Page">
<span>
    <img class="stars" id="n1" src="src/photos/emptystar2.png">
    <img class="stars" id="n2" src="src/photos/emptystar2.png">
    <img class="stars" id="n3" src="src/photos/emptystar2.png">
    <img class="stars" id="n4" src="src/photos/emptystar2.png">
    <img class="stars" id="n5" src="src/photos/emptystar2.png">
</span>
<textarea class="description" placeholder="Add a description (optional)"></textarea>
<div class="e-buttons">
<button class="cancel">Cancel</button>
<button class="create" type="submit">Create</button>
</div>
</div>
</form>`
return newCreationTemplate
}

function handleDoneEditing(){
    $('body').on('click', '.done-editing', function(e){
       let id = $(this).siblings(".nospacing").attr("data-item-id")
       let item = store.findById(id)
       let description = $('.editing').val()
       console.log(description)
       api.findAndUpdate(id, {desc: description}).then(
        res =>{
            item.editing = false
            item.desc = description
            render()
        }

       )
    })
}

function handleExpansion(){
    $('body').on('click', '.entry', function(){
        let id = $(this).attr("data-item-id")
        let item = store.findById(id)
        item.expanded = !item.expanded
        render()
    })
}

function handleDelete(){
    $('body').on('click', '.delete', function(e){
       let id =  $(this).siblings(".entry").attr("data-item-id")
       api.deleteItem(id).then(() => {
        store.deleteItem(id)
        render()
       }
        )
    })
}

function handleEdit(){
    $('body').on('click', '.edit', function(e){
        let item = store.findById($(this).parent().attr("data-item-id"))
        item.editing = true;
        render()
    })
}

function handleCancel(){
    $('body').on('click', '.cancel', function(e){
        e.preventDefault()
        store.adding=false;
        render()
    })
}


function handleNewBookmarkSubmit(){
    $('body').on('submit', '.new-bookmark', function(e){
        e.preventDefault()
        let newURL = $('.inputbm').val()
        let description = $('.description').val()
        let rating = $('.checked').attr("id")
        if (rating != undefined)
        rating = rating.substring(1)
        //figure out how to make rating optional
        let title = $('.title').val()
        api.addBookmark(newURL, description, rating, title).then(data => {
            data.expanded = false;
            data.editing = false;
            store.addItem(data)
            store.adding = false;
            render()
        }).catch(err => handleError(err))

    }
    
    )
}
function handleError(err){
    store.adding = true;
    store.items.error = err.message
    render()
}

function handleFilter(){
    $('body').on('click', '.filter', function(e){
        store.items.filter = $('#rating').val()
        render()
    })
}
function handleX(){
    $('body').on('click', ".X", function(e){
        store.items.error = null
        render()
    })
}

function initialize(){
    api.getItems().then(data =>{
        data.forEach(current =>{ store.items.bookmarks.push(current)
        })
        render()
    }).catch(err => console.log(err.message))
}

function render(){
    if (!store.adding&&!store.items.error){
   $('body').html(generateHTMLTemplate(store.items.bookmarks))
    }
     else
    $('body').html(generateNewCreationTemplate())
}

function handleEventListeners(){
    initialize()
    handleNewBookmarkSubmit()
    handleHoverOverStars()
    handleNewClick()
    handleClickOnStars()
    handleExpansion()
    handleDelete()
    handleFilter()
    handleX()
    handleCancel()
    handleEdit()
    handleDoneEditing()
}

export default{
    handleEventListeners
}