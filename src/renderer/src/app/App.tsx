import { useEffect } from 'react';
import Layout from '../containers/layout/Header'; 
import DashboardPage from '../view/dashboardPages/DashboardPage';

function App() {
 useEffect(() => {
    // Check if running in Electron
    if (window.ipcRenderer) {
      window.ipcRenderer.on('main-process-message', (_event, message) => {
        console.log("Received:", message)
      })
    }
  }, [])
  
  return (
    <Layout>
      <DashboardPage />
    </Layout>
  );
}

export default App;
