// app/layout.js
import "./globals.css";
import Footer from "./components/footer";
import Header from "./components/header";

export const metadata = {
  title: "NutriPlated",
  description: "Your personal nutrition and recipe guide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header/>
        <div className="conatiner mx-auto min-h-screen">
        {children}
        </div>
        <Footer/>
      </body>
    </html>
  );
}
