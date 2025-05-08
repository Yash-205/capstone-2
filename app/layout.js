// app/layout.js
import "./globals.css";

export const metadata = {
  title: "NutriPlated",
  description: "Your personal nutrition and recipe guide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
