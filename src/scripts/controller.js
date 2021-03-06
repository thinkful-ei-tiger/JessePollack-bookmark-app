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
          if (i == $("#rating").val()) selected = "selected"
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

function handleHoverOverStars(){
    $('body').on('mouseover', '.stars', function(e){
        e.stopPropagation();
        let currId = parseInt($(this).attr('id').substring(1), 10)
        if (currId != store.items.currentRating.rating){
            store.items.currentRating.rating = currId
        if (!store.items.adding){
        let cuidId = $(this).parents(".entry").attr("data-item-id")
        let item = store.findById(cuidId)
        item.editingRating = true;
        }
        render()
    }
        }
    )  
}

function handleEditNoRating(){
    $('body').on('mouseover', '.no-rating', function(e){
        let cuidId = $(this).parents(".entry").attr("data-item-id")
        let item = store.findById(cuidId)
        item.editingRating = true;
        render()
    })
}

function handleReleaseFromStars(){
    $('body').on('mouseout', '.stars', function(e){
        if (store.items.currentRating.selected != store.items.currentRating.rating){
        store.items.currentRating.rating = store.items.currentRating.selected
        render()
        }
        })
}

function handleClickOnStars(){
    $('body').on('click', '.stars', function(e){
        e.stopPropagation()
        store.items.currentRating.selected = store.items.currentRating.rating;
        store.items.currentRating.rating = 0
        if (!store.items.adding){
        let cuidId = $(this).parents(".entry").attr("data-item-id")
        let item = store.findById(cuidId)
        api.findAndUpdate(cuidId, {rating:store.items.currentRating.selected}).then(() =>{  
            item.rating = store.items.currentRating.selected
            item.editingRating = false
            render()
        })
        }else render()
    
    
    })
}

function handleNewClick(){
$('body').on('click', '.new', function(e){
    store.items.currentRating.rating = 0;
    store.items.currentRating.selected = 0;
    store.items.adding = true
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
        if (item.rating != undefined || item.editingRating){
        let star
            for (let i = 0; i < 5; i++){
                if (i < (item.editingRating? store.items.currentRating.rating : item.rating)) star="full_star.png"
                else star = "emptystar2.png"
                newEntry+=  `<img class ="stars" src="src/photos/${star}" id="n${i + 1}"}></img>`
            }
        }
        else{
            newEntry += `<span class="no-rating">No Rating</span>`
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
<input type="textbox" name="inputbookmark" class="inputbm" placeholder="Place link here..." value=${$(".inputbm").val() || ''}>
<div class="entry-selected" style="border: none"> 
<input type="textbox" class="title" placeholder="Title of Page" value=${$(".title").val() || ''}>
<span>`

for (let i = 0; i < 5; i++){
    if ( i < store.items.currentRating.rating) newCreationTemplate += `<img class="stars" id="n${i+1}" src="src/photos/full_star.png">`
    else newCreationTemplate += `<img class="stars" id="n${i+1}" src="src/photos/emptystar2.png">`
}

newCreationTemplate += `</span>
<textarea class="description" placeholder="Add a description (optional)">${$(".description").val() || ''}</textarea>
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
       let id =  $(this).siblings().attr("data-item-id")
       api.deleteItem(id).then(() => {
        store.deleteItem(id)
        render()
       }
        )
    })
}

function handleSwitchEntries(){
    $('body').on('mouseout', '.entry', function(){
        store.items.currentRating.rating = 0
        store.items.bookmarks.forEach((current) => current.editingRating = false)
        render()
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
        store.items.adding=false;
        render()
    })
}


function handleNewBookmarkSubmit(){
    $('body').on('submit', '.new-bookmark', function(e){
        e.preventDefault()
        let newURL = $('.inputbm').val()
        let description = $('.description').val()
        let rating
        if (store.items.currentRating.selected > 0) rating = store.items.currentRating.selected
        //figure out how to make rating optional
        let title = $('.title').val()
        store.items.error = null
        api.addBookmark(newURL, description, rating, title).then(data => {
            data.expanded = false;
            data.editing = false;
            data.editingRating = false;
            store.addItem(data)
            store.items.adding = false;
            store.items.currentRating.rating = 0;
            store.items.currentRating.selected = 0;
            render()
        }).catch(err => handleError(err))

    }
    
    )
}

//Because the page is re-rendering every time a star is hightlighted or selected, it is necessary to save the drafts
//
// function handleTyping(){
//     $('body').on('input', ".title", function(e){
//         store.items.drafts.title = $('.title').val()
//     })
//     $('body').on('input', ".inputbm", function(e){
//         store.items.drafts.url = $('.inputbm').val()
//     })
//     $('body').on('input', ".description", function(e){
//         store.items.drafts.desc = $('.description').val()
//     })
// }

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
    if (!store.items.adding&&!store.items.error){
   $('body').html(generateHTMLTemplate(store.items.bookmarks))
    }
     else
    $('body').html(generateNewCreationTemplate())
}

function handleEventListeners(){
    initialize()
    handleNewBookmarkSubmit()
    handleHoverOverStars()
    handleReleaseFromStars()
    handleNewClick()
    handleClickOnStars()
    handleExpansion()
    handleDelete()
    handleFilter()
    handleX()
    handleCancel()
    handleEdit()
    handleDoneEditing()
    handleSwitchEntries()
    handleEditNoRating()
}

export default{
    handleEventListeners
}