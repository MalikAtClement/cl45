import fetchCar from "../../src/api";
import { useEffect, useState } from "vaderjs-native";

export  default function Credit({ params }) {
  const stockNumber = params?.stocknumber || null;

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!stockNumber) return;

    fetchCar(stockNumber).then((c) => {
      setCar(c);
      setLoading(false);
    });
  }, [stockNumber]); // ✅ prevents infinite loop

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const full_name = formData.get("fullName");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const income = Number(formData.get("monthlyIncome"));
    const monthlyDebt = Number(formData.get("monthlyDebt"));
    const down = Number(formData.get("downPayment"));
    const credit = formData.get("creditScoreRange");
    const repos = formData.get("repos");

    if (!car || !car.price) {
      alert("Vehicle data not ready.");
      return;
    }

    const vehiclePrice = Number(car.price.replace(/[^0-9]/g, ""));
    const amountFinanced = vehiclePrice - down;
    const estimatedPayment = amountFinanced * 0.025;

    try {
      const response = await fetch(
        "https://malikautobackend.vercel.app/api/save_approval",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name,
            email,
            phone,
            income,
            monthly_debt: monthlyDebt,
            vehicle_price: vehiclePrice,
            estimated_payment: estimatedPayment,
            credit_score_range: credit,
            repos
          })
        }
      );

      const result = await response.json();

      renderResult({
        status: result.approved ? "approved" : "declined",
        lead_score: result.lead_score,
        estimatedPayment: estimatedPayment.toFixed(0),
        dti: (result.dti * 100).toFixed(1),
        vehiclePrice
      });

    } catch (err) {
      console.error(err);
      alert("Server error.");
    }
  }

  function renderResult(result) {
    const container = document.getElementById("result-container");

    const color =
      result.status === "approved"
        ? "#16a34a"
        : "#dc2626";

    const label =
      result.status === "approved"
        ? "✅ Pre-Approved"
        : "❌ Not Approved";

  container.innerHTML = `
  <div style="padding:20px; text-align:center;">
    <h2 style="color:${color}; font-size:22px; margin-bottom:10px;">
      ${label}
    </h2>

    <div style="
      font-size:14px;
      color:#555;
      line-height:1.8;
      margin-top:10px;
    ">
      <strong>Vehicle:</strong> $${result.vehiclePrice.toLocaleString()}<br/>
      <strong>Est. Payment:</strong> $${result.estimatedPayment}<br/>
      <strong>Projected DTI:</strong> ${result.dti}%<br/>
      <strong>Lead Tier:</strong> ${result.lead_score}
    </div>

    <button 
      style="
        margin-top:20px;
        padding:14px;
        width:100%;
        border:none;
        border-radius:12px;
        background:#16a34a;
        color:white;
        font-weight:700;
        font-size:16px;
      "
      onclick="window.location.href='tel:3140000000'"
    >
      Call Now To Finalize
    </button>
  </div>
`;
  }

  if (loading) {
    return <div style={styles.loading}>Loading vehicle...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div id="result-container">

          {/* VEHICLE DISPLAY SECTION */}
          {car && (
            <div style={styles.vehicleBox}>
              {car.image && (
                <img
                  src={car.image}
                  alt="Vehicle"
                  style={styles.image}
                />
              )}
              <h2 style={styles.carTitle}>{car.title}</h2>
              <p style={styles.price}>{car.price}</p>

              <div style={styles.specs}>
                <div>Mileage: {car.mileage}</div>
                <div>VIN: {car.vin || "N/A"}</div>
                <div>Exterior: {car.exterior || "N/A"}</div>
                <div>Interior: {car.interior || "N/A"}</div>
              </div>
            </div>
          )}

          <h3 style={styles.formTitle}>Vehicle Pre-Qualification</h3>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input style={styles.input} name="fullName" placeholder="Full Name" required />
            <input style={styles.input} type="email" name="email" placeholder="Email Address" required />
            <input style={styles.input} type="tel" name="phone" placeholder="Phone Number" required />

            <input style={styles.input} type="number" name="monthlyIncome" placeholder="Monthly Income ($)" required />
            <input style={styles.input} type="number" name="monthlyDebt" placeholder="Total Monthly Debt ($)" required />
            <input style={styles.input} type="number" name="downPayment" placeholder="Down Payment ($)" required />

            <select style={styles.input} name="creditScoreRange" required>
              <option value="">Estimated Credit Score</option>
              <option>500-550</option>
              <option>550-600</option>
              <option>600-650</option>
              <option>650-700</option>
              <option>700+</option>
            </select>

            <select style={styles.input} name="repos" required>
              <option value="">Recent Repossession?</option>
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>

            <button style={styles.button} type="submit">
              Check My Approval
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

 

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px"
  },
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    padding: "30px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)"
  },
  vehicleBox: {
    marginBottom: "20px",
    textAlign: "center"
  },
  image: {
    width: "100%",
    borderRadius: "12px",
    marginBottom: "15px"
  },
  carTitle: {
    fontSize: "18px",
    fontWeight: "600"
  },
  price: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#2563eb",
    margin: "10px 0"
  },
  specs: {
    fontSize: "13px",
    color: "#555",
    lineHeight: "1.6"
  },
  formTitle: {
    marginTop: "20px",
    marginBottom: "15px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px"
  },
  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "600",
    fontSize: "15px",
    cursor: "pointer"
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: "100px"
  }
};