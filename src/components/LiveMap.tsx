import React, { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  latitude: number;
  longitude: number;
}

interface IProp {
  userLocation: Location;
  deliveryBoyLocation: Location;
}

function Recenter({
  user,
  delivery,
}: {
  user: Location;
  delivery: Location;
}) {
  const map = useMap();

  useEffect(() => {
    if (
      user.latitude === 0 ||
      user.longitude === 0 ||
      delivery.latitude === 0 ||
      delivery.longitude === 0
    )
      return;

    const bounds = L.latLngBounds([
      [user.latitude, user.longitude],
      [delivery.latitude, delivery.longitude],
    ]);

    map.fitBounds(bounds, {
      padding: [60, 60],
      animate: true,
    });
  }, [user, delivery, map]);

  return null;
}


function LiveMap({ userLocation, deliveryBoyLocation }: IProp) {
  const deliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9561/9561688.png",
    iconSize: [45, 45],
  });

  const userIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/3477/3477419.png",
    iconSize: [45, 45],
  });

  const hasDelivery =
    deliveryBoyLocation.latitude !== 0 &&
    deliveryBoyLocation.longitude !== 0;

  const linePosition = hasDelivery
    ? [
        [userLocation.latitude, userLocation.longitude],
        [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
      ]
    : [];

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow relative">
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {hasDelivery && (
          <Recenter user={userLocation} delivery={deliveryBoyLocation} />
        )}

        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
          <Popup>Delivery Address</Popup>
        </Marker>


        {hasDelivery && (
          <Marker
            position={[
              deliveryBoyLocation.latitude,
              deliveryBoyLocation.longitude,
            ]}
            icon={deliveryBoyIcon}
          >
            <Popup>Delivery Boy</Popup>
          </Marker>
        )}

        {hasDelivery && (
          <Polyline positions={linePosition as any} color="green" />
        )}
      </MapContainer>
    </div>
  );
}

export default LiveMap;
