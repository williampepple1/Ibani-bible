# Ibani Bible Web App

A modern, responsive web application for reading the Bible in the Ibani language. Built with Next.js and designed for an optimal reading experience across all devices.

## Features

- **Read the Bible in Ibani:** Browse through books, chapters, and verses easily.
- **Modern UI:** A clean, visually pleasing interface prioritizing readability.
- **Responsive Design:** Optimized for mobile, tablet, and desktop viewing.
- **Fast Performance:** Built with Next.js App Router for optimal speed and SEO.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** CSS
- **Data Source:** Local JSON (`data/ibani_bible.json`)
- **Deployment:** Ready for [Vercel](https://vercel.com/)

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Project Structure

- `app/`: Next.js application routes and pages
- `components/`: Reusable React components (Header, Footer, BookCard, VerseDisplay, etc.)
- `data/`: Contains the core `ibani_bible.json` data file
- `lib/`: Helper functions and TypeScript types

## License

This project is open-source and available for use.
