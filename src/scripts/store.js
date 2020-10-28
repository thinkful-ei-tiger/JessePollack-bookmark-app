const items = {
    bookmarks: [],
    adding: false,
    error: null,
    filter: 0
  };


  function addItem(item){
      items.bookmarks.push(item)
  }

  export default{
      items,
      addItem
  }