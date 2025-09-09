'use client'

import { services } from "@/data/services";
import ProductCard from "@/components/Product";
import ContactForm from "@/components/ContactForm";
import ServiceCard from "@/components/Service";
import NewsCard from "@/components/News";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Settings from "@/components/Settings";

interface ProductsType {
  name: string,
  price: number,
  imageId: string,
  _id: string
}
interface serviceType {
  _id: string,
  name: string,
  imageId: string,
}

export default function HomePage() {

  return (
    <main className=" items-center flex flex-col gap-10 my-4 mx-2 md:w-3/4 md:mx-auto">

      <ServiceCard />

      <ProductCard />

      <NewsCard />

      <ContactForm />

    </main>
  );
}
