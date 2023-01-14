import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [age, setAge] = useState();
  const [gender, setGender] = useState("");
  const [priceMin, setPriceMin] = useState();
  const [priceMax, setPriceMax] = useState();
  const [hobbies, setHobbies] = useState([]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);

    window.scrollTo(0, document.body.scrollHeight);

    try {
      const response = await fetch("/api/generate-gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceMin, priceMax, gender, age, hobbies }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result.replaceAll("\n", "<br />"));
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Head>
        <title>Your Best Valentines Gift</title>
        <link rel="icon" href="/heart.png" />
      </Head>

      <main className={styles.main}>
        <img src="/rose.jpg" className={styles.icon} />
        <h3>Valentines Gift Generator</h3>
        <form onSubmit={onSubmit}>
          {/* Input Start */}
          <label>For whom is the gift for?</label>
          <select
            name="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option name="boyfriend">Boyfriend</option>
            <option name="girlfriend">Girlfriend</option>
          </select>

          <label>Age</label>
          <input
            type="number"
            name="age"
            placeholder="Enter the age"
            value={age}
            onChange={(e) => setAge(Number.parseInt(e.target.value))}
          />

          <label>Price range start (€)</label>
          <input
            type="number"
            min={0}
            name="priceMin"
            placeholder="Enter the minimum price €"
            value={priceMin}
            onChange={(e) => setPriceMin(Number.parseInt(e.target.value))}
          />

          <label>Price range end (€)</label>
          <input
            type="number"
            min={1}
            name="priceMax"
            placeholder="Enter the maximum price €"
            value={priceMax}
            onChange={(e) => setPriceMax(Number.parseInt(e.target.value))}
          />

          <label>Hobbies</label>
          <input
            type="text"
            name="hobbies"
            placeholder="Enter their hobbies"
            value={hobbies}
            onChange={(e) => setHobbies(e.target.value)}
          />

          <input type="submit" value="Generate names" />
        </form>

        {loading && (
          <div className={styles.loadingContainer}>
            <h3>Looking for the most romantic gifts.</h3>
            <img
              className={styles.loading}
              src="https://www.clipartmax.com/png/full/197-1970959_whf-logo-spinner-to-indicate-loading-transparent-loading-heart-gif.png"
            />
          </div>
        )}

        {result && (
          <div
            className={styles.result}
            dangerouslySetInnerHTML={{ __html: result }}
          />
        )}
      </main>
    </div>
  );
}
