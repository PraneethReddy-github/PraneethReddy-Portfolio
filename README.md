# Praneeth's Portfolio - Ubuntu Desktop Theme

A personal portfolio website designed as an Ubuntu 20.04 desktop experience, built with **Next.js** and **Tailwind CSS**.

## 🖥️ Features

- Ubuntu 20.04 desktop simulation
- Interactive terminal with personal commands (`cd`, `ls`, `whoami`, `about-praneeth`, etc.)
- Draggable, resizable windows
- Lock screen, boot screen, and shutdown simulation
- About Me, Education, Skills, Projects, Resume sections
- Contact form via EmailJS
- Wallpaper settings
- Chrome browser, Spotify, VSCode, Calculator apps

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- yarn or npm

### Install Dependencies

```bash
yarn install
# or
npm install
```

### Configure Environment Variables (EmailJS)

To make the Contact Me application functional, configure EmailJS credentials in a `.env.local` file in the root of your project:

```bash
NEXT_PUBLIC_USER_ID="YOUR_EMAILJS_PUBLIC_KEY"
NEXT_PUBLIC_SERVICE_ID="YOUR_EMAILJS_SERVICE_ID"
NEXT_PUBLIC_TEMPLATE_ID="YOUR_EMAILJS_TEMPLATE_ID"
```

Refer to the EmailJS documentation to retrieve these keys from your console dashboard.

### Run Development Server

```bash
yarn dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
yarn build
yarn start
```

## 🎨 Tech Stack

- **Framework**: Next.js 13
- **Styling**: Tailwind CSS 3
- **Language**: JavaScript (React 18)
- **Email**: EmailJS
- **Analytics**: Google Analytics 4 (react-ga4)

## 📧 Contact

- **GitHub**: [github.com/praneeth-rdy](https://github.com/praneeth-rdy)
- **LinkedIn**: [linkedin.com/in/praneeth-rdy](https://linkedin.com/in/praneeth-rdy)

## 🙏 Acknowledgements

This portfolio is inspired by [vivek9patel/vivek9patel.github.io](https://github.com/vivek9patel/vivek9patel.github.io). The Ubuntu desktop theme, CSS, and architecture are based on that project. All content has been updated to reflect Praneeth Reddy's personal information and projects.

## 📄 License

MIT
