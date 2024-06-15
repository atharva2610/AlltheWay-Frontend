import { Link } from "react-router-dom";

import { BurgerImg, DhoklaImg, DosaImg, NoodlesImg, PavBhajiImg, ThaliImg } from "../assets/popular cuisines";

import { useRef } from "react";


export default function PopularCuisineImages() {

  const reference = useRef(null);


  const popularCuisines = [
    { image: BurgerImg, name: "Burger" },
    { image: ThaliImg, name: "Thali" },
    { image: DhoklaImg, name: "Dhokla" },
    { image: DosaImg, name: "Dosa" },
    { image: NoodlesImg, name: "Noodles" },
    { image: PavBhajiImg, name: "Pav Bhaji" },
  ]


  return (
    <div ref={reference} className="grid grid-flow-col auto-cols-max gap-4 mb-16 overflow-x-auto">
      {
        popularCuisines.map(cuisine => (
          <Link to={"/popular/" + cuisine.name.toLowerCase()} key={cuisine.name} >
            <div className="shrink-0 flex flex-col items-center gap-2 text-lg">
              <img src={cuisine.image} className="bg-gray-200 size-24 object-cover" />
              <span>{cuisine.name}</span>
            </div>
          </Link>
        ))
      }
    </div>
  )
}