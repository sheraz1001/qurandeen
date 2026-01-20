import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroAnimated from '../components/HeroAnimated';
import './QiblaDirection.css';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export default function QiblaDirection() {
  const [location, setLocation] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasCompass, setHasCompass] = useState(false);
  const [distance, setDistance] = useState(null);
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');

  useEffect(() => {
    const savedLocation = localStorage.getItem('prayerLocation');
    if (savedLocation) {
      const loc = JSON.parse(savedLocation);
      if (loc.lat && loc.lng) {
        setLocation(loc);
        setLocationName(loc.name || '');
        calculateQibla(loc.lat, loc.lng);
      } else {
        getLocation();
      }
    } else {
      getLocation();
    }

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        setHasCompass(true);
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
        setHasCompass(true);
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const handleOrientation = (event) => {
    if (event.webkitCompassHeading) {
      setCompassHeading(event.webkitCompassHeading);
    } else if (event.alpha) {
      setCompassHeading(360 - event.alpha);
    }
  };

  const requestCompassPermission = async () => {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } catch (err) {
        console.error('Compass permission denied:', err);
      }
    }
  };

  const getLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const loc = { lat: latitude, lng: longitude };
          
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await response.json();
            loc.name = `${data.city || data.locality}, ${data.countryName}`;
            setLocationName(loc.name);
          } catch (e) {
            loc.name = 'Your Location';
            setLocationName(loc.name);
          }
          
          setLocation(loc);
          localStorage.setItem('prayerLocation', JSON.stringify(loc));
          calculateQibla(latitude, longitude);
          setLoading(false);
        },
        (err) => {
          setError('Location access denied. Please enter your city manually or enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  const calculateQibla = (lat, lng) => {
    const lat1 = (lat * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;
    const lngDiff = ((KAABA_LNG - lng) * Math.PI) / 180;

    const y = Math.sin(lngDiff);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(lngDiff);
    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    
    if (qibla < 0) qibla += 360;
    
    setQiblaDirection(qibla);
    
    const R = 6371;
    const dLat = lat2 - lat1;
    const dLon = lngDiff;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    setDistance(Math.round(R * c));
  };

  const handleManualLocation = async (e) => {
    e.preventDefault();
    if (!manualCity || !manualCountry) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(manualCity)}&count=1`
      );
      const geoData = await geoResponse.json();
      
      if (geoData.results && geoData.results.length > 0) {
        const { latitude, longitude } = geoData.results[0];
        const loc = { 
          lat: latitude, 
          lng: longitude, 
          city: manualCity, 
          country: manualCountry,
          name: `${manualCity}, ${manualCountry}` 
        };
        setLocation(loc);
        setLocationName(loc.name);
        localStorage.setItem('prayerLocation', JSON.stringify(loc));
        calculateQibla(latitude, longitude);
      } else {
        setError('City not found. Please try a different city name.');
      }
    } catch (err) {
      setError('Failed to find location. Please try again.');
    }
    
    setLoading(false);
  };

  const getCardinalDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const breadcrumbs = [
    { name: 'Home', href: '/' },
    { name: 'Islamic Resources', href: '/islamic-resources' },
    { name: 'Qibla Direction' }
  ];

  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "Qibla Direction Finder - QuranDeen",
      "description": "Find the accurate Qibla direction from any location worldwide. Features compass integration and distance to Kaaba calculation.",
      "url": "https://qurandeen.com/islamic-resources/qibla-direction",
      "applicationCategory": "ReligiousApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ];

  const needleRotation = qiblaDirection !== null ? qiblaDirection - compassHeading : 0;

  return (
    <div className="qibla-page">
      <SEO
        title="Qibla Direction Finder - Find Kaaba Direction | QuranDeen"
        description="Find the accurate Qibla direction from any location worldwide. Uses GPS and compass to point you towards the Kaaba in Mecca for prayer."
        keywords="qibla direction, qibla finder, kaaba direction, prayer direction, mecca direction, qibla compass"
        url="https://qurandeen.com/islamic-resources/qibla-direction"
        schema={schema}
      />

      <HeroAnimated
        icon="🧭"
        title="Qibla Direction"
        subtitle="Find the direction of the Kaaba from your location"
        breadcrumbs={breadcrumbs}
      />

      <div className="qibla-container">
        {error && !location && (
          <div className="location-form-card">
            <h3>Enter Your Location</h3>
            <p>{error}</p>
            <form onSubmit={handleManualLocation}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="City (e.g., London)"
                  value={manualCity}
                  onChange={(e) => setManualCity(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Country (e.g., UK)"
                  value={manualCountry}
                  onChange={(e) => setManualCountry(e.target.value)}
                  required
                />
                <button type="submit" className="btn-primary">Find Qibla</button>
              </div>
            </form>
            <button onClick={getLocation} className="btn-secondary">
              <span>📍</span> Try Location Again
            </button>
          </div>
        )}

        {loading && !qiblaDirection && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Finding Qibla direction...</p>
          </div>
        )}

        {qiblaDirection !== null && (
          <>
            <div className="location-header">
              <div className="location-info">
                <span className="location-icon">📍</span>
                <span className="location-name">{locationName}</span>
                <button onClick={getLocation} className="refresh-btn" title="Refresh Location">
                  🔄
                </button>
              </div>
            </div>

            <div className="compass-section">
              <div className="compass-container">
                <div className="compass-ring" style={{ transform: `rotate(${-compassHeading}deg)` }}>
                  <div className="compass-marks">
                    {[...Array(72)].map((_, i) => (
                      <div
                        key={i}
                        className={`compass-mark ${i % 9 === 0 ? 'major' : ''}`}
                        style={{ transform: `rotate(${i * 5}deg)` }}
                      />
                    ))}
                  </div>
                  <div className="cardinal-points">
                    <span className="cardinal n">N</span>
                    <span className="cardinal e">E</span>
                    <span className="cardinal s">S</span>
                    <span className="cardinal w">W</span>
                  </div>
                </div>
                <div className="qibla-needle" style={{ transform: `rotate(${needleRotation}deg)` }}>
                  <div className="needle-arrow">
                    <span className="kaaba-icon">🕋</span>
                  </div>
                </div>
                <div className="compass-center">
                  <div className="degree-display">{Math.round(qiblaDirection)}°</div>
                  <div className="cardinal-display">{getCardinalDirection(qiblaDirection)}</div>
                </div>
              </div>

              {hasCompass && typeof DeviceOrientationEvent.requestPermission === 'function' && (
                <button onClick={requestCompassPermission} className="enable-compass-btn">
                  Enable Compass
                </button>
              )}
            </div>

            <div className="qibla-info-cards">
              <div className="info-card">
                <div className="info-icon">🕋</div>
                <div className="info-content">
                  <div className="info-label">Qibla Direction</div>
                  <div className="info-value">{Math.round(qiblaDirection)}° {getCardinalDirection(qiblaDirection)}</div>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">📏</div>
                <div className="info-content">
                  <div className="info-label">Distance to Kaaba</div>
                  <div className="info-value">{distance?.toLocaleString()} km</div>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">🌍</div>
                <div className="info-content">
                  <div className="info-label">Your Coordinates</div>
                  <div className="info-value">{location?.lat?.toFixed(4)}°, {location?.lng?.toFixed(4)}°</div>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">🕌</div>
                <div className="info-content">
                  <div className="info-label">Kaaba Coordinates</div>
                  <div className="info-value">{KAABA_LAT}°, {KAABA_LNG}°</div>
                </div>
              </div>
            </div>

            <div className="qibla-instructions">
              <h3>How to Use</h3>
              <ol>
                <li>Hold your device flat and parallel to the ground</li>
                <li>The Kaaba icon (🕋) points towards the Qibla direction</li>
                <li>On mobile devices, the compass will rotate as you turn</li>
                <li>On desktop, use the degree reading to find the direction manually</li>
              </ol>
            </div>

            <div className="quick-links">
              <Link to="/islamic-resources/prayer-times" className="quick-link-card">
                <span className="icon">🕌</span>
                <span>Prayer Times</span>
              </Link>
              <Link to="/islamic-resources/ramadan-calendar" className="quick-link-card">
                <span className="icon">🌙</span>
                <span>Ramadan Calendar</span>
              </Link>
              <Link to="/azkaar" className="quick-link-card">
                <span className="icon">📿</span>
                <span>Daily Duas</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
