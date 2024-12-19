const BASE_URL = "http://10.8.0.1:8000";

// Получить заголовки с сессией (если это необходимо)
// const getHeaders = () => {
// 	const sessionId = localStorage.getItem('session_id');
// 	return {
// 		'Authorization': `Bearer ${sessionId}`,
// 		'Accept': 'application/json',
// 		'Content-Type': 'application/json',  // Убедитесь, что сервер ожидает этот тип
// 	};
// };

// Функции для запросов к API
export const api = {
	async fetchCameras() {
		const response = await fetch(`/cameras/`, {
			method: 'GET',
			credentials: 'include',  // Включаем куки в запрос
		});
		if (!response.ok) throw new Error('Ошибка загрузки камер');
		return await response.json();
	},

	async fetchStreets() {
		const response = await fetch(`/streets/`, {
			method: 'GET',
			credentials: 'include',
		});
		if (!response.ok) throw new Error('Ошибка загрузки улиц');
		return await response.json();
	},

	async fetchVideos() {
		const response = await fetch(`/archives/`, {
			method: 'GET',
			credentials: 'include',
		});
		if (!response.ok) throw new Error('Ошибка загрузки видео');
		return await response.json();
	},

	async fetchMe () {
		const response = await fetch(`/users/me`, {
			method: 'GET',
			credentials: 'include',
		});
		if (!response.ok) throw new Error('Ошибка загрузки пользователя');
		return await response.json();
	},

	async addCamera(data: { title: string; address: string; streetId: string }) {
		const response = await fetch(`/cameras/add`, {
			method: 'POST',

			body: JSON.stringify(data),
			credentials: 'include',  // Включаем куки
		});
		if (!response.ok) throw new Error('Ошибка добавления камеры');
		return await response.json();
	},

	async deleteCamera(cameraId: string) {
		const response = await fetch(`/cameras/delete/${cameraId}`, {
			method: 'DELETE',

			credentials: 'include',  // Включаем куки
		});
		if (!response.ok) throw new Error('Ошибка удаления камеры');
	},
};
