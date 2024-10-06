import React, {useEffect, useState} from 'react';
import {Card, Col, Input, Layout, List, Radio, Row, Select, Typography} from 'antd';

const {Content, Sider} = Layout;
const {Title} = Typography;
const {Option} = Select;
const {Search} = Input;

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
	const [selectedVideo, setSelectedVideo] = useState<ArchivesCamera>()
	// const [searchTerm, setSearchTerm] = useState<string>('');

	useEffect(() => {
		// Получение списка всех камер
		fetch('http://10.8.0.3:8081/cameras', {
			method: 'GET',
		})
			.then(response => response.json())
			.then(data => setCameras(data));

		// Получение списка всех улиц
		fetch('http://10.8.0.3:8081/', {
			method: 'GET',
		})
			.then(response => response.json())
			.then(data => setStreets(data));
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

	// Функция фильтрации по названию улицы
	const handleStreetSelect = (streetId: string) => {
		setSelectedStreet(streetId);
		setFilter('street');
	};

	// Обработчик поиска улицы
	const handleSearch = (value: string) => {

		const street = streets.find(s => s.name.toLowerCase().includes(value.toLowerCase()));

		if (street) {
			handleStreetSelect(street.id);
		}
	};

	// Обработчик клика по камере
	const handleCameraClick = (camera: Camera) => {
		// Запрос для получения видеоархива по cameraId
		fetch(`http://10.8.0.3:8081/archives/${camera.id}`)
			.then(response => response.json())
			.then((data: ArchivesCamera[]) => {
				setSelectedCamera(data);
			});
	};

	const handleVideoClick = (video: ArchivesCamera) => {
		setSelectedVideo(video)
	}

	const selectedCameraData = selectedCamera.length > 0
		? cameras.find(camera => camera.id === selectedCamera[0].cameraId)
		: null;


	// @ts-ignore
	return (
		<Layout style={{height: '100vh'}}>
			<Sider width={300} style={{background: '#fff', padding: '20px'}}>
				<Title level={4}>Camera List</Title>

				{/* Фильтрация */}
				<Radio.Group
					value={filter}
					onChange={e => setFilter(e.target.value)}
					style={{marginBottom: 20}}
				>
					<Radio.Button value="all">All</Radio.Button>
					<Radio.Button value="street">Street</Radio.Button>
				</Radio.Group>

				{/* Поиск по названию улицы */}
				<Search
					placeholder="Search by street name"
					onSearch={handleSearch}
					enterButton
					style={{marginBottom: 20}}
				/>

				{/* Выбор улицы */}
				{filter === 'street' && (
					<Select
						showSearch
						placeholder="Select a street"
						style={{width: '100%', marginBottom: 20}}
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
							style={{marginBottom: 10}}
						>
							<Card.Meta
								title={camera.title}
								description={`Address: ${camera.address}`}
							/>
						</Card>
					)}
				/>
			</Sider>

			<Content style={{padding: '20px'}}>
				<Row justify="center" align="middle" style={{height: '100%'}}>
					<Col span={16}>
						{selectedCamera && selectedCamera.length > 0 ? (

							<div>
								{selectedCameraData ? <Title level={3}>{selectedCameraData.title}</Title> :
									<Title level={3}>Камера не найдена</Title>}

								<List
									itemLayout="vertical"
									dataSource={selectedCamera}

									renderItem={(video, index) => (
										<Card
											key={video.id}
											hoverable
											onClick={() => handleVideoClick(video)}
											style={{marginBottom: 10}}
										>
											<Card.Meta
												title={`Камера ${index}`}
												description={`Камера ${index}`}
											/>
										</Card>
									)}
								/>
								{selectedVideo ?
									<video
										controls
										width="100%"
										height="450px"
										src={selectedVideo.url}
									>
										Your browser does not support the video tag.
									</video> : ''}

							</div>
						) : (
							<Title level={4}>Please select a camera from the list</Title>
						)}
					</Col>
				</Row>
			</Content>
		</Layout>
	)
		;
};

export default CameraApp;
