import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'; // allow user to navigate between different pages withouttriggering a full page reload from a server
import {Provider} from 'react-redux'; // connecting redux to react
import {DashboardPage} from './page/dashboardPage';
import store from './state/store'; // central store - actual redux store

function App(){
  return(
    //Connect redux store using provider
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<DashboardPage/>}/>
            <Route path="*" element={<div className="p-8 text-center text-xl">404 - Not Found</div>} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;