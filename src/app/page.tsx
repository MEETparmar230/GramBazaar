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
    <main className=" items-center mx-auto  mx-4 flex flex-col gap-10 my-4">

      <ServiceCard />

      <ProductCard />

      <NewsCard />

      <ContactForm />

    </main>
  );
}
