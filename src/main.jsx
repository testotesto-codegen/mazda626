import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import App from './App.jsx';
import './index.css';
import { store, persistor } from './redux/store.js';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import logger from './utils/logger.js';

// Log application startup
logger.info('Application starting up', {
	environment: import.meta.env.MODE,
	isDevelopment: import.meta.env.DEV
});

// Expose store globally in development for debugging
if (import.meta.env.DEV) {
	window.store = store;
	logger.debug('Store exposed globally for development debugging');
}

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ErrorBoundary>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<DndProvider backend={HTML5Backend}>
						<App />
						<ToastContainer />
					</DndProvider>
				</PersistGate>
			</Provider>
		</ErrorBoundary>
	</React.StrictMode>
);
