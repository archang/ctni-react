import React, { useEffect, useState } from 'react';
import './App.css';
// import { Container } from "semantic-ui-react";
function App() {
  useEffect(() => {
    fetch("/scans").then(response =>
      response.json().then(data => {
        console.log(data);
      })
    );
  }, []);

  return <div className="App"/>
}

export default App;
//   const ListLoading = withListLoading(List);
//   const [appState, setAppState] = useState({
//     loading: false,
//     repos: null,
//   });
//
//   useEffect(() => {
//     setAppState({ loading: true });
//     const apiUrl = `scans`;
//     fetch(apiUrl)
//       .then((res) => res.json())
//       .then((repos) => {
//         setAppState({ loading: false, repos: repos });
//       });
//   }, [setAppState]);
//   return (
//     <div className='App'>
//       <div className='container'>
//         <h1>My Repositories</h1>
//       </div>
//       <div className='repo-container'>
//         <ListLoading isLoading={appState.loading} repos={appState.repos} />
//       </div>
//       <footer>
//         <div className='footer'>
//           Built{' '}
//           <span role='img' aria-label='love'>
//             💚
//           </span>{' '}
//           with by Shedrack Akintayo
//         </div>
//       </footer>
//     </div>
//   );
// }
// export default App;
