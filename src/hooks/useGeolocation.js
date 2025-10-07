import { useState, useEffect } from "react";

const CLINIC_LATITUDE = 3.5645393152493323;
const CLINIC_LONGITUDE = 96.98625848706028;
const MAX_RADIUS_METERS = 50;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
	const R = 6371e3;
	const φ1 = (lat1 * Math.PI) / 180;
	const φ2 = (lat2 * Math.PI) / 180;
	const Δφ = ((lat2 - lat1) * Math.PI) / 180;
	const Δλ = ((lon2 - lon1) * Math.PI) / 180;

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
};

export const useGeolocation = () => {
	const [location, setLocation] = useState({
		loading: true,
		accuracy: null,
		latitude: null,
		longitude: null,
		error: null,
	});
	const [isWithinClinicRadius, setIsWithinClinicRadius] = useState(false);

	useEffect(() => {
		if (!navigator.geolocation) {
			setLocation((prev) => ({
				...prev,
				loading: false,
				error: { message: "Geolocation is not supported by your browser." },
			}));
			return;
		}

		const successHandler = (position) => {
			const { latitude, longitude, accuracy } = position.coords;

			const distance = calculateDistance(
				latitude,
				longitude,
				CLINIC_LATITUDE,
				CLINIC_LONGITUDE
			);

			setLocation({
				loading: false,
				accuracy,
				latitude,
				longitude,
				error: null,
			});

			setIsWithinClinicRadius(distance <= MAX_RADIUS_METERS);
		};

		const errorHandler = (error) => {
			setLocation({
				loading: false,
				accuracy: null,
				latitude: null,
				longitude: null,
				error,
			});
			setIsWithinClinicRadius(false);
		};

		const watcherId = navigator.geolocation.watchPosition(
			successHandler,
			errorHandler,
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 0,
			}
		);

		return () => navigator.geolocation.clearWatch(watcherId);
	}, []);

	return { location, isWithinClinicRadius };
};