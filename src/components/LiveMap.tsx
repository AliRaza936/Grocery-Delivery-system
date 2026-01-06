import React from "react";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css"
interface Location {
  latitude: number;
  longitude: number;
}
interface IProp {
  userLocation: Location;
  deliveryBoyLocation: Location;
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

  const linePosition = deliveryBoyLocation && userLocation ?[
    [userLocation.latitude,userLocation.longitude],
    [deliveryBoyLocation.latitude,deliveryBoyLocation.longitude]
  ]:[]

  const center = [userLocation.latitude , userLocation.longitude]
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow relative">
      <MapContainer
        center={center as LatLngExpression}
        zoom={13}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[userLocation.latitude,userLocation.longitude]} icon={userIcon}>
            <Popup>delivery address</Popup>
        </Marker>

                        {
                            deliveryBoyLocation && <Marker position={[deliveryBoyLocation.latitude,deliveryBoyLocation.longitude]} icon={deliveryBoyIcon}>

                                 <Popup>delivery boy</Popup>
                            </Marker>
                        }
                        <Polyline positions={linePosition as any} color="green"/>
      </MapContainer>
    </div>
  );
}

export default LiveMap;
