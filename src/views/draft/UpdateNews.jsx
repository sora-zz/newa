import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import WriteNews from '../write/WriteNews';

function UpdateNews() {

  const { id } = useParams()
  const [data, setdata] = useState()

  useEffect(() => {

    axios.get(`/news/${id}?_expand=category&_expand=role`).then(
      res => {
        setdata(res.data)
      }
    )
  }, [])

  return (
    <div>
      <WriteNews id={id} data={data}/>
    </div>
  )
}

export default UpdateNews
