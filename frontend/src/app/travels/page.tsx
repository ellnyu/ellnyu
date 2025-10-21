"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.scss";
import "leaflet/dist/leaflet.css";
import type { Icon } from "leaflet";
import Papa from "papaparse";

import { authPost, apiGet } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";
import { snakeToCamel, camelToSnake } from "@/utils/caseHelpers";
import { toIsoDateTime } from "@/utils/dateHelpers";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface Country {
  code: string;
  name: string;
}

interface Travel {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
  travelDate: string; // YYYY-MM
}

interface TravelResponse {
  id: number;
  location: string;
  latitude: number;
  longitude: number;
}

export default function TravelsPage() {
  const { isAdmin } = useAuth();
  const [travels, setTravels] = useState<Travel[]>([]);
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);

  const [customIcon, setCustomIcon] = useState<Icon | null>(null);

  // Load custom icon
  useEffect(() => {
    if (typeof window === "undefined") return;

    import("leaflet").then((L) => {
      const icon = new L.Icon({
        iconUrl: "/images/location.png",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
      setCustomIcon(icon);
    });

    // Fix default Leaflet marker icon paths
    import("leaflet").then((L) => {
      import("leaflet/dist/images/marker-icon-2x.png").then((icon2x) => {
        import("leaflet/dist/images/marker-icon.png").then((icon) => {
          import("leaflet/dist/images/marker-shadow.png").then((shadow) => {
            L.Icon.Default.mergeOptions({
              iconRetinaUrl: icon2x.default,
              iconUrl: icon.default,
              shadowUrl: shadow.default,
            });
          });
        });
      });
    });
  }, []);

  // Load countries CSV
  useEffect(() => {
    fetch("/countries.csv")
      .then((res) => res.text())
      .then((csvText) => {
        const parsed: Country[] = csvText
          .trim()
          .split("\n")
          .map((line) => {
            const [code, name] = line.split(",");
            return { code: code.trim(), name: name.trim() };
          });
        setCountries(parsed);
      })
      .catch((err) => console.error("Failed to load countries:", err));
  }, []);

  // Fetch travels
  const fetchTravels = async () => {
    try {
      const data: Travel[] = await apiGet("/travels");
      const camelTravels = snakeToCamel<Travel[]>(data);
      setTravels(camelTravels);
    } catch (err) {
      console.error("Failed to fetch travels", err);
    }
  };

  useEffect(() => {
    fetchTravels();
  }, []);

  // Submit new travel
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = camelToSnake({
        location,
        country,
        travelDate: toIsoDateTime(travelDate), // convert YYYY-MM to SQL timestamp
      });

      const res = await authPost<TravelResponse>("/travels", payload);

      const newTravel: Travel = {
        id: res.id,
        location: res.location,
        latitude: res.latitude,
        longitude: res.longitude,
        travelDate,
      };

      setTravels((prev) => [...prev, newTravel]);

      setLocation("");
      setCountry("");
      setTravelDate("");
    } catch (err) {
      console.error("Error submitting travel:", err);
    }
  };

  return (
    <div className={styles.appLayout}>
      <main className={styles.mainContent}>
        <h2>Mine reiser</h2>
        <p className={styles.paragraph}>Fullstendig ukomplett side og liste, og den er ikke laget for å skryte eller noe. Isåfall kan du tolke hele nettsida mi som skryt men det er absolutt ikke poenget,
          og jeg vet at vet å kommentere å si at det ikke er poenget så blir det på en måte poenget men det må være grenser. Jeg ville bare leke litt okeey...?
        </p>

        <div className={styles.mapContainer}>
          <MapContainer center={[20, 0]} zoom={2} style={{ height: "500px", width: "100%" }}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
            />
            {travels.map((t) => (
              <Marker key={t.id} position={[t.latitude, t.longitude]} icon={customIcon || undefined}>
                <Popup>
                  <strong>{t.location}</strong>
                  <br />
                  {t.travelDate}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {isAdmin && (
          <form className={styles.travelForm} onSubmit={handleSubmit}>
            <h3>Legg til en ny reise</h3>
            <div>
              <label>Sted</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="country">Land</label>
              <select
                id="country"
                className={styles.select}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Velg et land</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Dato (år-måned)</label>
              <input type="month" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} required />
            </div>
            <button type="submit">Legg til reise</button>
          </form>
        )}
      </main>
    </div>
  );
}

