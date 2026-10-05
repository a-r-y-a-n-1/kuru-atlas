# Kuru Atlas (कुरु एटलस)

An interactive, editorial 3D globe charting the canonical places, kingdom capitals, sacred tirthas, and battlefields of the **Mahābhārata**.

🔗 **Repository**: [https://github.com/a-r-y-a-n-1/kuru-atlas](https://github.com/a-r-y-a-n-1/kuru-atlas)

---

## Overview

**Kuru Atlas** blends 3D cartography with literary scholarship:
- **Interactive 3D Globe**: Rendered with Three.js & `globe.gl`, featuring a desaturated dark Earth texture, atmospheric glow, auto-rotation on idle, and intuitive orbit controls.
- **Museum Editorial Aesthetic**: Warm parchment panels, typography pairing Playfair Display with Inter and Cinzel Decorative, and high-contrast, uncluttered cartographic markers.
- **14 Canonical Places**: Chronicling the epic in narrative sequence—from Hastinapura and Ekachakra to Indraprastha, Kurukshetra, and Prabhasa.
- **Disputed / Uncertain Site Badges**: Scholarly discernment highlighting sites with multiple historical or archaeological traditions (e.g., Ekachakra, Virata Nagara).
- **Dynamic Image Caching**: Automated, graceful runtime resolution of Wikipedia/Wikimedia imagery with animated skeleton placeholders and fallback historical engraving illustrations.
- **Interactive Controls**: Side drawer navigation, direct camera flight animation, keyboard hotkeys (`1`-`9`, `Esc`), and full mobile responsive support.

---

## Canonical Sites Included

1. **Hastinapura** – Throne of the Kurus (Meerut, UP)
2. **Khandavaprastha** – The Ancient Forest tract (Delhi / NCR)
3. **Indraprastha** – Jewel Capital of the Pandavas (Purana Qila, Delhi)
4. **Varanavata** – House of Lac / Lakshagriha (Barnawa, UP)
5. **Ekachakra** – Refuge of the Pandavas (*Scholarly identification disputed: Kaushambi / Erach / Ekachakra*)
6. **Kampilya** – Capital of Southern Panchala; Draupadi Swayamvara (Kampil, Farrukhabad, UP)
7. **Dwaraka** – Krishna's Sunken Citadel (Devbhumi Dwarka, Gujarat)
8. **Virata Nagara** – Sanctuary of the 13th Year of Exile (*Disputed: Bairat, Rajasthan*)
9. **Kurukshetra** – The Great War Field (Dharmakshetra, Haryana)
10. **Upaplavya** – War Council of the Pandavas (Matsya Border)
11. **Prabhasa** – Sacred Coastal Tirtha & Yadava Deva-gamana (Somnath, Gujarat)
12. **Taxila (Takshashila)** – Recitation of the Epic by Vaishampayana (Rawalpindi)
13. **Naimisharanya** – Sauti's Recitation before Sage Shaunaka (Sitapur, UP)
14. **Gandhara** – Realm of Shakuni and Queen Gandhari (Peshawar Valley / Kandahar)

---

## Technology Stack

- **Runtime & Build**: [Vite](https://vitejs.dev/) + Vanilla TypeScript / ES Modules
- **3D Visualization**: [globe.gl](https://github.com/vasturiano/globe.gl) + [Three.js](https://threejs.org/)
- **Styling**: Vanilla CSS (Museum editorial design tokens, glassmorphism, responsive drawer)
- **Data Source**: Canonical critical edition references & Open Knowledge APIs

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/a-r-y-a-n-1/kuru-atlas.git

# Navigate into project directory
cd kuru-atlas

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## License

MIT
