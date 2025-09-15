'use client'

import ProductCard from "@/components/Product";
import ContactForm from "@/components/ContactForm";
import ServiceCard from "@/components/Service";
import NewsCard from "@/components/News";


export default function HomePage() {

  return (
    <main className=" items-center flex flex-col gap-10  md:my-10 my-4 mx-2 md:w-3/4 md:mx-auto">

      <ServiceCard />

      <ProductCard />

      <NewsCard />

      <ContactForm />

    </main>
  );
}
