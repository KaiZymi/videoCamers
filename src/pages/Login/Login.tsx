import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const BASE_URL = "http://10.8.0.1:8000";

type LoginProps = {
	setIsAuthenticated: (flag: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (values: { login: string; password: string }) => {
		setLoading(true);
		try {
			const response = await fetch(`/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				credentials: "include",
				body: new URLSearchParams({
					login: values.login,
					password: values.password,
				}).toString(),
			});

			const data = await response.json();

			if (response.ok) {


				setIsAuthenticated(true); // Обновляем состояние аутентификации
				navigate('/'); // Перенаправляем на главную страницу
			} else {
				if (data.detail) {
					message.error(data.detail);
				} else {
					message.error('Ошибка авторизации.');
				}
			}
		} catch (error) {
			console.error('Ошибка входа:', error);
			message.error('Ошибка входа. Попробуйте позже.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
			<div style={{ marginBottom: '20px', fontSize: '30px' }}>
				Вход
			</div>
			<Form onFinish={handleLogin} style={{ width: 300 }}>
				<Form.Item
					name="login"
					rules={[{ required: true, message: 'Введите имя пользователя!' }]}
				>
					<Input placeholder="Имя пользователя" />
				</Form.Item>
				<Form.Item
					name="password"
					rules={[{ required: true, message: 'Введите пароль!' }]}
				>
					<Input.Password placeholder="Пароль" />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
						Войти
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default Login;
