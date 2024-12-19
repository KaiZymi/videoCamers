import {Button, Form, Input, message, Modal, Select} from "antd"
import {FC, useContext, useState} from "react"
import {CameraContext} from "../../context/CameraContext";


const {Option} = Select;


export const MeAdmin: FC = () => {

	const [isAddCameraModalVisible, setIsAddCameraModalVisible] = useState(false);
	const [isAddVideoModalVisible, setIsAddVideoModalVisible] = useState(false);
	const [isAddStreetModalVisible, setIsAddStreetModalVisible] = useState(false);


	const { cameras, setCameras,
		newVideo,setNewVideo,
		newCamera, setNewCamera,
		newStreet, setNewStreet,
		streets, setStreets,
		setVideos, videos } = useContext(CameraContext)

	// Обработчики добавления видео и камеры
	const handleAddCamera = async () => {
		try {
			const response = await fetch(`/cameras/add?camera_title=${encodeURIComponent(newCamera.camera_title)}
			&camera_streetId=${encodeURIComponent(newCamera.camera_streetId)}
			&camera_address=${encodeURIComponent(newCamera.camera_address)}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
			});


			if (response.ok) {
				message.success('Камера добавлена!');
				const {id} = await response.json();

				const addedCamera = {...newCamera, id};
				setCameras([...cameras, addedCamera]);
				setIsAddCameraModalVisible(false);
				setNewCamera({ camera_title: '', camera_streetId: '', camera_address: '' });
			} else {
				message.error('Ошибка добавления камеры!');
			}
		} catch (error) {
			console.error('Ошибка добавления камеры:', error);
			message.error('Ошибка добавления камеры!');
		}
	};

	const handleAddVideo = async () => {
		try {
			const response = await fetch(`/archives/add?name=${encodeURIComponent(newVideo.name)}&url=${encodeURIComponent(newVideo.url)}&camera_id=${encodeURIComponent(newVideo.camera_id)}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
			});

			if (response.ok) {
				message.success('Видео добавлено!');
				const {id} = await response.json();
				console.log(id)
				const addedVideo = {...newVideo, id}
				setVideos([...videos, addedVideo]);
				setIsAddVideoModalVisible(false);
				setNewVideo({ name: '', url: '', camera_id: '' });
			} else {
				message.error('Ошибка добавления видео!');
			}
		} catch (error) {
			console.error('Ошибка добавления видео:', error);
			message.error('Ошибка добавления видео!');
		}
	};

	const handleAddStreet = async () => {
		try {
			const response = await fetch(`streets/add?street_name=${encodeURIComponent(newStreet)}`, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				credentials: 'include',
			});

			if (response.ok) {
				message.success('Улица добавлена!');
				const streetData = await response.json();
				setStreets([...streets, streetData]);
				setIsAddStreetModalVisible(false);
			} else {
				message.error('Ошибка добавления улицы!');
			}
		} catch (error) {
			console.error('Ошибка добавления улицы:', error);
			message.error('Ошибка добавления улицы!');
		}
	};


	return (<>
		<div
			 style={{}}
		>
			<h1>Админ панель</h1>
			<div>
				<Button type="primary" onClick={() => setIsAddVideoModalVisible(true)} style={{marginBottom: 20}}>
					Добавить пользователя
				</Button>
				<Button type="primary" onClick={() => setIsAddVideoModalVisible(true)} style={{marginBottom: 20}}>
					Удалить пользователя
				</Button>
			</div>
			<div>
				<Button type="primary" onClick={() => setIsAddCameraModalVisible(true)} style={{marginBottom: 20}}>
					Добавить камеру
				</Button>
				<Button type="primary" onClick={() => setIsAddVideoModalVisible(true)} style={{marginBottom: 20}}>
					Добавить видео
				</Button>
				<Button type="primary" onClick={() => setIsAddStreetModalVisible(true)} style={{marginBottom: 20}}>
					Добавить улицу
				</Button> {/* Кнопка для добавления улицы */}
			</div>
		</div>


		{/* Модальные окна для добавления камеры и видео */}
		<Modal
			title="Добавить камеру"
			visible={isAddCameraModalVisible}
			onCancel={() => setIsAddCameraModalVisible(false)}
			onOk={handleAddCamera}
		>
			<Form>
				<Form.Item label="Название камеры">
					<Input
						value={newCamera.camera_title}
						onChange={(e) => setNewCamera({...newCamera, camera_title: e.target.value})}
					/>
				</Form.Item>
				<Form.Item label="Улица">
					<Select
						value={newCamera.camera_streetId}
						onChange={(value) => setNewCamera({...newCamera, camera_streetId: value})}
						style={{width: '100%'}}
					>
						{streets.map((street: any) => (
							<Option key={street.id} value={street.id}>{street.name}</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item label="Адрес">
					<Input
						value={newCamera.camera_address}
						onChange={(e) => setNewCamera({...newCamera, camera_address: e.target.value})}
					/>
				</Form.Item>
			</Form>
		</Modal>

		<Modal
			title="Добавить видео"
			visible={isAddVideoModalVisible}
			onCancel={() => setIsAddVideoModalVisible(false)}
			onOk={handleAddVideo}
		>
			<Form>
				<Form.Item label="Название видео">
					<Input
						value={newVideo.name}
						onChange={(e) => setNewVideo({...newVideo, name: e.target.value})}
					/>
				</Form.Item>
				<Form.Item label="URL">
					<Input
						value={newVideo.url}
						onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
					/>
				</Form.Item>
				<Form.Item label="Камера">
					<Select
						value={newVideo.camera_id}
						onChange={(value) => setNewVideo({...newVideo, camera_id: value})}
						style={{width: '100%'}}
					>
						{cameras.map((camera:any) => (
							<Option key={camera.id} value={camera.id}>{camera.title}</Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Modal>

		<Modal
			title="Добавить улицу"
			visible={isAddStreetModalVisible}
			onCancel={() => setIsAddStreetModalVisible(false)}
			onOk={handleAddStreet}
		>
			<Form>
				<Form.Item label="Название улицы">
					<Input
						value={newStreet}
						onChange={(e) => setNewStreet(e.target.value)}
					/>
				</Form.Item>
			</Form>
		</Modal>

	</>)
}