import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  lat: number | null;
  lng: number | null;
  error: string | null;
  loading: boolean;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    lat: null,
    lng: null,
    error: null,
    loading: false,
  });

  const requestLocation = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: 'Location permission denied',
        }));
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setState({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        error: null,
        loading: false,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Could not get your location',
      }));
    }
  };

  return { ...state, requestLocation };
};
