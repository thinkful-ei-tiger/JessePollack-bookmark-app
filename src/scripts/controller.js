import api from './api'
import store from './store'


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
    generateHTMLTemplate(store.items)
}

function handleEventListeners(){
    handleHoverOverStars()
}

export default{
    handleEventListeners
}