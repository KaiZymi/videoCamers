import {createContext, useState} from "react";

export const CameraContext = createContext<any>(null);

// export const useCameraContext = () => useContext(CameraContext);

export const CameraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [cameras, setCameras] = useState<any[]>([]);
	const [videos, setVideos] = useState<any[]>([]);
	const [streets, setStreets] = useState<any[]>([]);
	const [newCamera, setNewCamera] = useState<{
		camera_title: string;
		camera_streetId: string;
		camera_address: string
	}>({camera_title: '', camera_streetId: '', camera_address: ''});
	const [newVideo, setNewVideo] = useState<{ name: string; url: string; camera_id: string }>({
		name: '',
		url: '',
		camera_id: ''
	});
	const [newStreet, setNewStreet] = useState<string>('');

	const [user,setUser] = useState<any | null>(null);


	return (
		<CameraContext.Provider value={{
			cameras, setCameras,
			newVideo,setNewVideo,
			newCamera, setNewCamera,
			newStreet, setNewStreet,
			streets, setStreets,
			setVideos, videos,
			user,setUser
		}}>
			{children}
		</CameraContext.Provider>
	);
};