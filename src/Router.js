import { Routes, Route, Navigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.min.css'
import Home from './views/home/Home';
import Login from './views/log/Login';
import NewsBox from './views/news/NewsBox';
import UserList from './views/userlist/UserList';
import RoleList from './views/rolelist/RoleList';
import RightList from './views/rightlist/RightList';
import NoPermission from './components/NoPermission';
import WriteNews from './views/write/WriteNews'
import DraftBox from './views/draft/DraftBox'
import Preview from './views/draft/Preview.jsx'
import NewsCategory from './views/category/NewsCategory'
import AuditNews from './views/audit/AuditNews'
import AuditList from './views/auditlist/AuditList'
import UnpublishedNews from './views/unpublished/UnpublishedNews'
import PublishedNews from './views/published/PublishedNews';
import SunsetNews from './views/sunset/SunsetNews';
import axios from 'axios';
import UpdateNews from './views/draft/UpdateNews';
import store from './redux/store'

function Router() {

  const [backRouter, setbackRouter] = useState([])

  const routerMap = {
    '/home': <Home />,
    '/user-manage/list': <UserList />,
    '/right-manage/role/list': <RoleList />,
    '/right-manage/right/list': <RightList />,
    '/news-manage/add': <WriteNews />,
    '/news-manage/draft': <DraftBox />,
    '/news-manage/category': <NewsCategory />,
    '/news-manage/preview/:id': <Preview />,
    '/news-manage/update/:id': <UpdateNews />,
    '/audit-manage/audit': <AuditNews />,
    '/audit-manage/list': <AuditList />,
    '/publish-manage/unpublished': <UnpublishedNews />,
    '/publish-manage/published': <PublishedNews />,
    '/publish-manage/sunset': <SunsetNews />
  }

  useEffect(() => {
    Promise.all([
      axios.get('/rights'),
      axios.get('/children')
    ]).then(
      res => {
        setbackRouter([...res[0].data, ...res[1].data])
      }
    )
  }, [])

  const [tokenflag, setokenflag] = useState()

  store.subscribe(() => {
    setokenflag(store.getState()['tokenReceduer'])
  })

  const [user, setuser] = useState(null)

  useEffect(() => {
    setuser( localStorage.getItem('token'))
  },[tokenflag])

  const { roleId, role: { rights } } = JSON.parse(user) || {roleId:null,role:{rights:null}}

  const flag1 = (item) => {
    if (user) {
      return ((item.pagepermisson || item.routepermisson) && routerMap[item.key])
    }else{
      return false
    }
  }

  const flag2 = (item) => {
    if(user){
      if (roleId && roleId == 1) {
        return rights.checked.includes(item.key)
      } else {
        return rights.includes(item.key)
      }
    }else{
      return false
    }
    
  }

  return (
    <Routes>
      <Route path={'/'} element={<Navigate to={"/home"} replace />}></Route>
      <Route exact path={'/login'} element={<Login />}></Route>
      <Route exact path={'*'} element={<NoPermission />}></Route>

      <Route exact path={'/'} element={<NewsBox />}>
        {backRouter.map(item => {
          if (flag1(item) && flag2(item)) {
            return <Route path={item.key} element={routerMap[item.key]} key={item.id} exact />
          }
        })}
      </Route>
      
    </Routes>
  );
}

export default Router;
