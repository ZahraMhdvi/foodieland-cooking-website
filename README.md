# Foodieland - Dynamic Cooking Website

Foodieland is a modern, fully responsive cooking and recipe website developed as part of the Web Programming course requirement (Academic Year 2026). The project has transitioned from a static multi-page website into a dynamic web application integrated with a remote REST API.


## Features

### 1. Pure Vanilla Tech Stack
- **Zero Frameworks:** Built exclusively using pure **HTML5**, **CSS**, and **Vanilla JavaScript** (ES6+).
- No external UI libraries like Bootstrap, Tailwind, or jQuery were used, ensuring clean, high-performance native rendering.

### 2. API Integration & Dynamic Content
- Fully integrated with a backend REST API using asynchronous `fetch` operations.
- **Dynamic Categories:** Fetches list of categories (names and icons) dynamically on the homepage.
- **Dynamic Nutrition & Details:** Retrieves real-time nutritional facts, blue box info summaries, and descriptions on the Recipe Details page.
- **Interactive Forms:** Connects the **Newsletter Subscription** and **Contact Form** directly to the API endpoints using `POST` requests.

### 3. Advanced UX & Error Handling
- **Robust Try/Catch Blocks:** All API interactions are wrapped in clean error-handling mechanisms to ensure the website never breaks.
- **Free-Tier Server Management:** Displays a customized loading spinner and text alert (*"Waking up the server..."*) to handle the typical 60-second delay caused by free hosting providers (e.g., Render).
- **Interactive UI Components:** Includes feature rich client side logic such as an interactive ingredients checklist, carousel slider, search filtering, and pagination.

### 4. Comprehensive Responsive Design
- Optimized for all viewports including Desktop, Tablet, and Mobile devices (Media queries targeting `900px` and `600px`).
- Includes a dedicated mobile hamburger menu navigation overlay.
