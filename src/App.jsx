import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import router from './routes';
import ErrorBoundary from './components/common/ErrorBoundary';

// Import toast styles
import 'react-toastify/dist/ReactToastify.css';

function App() {
	return (
		<ErrorBoundary>
			<div className="app">
				<RouterProvider router={router} />
				<ToastContainer
					position="top-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
			</div>
		</ErrorBoundary>
	);
}

export default App;
