"use client";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Hero from '../components/Hero'
import {Recentjobs} from '../components/Recentjobs'
import {Goodlife} from '../components/Goodlife'
import {Testimonials} from '../components/Testimonials'
import {Categorie} from '../components/Categorie'
import {Footer} from '../components/Footer'
export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[96vh] w-full">
      {/* Background Image */}
<Image
  src="/hero.webp"
  alt="Hero Image"
  fill
  className="object-cover"
  priority
/>

{/* Dark Overlay */}
<div className="absolute inset-0 bg-black/85 z-10"></div>

{/* Navbar */}
<div className="absolute top-0 left-0 w-full z-50">
  <Navbar />
</div>

{/* Hero Content */}
<div className="relative z-20">
  <Hero />
</div>
{/* Recent Jobs */}
<div className="relative z-20">
  <Recentjobs />
</div>
{/* Categories */}
<div className="relative z-20" >
  <Categorie/>
</div>
{/* Good Life Section  */}
<div className="relative z-20">
  <Goodlife />
</div>
{/* Testimonials */}
<div className="relative z-20">
  <Testimonials />
</div>
{/* Footer  */}
<div className="relative z-20">
  <Footer />
</div>
      </div>
    </>
  );
}
