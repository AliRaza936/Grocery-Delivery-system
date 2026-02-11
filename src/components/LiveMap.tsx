"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

interface Location {
  latitude: number;
  longitude: number;
}

interface IProp {
  userLocation: Location;
  deliveryBoyLocation: Location;
}


function RoutingMachine({ user, delivery }: { user: Location; delivery: Location }) {
  const map = useMap();
  const routingRef = React.useRef<any>(null);

  useEffect(() => {
    if (!map) return;
    if (
      user.latitude === 0 ||
      user.longitude === 0 ||
      delivery.latitude === 0 ||
      delivery.longitude === 0
    ) return;

    if (routingRef.current) {
      try {
        
        if (routingRef.current._container) {
          map.removeControl(routingRef.current);
        }
      } catch (err) {
        console.log("Previous route removal skipped", err);
      }
    }

    
    routingRef.current = (L as any).Routing.control({
      waypoints: [
        L.latLng(user.latitude, user.longitude),
        L.latLng(delivery.latitude, delivery.longitude),
      ],
      lineOptions: { styles: [{ color: "green", weight: 5 }] },
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      show: false,
      createMarker: () => null, 
      
    }).addTo(map);

    return () => {
      try {
        if (routingRef.current && routingRef.current._container) {
          map.removeControl(routingRef.current);
        }
      } catch (err) {
        console.log("Safe cleanup skipped", err);
      }
    };
  }, [user.latitude, user.longitude, delivery.latitude, delivery.longitude, map]);

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

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden shadow relative">
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={13}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


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
          <RoutingMachine
            user={userLocation}
            delivery={deliveryBoyLocation}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default LiveMap;
