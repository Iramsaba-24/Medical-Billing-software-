import { RouteObject } from 'react-router-dom';
import Layout from '../containers/layout/Header';
import DashboardPage from '../view/dashboardPages/DashboardPage';
import { URL_PATH } from '../constants/UrlPath';

export const mainRoutes: RouteObject[] = [
  {
    element: <Layout children={undefined} />,
    children: [
      {
        path: URL_PATH.DASHBOARD,
        element: <DashboardPage />,
      },
    ],
  },
];
