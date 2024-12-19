import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Drawer, Layout, List, message, Radio, Select, Typography} from 'antd';
import {useNavigate} from 'react-router-dom';
import {api} from "../../helpers/api";
import {CameraContext} from "../../context/CameraContext";


const {Content, Sider} = Layout;
const {Title} = Typography;


const CameraApp: React.FC = () => {
	// const [user, setUser] = useState<any | null>(null);
	const [filter, setFilter] = useState<'all' | 'street'>('all');
	const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
	const [filteredCameras, setFilteredCameras] = useState<any[]>([]);
	const [selectedCamera, setSelectedCamera] = useState<any | null>(null);
	const [isDrawerVisible, setIsDrawerVisible] = useState(false);
	const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

	const {
		cameras, setCameras,
		streets, setStreets,
		setVideos, videos,
		user
	} = useContext(CameraContext)

	useEffect(() => {

		const fetchData = async () => {
			try {
				const [cameraData, streetData, videoData] = await Promise.all([
					api.fetchCameras(),
					api.fetchStreets(),
					api.fetchVideos(),
				]);
				setCameras(cameraData);
				setStreets(streetData);
				setVideos(videoData);
			} catch (error) {
				console.error('Ошибка загрузки данных:', error);
			}
		};
		fetchData();
	}, [setCameras, setStreets, setVideos]);




	const navigate = useNavigate();



	useEffect(() => {
		console.log('11')
		if (filter === 'street' && selectedStreet) {
			const filtered = cameras.filter((camera: any) => camera.streetId === selectedStreet);
			setFilteredCameras(filtered);
		} else if (filter === 'street' && !selectedStreet) {
			setFilteredCameras(cameras); // Show all cameras if no street is selected
		} else {
			setFilteredCameras(cameras);
		}
	}, [filter, selectedStreet, cameras]);

	const handleLogout = async () => {
		try {
			await fetch(`/logout`, {
				method: 'POST',
				credentials: 'include',
			});

			message.success('Вы успешно вышли из системы.');
			navigate('/login');
		} catch (error) {
			console.error('Ошибка при выходе:', error);
			message.error('Не удалось выйти из системы.');
		}
	};

	const handleDeleteVideo = async (videoId: string) => {
		try {
			const response = await fetch(`/archives/delete/${encodeURIComponent(videoId)}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				message.success('Видео удалено успешно!');
				setVideos(videos.filter((video: any) => video.id !== videoId));
				setSelectedVideo(null)
			} else {
				message.error('Ошибка удаления видео!');
			}
		} catch (error) {
			console.error('Ошибка удаления видео:', error);
			message.error('Ошибка удаления видео!');
		}
	};

	const handleDeleteCamera = async (cameraId: string) => {
		try {
			const response = await fetch(`/cameras/delete/${cameraId}`, {
				method: 'DELETE',
				credentials: 'include',
			});

			if (response.ok) {
				message.success('Камера удалена успешно!');
				setCameras(cameras.filter((camera: any) => camera.id !== cameraId));
				setSelectedCamera(null)
			} else {
				message.error('Ошибка удаления камеры!');
			}
		} catch (error) {
			console.error('Ошибка удаления камеры:', error);
			message.error('Ошибка удаления камеры!');
		}
	};


	const openVideoDrawer = (camera: any) => {
		setSelectedCamera(camera);
		setIsDrawerVisible(true);
	};

	const closeDrawer = () => {
		setIsDrawerVisible(false);
		setSelectedCamera(null);
	};

	// Для каждой камеры проверим, есть ли у нее видео
	const getCameraVideos = (cameraId: string) => {
		return videos.filter((video: any) => video.cameraId === cameraId);
	};


	return (
		<Layout style={{height: '100vh'}}>
			<Sider width={300} style={{background: '#fff', padding: '20px'}}>
				<div style={{display: 'flex', gap: '10px'}}>
					<Button type="link" onClick={handleLogout} style={{border: "1px solid gray"}}>
						Выйти
					</Button>
					{user.role === 'admin' && (
						<Button type="link" onClick={() => {
							navigate('/admin',);
						}} style={{border: "1px solid gray"}}>
							Админ панель

						</Button>)
					}

				</div>

				<Title level={4}>{filter === 'all' ? 'Список видео' : 'Список камер'}</Title>
				<Radio.Group value={filter} onChange={(e) => setFilter(e.target.value)} style={{marginBottom: 20}}>
					<Radio.Button value="all">Все</Radio.Button>
					<Radio.Button value="street">Улица</Radio.Button>
				</Radio.Group>


				{filter === 'all' ? (
					<List
						itemLayout="vertical"
						dataSource={videos}
						renderItem={(video: any) => (
							<Card key={video.id} hoverable onClick={() => setSelectedVideo(video)}
								  style={{marginBottom: 10, border: "1px solid #dec8e3"}}>
								<Card.Meta title={`Видео: ${video.name.toLowerCase()}`}/>
								{user?.role === 'admin' && (
									<Button
										danger
										style={{marginTop: 10}}
										onClick={() => handleDeleteVideo(video.id)}
									>
										Удалить
									</Button>
								)}
							</Card>
						)}
					/>
				) : (
					<>

						<Select
							showSearch
							placeholder="Поиск или выбор улицы"
							style={{width: '100%', marginBottom: 20}}
							value={selectedStreet}
							onChange={(value) => setSelectedStreet(value)} // Устанавливает выбранную улицу

							filterOption={(input, option) => {
								// Явное приведение типа для label, чтобы TypeScript знал, что это строка
								const label = option?.label as string;
								return label?.toLowerCase().includes(input.toLowerCase());
							}}
							allowClear // Добавляет кнопку очистки выбранного значения
							options={streets.map((street: any) => ({
								value: street.id,
								label: street.name,
							}))}
						>

						</Select>

						<List
							itemLayout="vertical"
							dataSource={filteredCameras}
							renderItem={(camera) => {
								// Проверяем, есть ли видео для камеры
								const cameraVideos = getCameraVideos(camera.id);

								return (
									<Card
										key={camera.id}
										hoverable
										style={{marginBottom: 10, border: "1px solid #dec8e3"}}
										onClick={() => openVideoDrawer(camera)}
									>
										<Card.Meta title={camera.title} description={`Адрес: ${camera.address}`}/>
										{cameraVideos.length === 0 && user?.role === 'admin' && (
											<Button
												danger
												style={{marginTop: 10, width: "100px"}}
												onClick={() => handleDeleteCamera(camera.id)}
											>
												Удалить
											</Button>
										)}
									</Card>
								);
							}}
						/>
					</>
				)}
			</Sider>

			<Content style={{padding: '20px'}}>
				{selectedVideo ? (
					<video controls width="100%" height="550px" src={selectedVideo.url}>
						Ваш браузер не поддерживает видео.
					</video>
				) : (
					<Title level={4}>Выберите видео для просмотра</Title>
				)}
			</Content>


			{/* Drawer для видео, связанных с камерой */}
			<Drawer
				title={`Видео с камеры: ${selectedCamera?.title}`}
				visible={isDrawerVisible}
				onClose={closeDrawer}
				width={400}
			>
				<List
					itemLayout="vertical"
					dataSource={getCameraVideos(selectedCamera?.id)}
					renderItem={(video: any) => (
						<Card key={video.id} hoverable onClick={() => {
							setIsDrawerVisible(false)
							setSelectedVideo(video)
						}} style={{marginBottom: 10, border: "1px solid #dec8e3"}}>
							<Card.Meta title={video.name}/>
							{user?.role === 'admin' && (
								<Button
									danger
									style={{marginTop: 10}}
									onClick={() => handleDeleteVideo(video.id)}
								>
									Удалить
								</Button>
							)}
						</Card>
					)}
				/>
			</Drawer>
		</Layout>
	);
};

export default CameraApp;
