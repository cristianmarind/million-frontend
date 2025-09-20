import { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

const DEFAULT_DEV_IP = "8.8.8.8";
const DEFAULT_DEV_LOCATION = { ip: DEFAULT_DEV_IP, longitude: -122.084, latitude: 37.422 };

let cachedDevIp: string | null = null;
let cachedDevLocation: any | null = null;

export const getLocationFromIP = async (ip: string) => {
  // En dev, si ya tenemos la location cacheada, devolvemos esa
  if (process.env.NODE_ENV === "development" && cachedDevLocation) {
    return cachedDevLocation;
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    console.log({x: process.env.NODE_ENV, data});
    
    if (process.env.NODE_ENV === "development") {
      if (!data.location) {
        cachedDevLocation = DEFAULT_DEV_LOCATION;
        return DEFAULT_DEV_LOCATION;
      }
      cachedDevLocation = data; // Guardamos la primera respuesta
    }

    return data;
  } catch (error) {
    console.error("Error fetching location data:", error);
    return {};
  }
};

export const getDevLocalIP = async (): Promise<string> => {
  if (cachedDevIp) return cachedDevIp;

  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    cachedDevIp = data.ip as string;
    return cachedDevIp;
  } catch (error) {
    console.error("Error obteniendo IP pública:", error);
    cachedDevIp = DEFAULT_DEV_IP; // fallback USA
    return cachedDevIp;
  }
};

export const getUserIP = async (headersList: ReadonlyHeaders): Promise<string> => {
  let ip =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") || "::1"

  if (
    process.env.NODE_ENV === "development" &&
    (ip === "::1" || ip === "127.0.0.1")
  ) {
    ip = await getDevLocalIP();
  }

  return ip;
};