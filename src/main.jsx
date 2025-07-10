import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import App from './App.jsx';
import './styles/main.css';
import { store, persistor } from './redux/store.js';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<DndProvider backend={HTML5Backend}>
					<App />
					<ToastContainer />
				</DndProvider>
			</PersistGate>
		</Provider>
	</React.StrictMode>
);
