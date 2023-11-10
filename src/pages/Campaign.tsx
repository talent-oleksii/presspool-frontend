import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from './campaign/Dashboard';
import Approve from './campaign/Approve';
import Advertisement from './campaign/Advertisement';


const Campaign: FC = () => {
	return (
		<Routes>
			<Route path="/:id" element={<Dashboard />} />
			<Route path="/advertisement/:id" element={<Advertisement />} />
			<Route path="/approve" element={<Approve />} />
		</Routes>
	);
};

export default Campaign;