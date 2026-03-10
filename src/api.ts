export default async function fetchCar(stock) {
  try {
    if (!stock) {
      throw new Error("Stock number is required.");
    }

    const res = await fetch(`https://malikautobackend.vercel.app/api/${stock}`);

    if (!res.ok) {
      throw new Error("Failed to fetch vehicle.");
    }

    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    const text = doc.body.textContent || "";

    const getValueAfterLabel = (label) => {
      const elements = Array.from(doc.querySelectorAll("*"));
      const match = elements.find(
        (el) => el.textContent?.trim() === label
      );
      return match?.nextElementSibling?.textContent?.trim() || null;
    };

    // Main vehicle image
    const image =
      doc.querySelector(".main-photo")?.getAttribute("src") || null;

    const carfaxLink =
      Array.from(doc.querySelectorAll("a")).find((a) =>
        a.textContent?.toLowerCase().includes("carfax")
      )?.getAttribute("href") || null;

    const carData = {
      title: doc.querySelector("h1")?.textContent?.trim() || null,
      price: text.match(/\$\d{1,3}(,\d{3})*/)?.[0] || "N/A",
      mileage: text.match(/[\d,]+\s+miles/i)?.[0] || "N/A",
      vin: getValueAfterLabel("VIN"),
      exterior: getValueAfterLabel("Exterior Color"),
      interior: getValueAfterLabel("Interior Color"),
      image,
      carfax: carfaxLink,
    };

    return carData;
  } catch (err) {
    console.error("FetchCar Error:", err.message);
    return null;
  }
}