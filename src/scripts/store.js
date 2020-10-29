const items = {
    bookmarks: [],
    adding: false,
    error: null,
    filter: 0, 
    currentRating: {rating: null, confirmed: false}
  };

  function findById(id){
    return items.bookmarks.find(current => current.id == id)
}
  function addItem(item){
      items.bookmarks.push(item)
  }

  function deleteItem(id){
      let index = -1;
      for (let i = 0; i < items.bookmarks.length; i++){
          if (items.bookmarks[i].id == id) index = i
      }
      items.bookmarks.splice(index, 1)
  }

  export default{
      items,
      addItem, 
      findById, 
      deleteItem
  }