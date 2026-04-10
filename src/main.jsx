import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ConvexProvider, ConvexReactClient } from "convex/react"
import "./index.css"
import App from "./App"

const convexUrl = import.meta.env.VITE_CONVEX_URL

if (!convexUrl || convexUrl === "REPLACE_WITH_CONVEX_URL") {
  console.warn(
    "⚠️ SikaTrack: VITE_CONVEX_URL not set in .env.local\n" +
    "Run: npx convex dev — then copy the URL to .env.local\n" +
    "The app will not load data until Convex is configured."
  )
}

const convex = new ConvexReactClient(
  convexUrl && convexUrl !== "REPLACE_WITH_CONVEX_URL"
    ? convexUrl
    : "https://example.convex.cloud" // placeholder — will error gracefully
)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexProvider>
  </StrictMode>
)
