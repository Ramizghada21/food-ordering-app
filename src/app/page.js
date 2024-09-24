// import Image from "next/image";

import Link from "next/link";
import Header from "../components/layout/Header";
import Hero from "../components/layout/Hero";
import HomeMenu from "../components/layout/HomeMenu";
import SectionHeader from "../components/layout/SectionHeader";

// Your page component code here


export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeader subHeader={"our story"} mainHeader={"About Us"} />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil nemo
            voluptatem neque? Facilis accusantium cupiditate saepe! Enim rem
            illo nulla minus fuga commodi vitae pariatur? Voluptates distinctio
            omnis quo ea?
          </p>
          <p> consectetur adipisicing elit. Nihil nemo
            voluptatem neque? Facilis accusantium cupiditate saepe! Enim rem
            illo nulla minus fuga commodi vitae pariatur? Voluptates distinctio
            omnis quo ea?
          </p>
          <p> Facilis accusantium cupiditate saepe! Enim rem
            illo nulla minus fuga commodi vitae pariatur? Voluptates distinctio
            omnis quo ea?
          </p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeader
          subHeader={'Don\'t hesitate'}
          mainHeader={'Contact Us'}
        />
        <div className="mt-8">

        </div>
        <a href="tel:+919898568127" className="text-4xl text-gray-500 underline">+91 98985 68127</a>
      </section>
      
    </>
  );
}
