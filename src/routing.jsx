import { createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login/Login'
import TablePage from './pages/TablePage/TablePage'
import Dashboard from './pages/Dashboard/Dashboard'
import CompanyList from './pages/CompanyList/CompanyList'
import Party from './pages/Party/Party'
import PartyList from './pages/Party/PartyList'
import DeptList from './pages/Department/DeptList'
import AccountVoucherCreation from './pages/AccountVoucherCreation/AccountVoucherCreation'
import AccountCreation from './pages/AccountCreation/AccountCreation'
import MainLayout from './components/MainLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/companylist',
    element: <CompanyList />,
  },
  {
    element: <MainLayout />,
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
        path: '/department',
        element: <DeptList />,
      },
      {
        path: '/account-voucher-creation',
        element: <AccountVoucherCreation />,
      },
      {
        path: '/account/create',
        element: <AccountCreation />,
      },
    ],
  },
])

export default router
