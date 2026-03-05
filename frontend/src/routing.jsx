import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login/Login'
import TablePage from './pages/TablePage/TablePage'
import Dashboard from './pages/Dashboard/Dashboard'
import CompanyList from './pages/CompanyList/CompanyList'
import Party from './pages/Party/Party'
import PartyList from './pages/Party/PartyList'
import DeptList from './pages/Department/DeptList'
import WorkList from './pages/Work/WorkList'
import PanchayatList from './pages/Panchayat/PanchayatList'
import ZoneList from './pages/Zone/ZoneList'
import AccountVoucherCreation from './pages/AccountVoucherCreation/AccountVoucherCreation'
import AccountCreation from './pages/AccountCreation/AccountCreation'
import UserCreate from './pages/Settings/UserCreate'
import RoleAssign from './pages/Settings/RoleAssign'
import UserList from './pages/Settings/UserList'
import AdminPin from './pages/Settings/AdminPin'
import UserHistory from './pages/Settings/UserHistory'
import CompanyRegistration from './pages/CompanyRegistration/CompanyRegistration'

import Register from './pages/Register/Register'
import MainLayout from './components/MainLayout'
import PrivateRoute from './components/PrivateRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/companylist',
    element: (
      <PrivateRoute>
        <CompanyList />
      </PrivateRoute>
    ),
  },
  {
    path: '/company-registration',
    element: (
      <PrivateRoute>
        <CompanyRegistration />
      </PrivateRoute>
    ),
  },
  {
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '/dashboard/:id',
        element: <Dashboard />,
      },
      {
        path: '/table',
        element: <TablePage />,
      },
      {
        path: '/party',
        element: <PartyList />,
      },
      {
        path: '/party/create',
        element: <Party />,
      },
      {
        path: '/party/edit/:id',
        element: <Party />,
      },
      {
        path: '/department',
        element: <DeptList />,
      },
      {
        path: '/work',
        element: <WorkList />,
      },
      {
        path: '/zone',
        element: <ZoneList />,
      },
      {
        path: '/panchayat',
        element: <PanchayatList />,
      },
      {
        path: '/account-voucher-creation',
        element: <AccountVoucherCreation />,
      },
      {
        path: '/account/create',
        element: <AccountCreation />,
      },
      {
        path: '/account/edit/:id',
        element: <AccountCreation />,
      },
      {
        path: '/settings/user-create',
        element: <UserCreate />,
      },
      {
        path: '/settings/role-assign',
        element: <RoleAssign />,
      },
      {
        path: '/settings/user-list',
        element: <UserList />,
      },
      {
        path: '/settings/admin-pin',
        element: <AdminPin />,
      },
      {
        path: '/settings/user-history',
        element: <UserHistory />,
      },

    ],
  },
])

export default router
