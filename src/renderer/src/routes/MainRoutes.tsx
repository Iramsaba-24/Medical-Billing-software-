import { RouteObject } from 'react-router-dom';
import Layout from '@/containers/layout/Header';
import { URL_PATH } from '@/constants/UrlPath';
import Invoices from '@/view/Invoices'
import CreateInvoice from '@/containers/Invoices/CreateInvoice';
import InvoiceView from '@/containers/Invoices/InvoiceView';
import AddForm from '@/containers/distributors/AddForm';
import DistributorsTable from '@/containers/distributors/DistributorsTable';



export const mainRoutes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Invoices />,
      },
      {
        path: URL_PATH.Invoices,
        element: <Invoices />,
      },
      {
        path: URL_PATH.CreateInvoice,
        element: <CreateInvoice />,
      },
      {
        path: `${URL_PATH.InvoiceView}/:invoiceNo`,
        element: <InvoiceView />,
      },
      {
        path: URL_PATH.AddForm ,
        element: <AddForm />,
      },
      {
        path: URL_PATH.DistributorsTable,
          element: <DistributorsTable />,
      },
    ],
  },
];
