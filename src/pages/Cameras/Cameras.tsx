import React, {useEffect, useState} from 'react';
import {Card, Col, Input, Layout, List, Radio, Row, Select, Typography} from 'antd';

const {Content, Sider} = Layout;
const {Title} = Typography;
const {Option} = Select;
const {Search} = Input;
// http://10.8.0.1:8000
// http://10.8.0.3:8081
const BASE_URL = "http://10.8.0.1:8000"


type Camera = {
	id: string;
	title: string;
	address: string; // Адрес камеры
	streetId: string;
	videoSrc: string; // Путь к видео
};

type Street = {
	id: string;
	name: string;
};

type ArchivesCamera = {
	id: string;
	url: string;
	cameraId: string;
};

const CameraApp: React.FC = () => {
	const [cameras, setCameras] = useState<Camera[]>([]);
	const [streets, setStreets] = useState<Street[]>([]);
	const [selectedCamera, setSelectedCamera] = useState<ArchivesCamera[]>([]);
	const [filter, setFilter] = useState<'all' | 'street'>('all');
	const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
	const [filteredCameras, setFilteredCameras] = useState<Camera[]>([]);
	const [selectedVideo, setSelectedVideo] = useState<ArchivesCamera | null>(null);

	useEffect(() => {
		// Получение списка всех камер
		const fetchCameras = async () => {
			try {
				const response = await fetch(`${BASE_URL}/cameras`);
				const data = await response.json();
				setCameras(data);
			} catch (error) {
				console.error("Ошибка загрузки камер:", error);
			}
		};

		// Получение списка всех улиц
		const fetchStreets = async () => {
			try {
				const response = await fetch(`${BASE_URL}/`);
				const data = await response.json();
				setStreets(data);
			} catch (error) {
				console.error("Ошибка загрузки улиц:", error);
			}
		};

		fetchCameras();
		fetchStreets();
	}, []);

	useEffect(() => {
		// Фильтрация камер при изменении фильтра или выбранной улицы
		if (filter === 'street' && selectedStreet) {
			const filtered = cameras.filter(camera => camera.streetId === selectedStreet);
			setFilteredCameras(filtered);
		} else {
			setFilteredCameras(cameras);
		}
	}, [filter, selectedStreet, cameras]);

	const handleStreetSelect = (streetId: string) => {
		setSelectedStreet(streetId);
		setFilter('street');
	};

	const handleSearch = (value: string) => {
		const street = streets.find(s => s.name.toLowerCase().includes(value.toLowerCase()));
		if (street) {
			handleStreetSelect(street.id);
		}
	};

	const handleCameraClick = async (camera: Camera) => {
		try {
			const response = await fetch(`${BASE_URL}/archives/${camera.id}`);
			const data = await response.json();
			setSelectedCamera(data);
			setSelectedVideo(null); // Сброс выбранного видео при смене камеры
			console.log("Загруженные данные по камере:", data);
		} catch (error) {
			console.error("Ошибка загрузки данных камеры:", error);
		}
	};

	const handleVideoClick = (video: ArchivesCamera) => {
		setSelectedVideo(video);
		console.log("Выбрано видео:", video);
	};

	const selectedCameraData = selectedCamera.length > 0
		? cameras.find(camera => camera.id === selectedCamera[0].cameraId)
		: null;

	return (
		<Layout style={{ height: '100vh' }}>
			<Sider width={300} style={{ background: '#fff', padding: '20px' }}>
				<Title level={4}>Список камер</Title>

				{/* Фильтрация */}
				<Radio.Group
					value={filter}
					onChange={e => setFilter(e.target.value)}
					style={{ marginBottom: 20 }}
				>
					<Radio.Button value="all">Все</Radio.Button>
					<Radio.Button value="street">Улица</Radio.Button>
				</Radio.Group>

				{/* Поиск по названию улицы */}
				<Search
					placeholder="Поиск по названию улицы"
					onSearch={handleSearch}
					enterButton
					style={{ marginBottom: 20 }}
				/>

				{/* Выбор улицы */}
				{filter === 'street' && (
					<Select
						showSearch
						placeholder="Выберите улицу"
						style={{ width: '100%', marginBottom: 20 }}
						onChange={handleStreetSelect}
					>
						{streets.map(street => (
							<Option key={street.id} value={street.id}>
								{street.name}
							</Option>
						))}
					</Select>
				)}

				{/* Список камер */}
				<List
					itemLayout="vertical"
					dataSource={filteredCameras}
					renderItem={(camera) => (
						<Card
							key={camera.id}
							hoverable
							onClick={() => handleCameraClick(camera)}
							style={{ marginBottom: 10 }}
						>
							<Card.Meta
								title={camera.title}
								description={`Адрес: ${camera.address}`}
							/>
						</Card>
					)}
				/>
			</Sider>
			{/*justify="center" align="middle"*/}
			<Content>
				<Row style={{ height: '100%' }}>
					<Col span={6}>
						{selectedCamera.length > 0 ? (
							<Sider width={300} style={{ background: '#fff', padding: '20px', height: '100%' }}>
								{selectedCameraData ? <Title level={5}>{selectedCameraData.title}</Title> :
									<Title level={3}>Камера не найдена</Title>}

								<List
									itemLayout="vertical"
									dataSource={selectedCamera}
									renderItem={(video, index) => (
										<Card
											key={video.id}
											hoverable
											onClick={() => handleVideoClick(video)}
											style={{ marginBottom: 10 }}
										>
											<Card.Meta
												title={`Видео ${index + 1}`}
												description={`Видео ${index + 1}`}
											/>
										</Card>
									)}
								/>
							</Sider>
						): ""}

					</Col>
					<Col span={16} style={{alignContent: "center"}}>
						{selectedCamera.length > 0 ? (
							<div>
								{selectedVideo && (
									<video
										controls
										width="100%"
										height="550px"
										src={selectedVideo.url}
										style={{ border: '1px solid #E4E4E4' }}
									>
										Ваш браузер не поддерживает тег video.
									</video>
								)}
							</div>
						) : (
							<Title level={4}>Пожалуйста, выберите камеру из списка</Title>
						)}

					</Col>
				</Row>
			</Content>
		</Layout>
	);
};

export default CameraApp;