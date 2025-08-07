import { services } from "@/data/services";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import ContactForm from "@/components/ContactForm";
import ServiceCard from "@/components/ServiceCard";
import NewsCard from "@/components/NewsCard";

export default function HomePage() {
  return (
    <main className="w-fit md:mx-auto mx-4 flex flex-col gap-10 my-4">
      <section id="services" className="bg-zinc-100 p-4 rounded-lg shadow " >
        <h2 className="text-2xl font-bold mb-2">Our Services</h2>
        <div className="flex flex-wrap gap-7 justify-center items-center">
          {services.map((s) => (
            <ServiceCard key={s.name} {...s} />
          ))}
        </div>
      </section>

      <section id="products" className="bg-zinc-100 p-4 rounded-lg md:mx-auto lg:mx-auto sm-mx-2 shadow ">
        <h2 className="text-2xl font-bold mb-2">Available Products</h2>
        <div className="flex flex-wrap gap-7 justify-center items-center">
          {products.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </section>

      <section id="news">
          <NewsCard/>
</section>


      <section id="contact"  className="bg-zinc-100 p-4 rounded-lg md:w-140 mx-auto shadow">
        <ContactForm />
      </section>
    </main>
  );
}
