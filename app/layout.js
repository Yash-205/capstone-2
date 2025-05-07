// app/layout.js
import "./globals.css";
import { FoodProvider } from "./context/FoodContext";


export const metadata = {
  title: "NutriPlated",
  description: "Your personalized recipe guide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FoodProvider>{children}</FoodProvider>
      </body>
    </html>
  );
}
