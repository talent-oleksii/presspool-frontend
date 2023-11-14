import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import Approve from './Approve';
import Advertisement from './Advertisement';


const DashboardRoute: FC = () => {
	return (
		<Routes>
			<Route path="/:id" element={<Dashboard />} />
			<Route path="/advertisement/:id" element={<Advertisement />} />
			<Route path="/approve" element={<Approve />} />
		</Routes>
	);
};

export default DashboardRoute;