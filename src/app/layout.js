import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "FASO | GALLERY",
  description: "An art bidding website for artists and art enthusiasts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link
          rel="stylesheet"
          href={`https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap`}
        />
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
      </head>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  );
}
