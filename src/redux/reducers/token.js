const token = (token = null, action) => {
  switch (action.type) {
    case 'token':
      token = action.payload
      return token
    default:
      return token
  }

}

export default token