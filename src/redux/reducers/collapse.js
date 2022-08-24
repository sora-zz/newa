const collapse = (collapseflag = false, action) => {
  switch (action.type) {
    case 'collapse':
      collapseflag = action.payload
      return collapseflag
    default:
      return collapseflag
  }

}

export default collapse