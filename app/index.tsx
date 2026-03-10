import * as Vader from "vaderjs-native";
import { useState } from "vaderjs-native";

export default function Main() {
  const [stock, setStock] = useState("");
  const [car, setCar] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCar = async () => {
    if (!stock) return;

    setLoading(true);
    setError("");
    setCar(null);

    try {
      const res = await fetch(
        `https://malikautobackend.vercel.app/api/${stock}`
      );

      const html = await res.text();
      const doc = new DOMParser().parseFromString(html, "text/html");

      const text = doc.body.textContent || "";

      const getValueAfterLabel = (label: string) => {
        const elements = Array.from(doc.querySelectorAll("*"));
        const match = elements.find(el =>
          el.textContent?.trim() === label
        );
        return match?.nextElementSibling?.textContent?.trim() || null;
      };

      // Grab main vehicle image
      const image = doc.querySelector(".main-photo")?.getAttribute("src") || null;

      const carfaxLink = Array.from(doc.querySelectorAll("a")).find(a =>
        a.textContent?.toLowerCase().includes("carfax")
      )?.getAttribute("href");

      const carData = {
        title: doc.querySelector("h1")?.textContent?.trim(),
        price: text.match(/\$\d{1,3}(,\d{3})*/)?.[0] || "N/A",
        mileage: text.match(/[\d,]+\s+miles/)?.[0] || "N/A",
        vin: getValueAfterLabel("VIN"),
        exterior: getValueAfterLabel("Exterior Color"),
        interior: getValueAfterLabel("Interior Color"),
        image,
        carfax: carfaxLink
      };

      setCar(carData);
    } catch (err) {
      setError("Vehicle not found or failed to fetch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchCard}>
        <h2 style={styles.heading}>Inventory Lookup</h2>

        <div style={styles.searchRow}>
          <input
            placeholder="Enter Stock # (ex: C19188D)"
            value={stock}
            onInput={(e: any) => setStock(e.target.value)}
            style={styles.input}
          />
          <button onClick={fetchCar} style={styles.button}>
            Search
          </button>
        </div>

        {loading && <p>Loading vehicle...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {car && (
        <div style={styles.card}>
          {car.image && (
            <img
              src={car.image}
              style={styles.image}
            />
          )}

          <h1 style={styles.title}>{car.title}</h1>

          <div style={styles.price}>{car.price}</div>

          <div style={styles.grid}>
            <Info label="Mileage" value={car.mileage} />
            <Info label="VIN" value={car.vin} />
            <Info label="Exterior" value={car.exterior} />
            <Info label="Interior" value={car.interior} />
          </div>

          {car.carfax && (
            <a
              href={car.carfax}
              target="_blank"
              style={styles.carfaxButton}
            >
              View CarFax
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div style={styles.infoBox}>
      <div style={styles.infoLabel}>{label}</div>
      <div style={styles.infoValue}>{value || "—"}</div>
    </div>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    background: "#f4f6f9",
    padding: 20,
    fontFamily: "Arial"
  },
  searchCard: {
    background: "white",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
  },
  heading: {
    marginBottom: 15
  },
  searchRow: {
    display: "flex",
    gap: 10
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 18px",
    borderRadius: 6,
    border: "none",
    background: "#0066ff",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },
  card: {
    background: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },
  image: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 15
  },
  title: {
    fontSize: 24,
    fontWeight: "bold"
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0a7f2e",
    marginBottom: 15
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 20
  },
  infoBox: {
    background: "#f1f3f6",
    padding: 10,
    borderRadius: 8
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.6
  },
  infoValue: {
    fontWeight: "bold"
  },
  carfaxButton: {
    display: "block",
    textAlign: "center",
    padding: 12,
    background: "#111",
    color: "white",
    borderRadius: 8,
    textDecoration: "none"
  }
};