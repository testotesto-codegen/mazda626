import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navigation/Navbar';

const RootLayout = () => {
	return (
		<>
			<Navbar />
			<div>
				<Outlet />
			</div>
		</>
	);
};

export default RootLayout;
