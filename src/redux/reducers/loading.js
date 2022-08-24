const loading = (loadingflag = false, action) => {
  switch (action.type) {
    case 'loading':
      loadingflag = action.payload
      return loadingflag
    default:
      return loadingflag
  }

}

export default loading