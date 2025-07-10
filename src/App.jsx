import { RouterProvider } from 'react-router-dom';
import router from './routes';
import logger from './utils/logger';

function App() {
	logger.debug('App component initialized');
	
	return (
		<div className="app">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
