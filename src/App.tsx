import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Login from './pages/Login/Login';
import CameraApp from './pages/Cameras/Cameras';
import {api} from "./helpers/api";
import {MeAdmin} from "./pages/MeAdmin/MeAdmin";
import {CameraContext} from "./context/CameraContext";

const App: React.FC = () => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	const {setUser} = useContext(CameraContext)
	useEffect(() => {
		const checkSession = async () => {
			try {
				// Запрос для проверки сессии
				const userData = await api.fetchMe();
				setUser(userData)
				if (userData) {
					setIsAuthenticated(true);  // Если запрос успешен, считаем, что пользователь аутентифицирован
				} else {
					setIsAuthenticated(false); // В противном случае, не аутентифицирован
				}
			} catch (error) {
				setIsAuthenticated(false); // Ошибка при запросе, не аутентифицирован
			}
		};

		checkSession();
	}, []); // Этот эффект выполняется при монтировании компонента

	if (isAuthenticated === null) {
		return <div>Loading...</div>;  // Показать "загружается", пока не получен ответ
	}


	return (

		<Router>
			<Routes>
				<Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>

				<Route
					path="/"
					element={isAuthenticated ? <CameraApp/> : <Navigate to="/login" replace/>}
				/>

				<Route
					path="/admin"
					element={<MeAdmin/>}
				/>
			</Routes>
		</Router>

	);
};

export default App;
