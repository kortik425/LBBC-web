// src/components/SalvationSwitcher.tsx
import { useState, useEffect } from "react";
import languages from "../data/salvation.json";

export type LangKey = keyof typeof languages;

export default function SalvationSwitcher() {
  // 1. Function to get initial language from URL
  const getInitialLang = (): LangKey => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const langParam = params.get("lang");
      if (langParam && (Object.keys(languages) as LangKey[]).includes(langParam as LangKey)) {
        return langParam as LangKey;
      }
    }
    return "english"; // Default language if none is in the URL
  };

  const [lang, setLang] = useState<LangKey>(getInitialLang());

  // 2. useEffect to update the URL whenever the language changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set("lang", lang);
      window.history.pushState({ path: newUrl.href }, "", newUrl.href);
    }
  }, [lang]);

  return (
    <section className="salvation-switcher">
      <div className="lang-buttons">
        {(Object.keys(languages) as LangKey[]).map((key) => (
          <button
            key={key}
            onClick={() => setLang(key)}
            className={`lang-btn ${lang === key ? "active" : ""}`}
          >
            {key}
          </button>
        ))}
      </div>

      <article className="content">
        <div className="text">
          <h2>{languages[lang].title}</h2>
          <div dangerouslySetInnerHTML={{ __html: languages[lang].text }} />
        </div>
        <div className="video">
          <iframe
            src={languages[lang].video}
            title="Bible way to Heaven video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </article>
    </section>
  );
}