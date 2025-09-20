"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import _ from "lodash";
import Slider, { Settings } from "react-slick";
import { ChevronRight, ChevronLeft } from "lucide-react";


import Property from "../core/domain/Property";
import PropertyListCard from "./PropertyListCard";
import { PROPERTY_CATEGORIES } from "../common/settings";


const SLIDER_SETTINGS: Settings = {
  dots: true,
  infinite: true,
  lazyLoad: 'progressive',
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3,
  arrows: false,
  className: "justify-left",
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 520,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
};



export default function PropertyCategory({
  properties,
  category,
}: {
  properties: Property[];
  category: number;
}) {
  const router = useRouter();

  const sliderRef = useRef<Slider | null>(null);
  const goToNextSlide = () => {
    sliderRef.current?.slickNext();
  };
  const goToPreviousSlide = () => {
    sliderRef.current?.slickPrev();
  };

  const goToCategoryPage = () => {
    router.push(`/properties?page=1&pageSize=5&category=${category}`);
  };

  return (
    <div className="property-category w-full">
      <div className="flex justify-between items-center mb-1 px-2">
        <span onClick={goToCategoryPage} className="text-2xl font-bold cursor-pointer">
          {PROPERTY_CATEGORIES[category].name || 'Propiedades'}
        </span>
        <div>
          <button className="button cursor-pointer mr-3 bg-gray-50 rounded-sm" onClick={goToPreviousSlide}>
            <ChevronLeft size={20} color="black" />
          </button>
          <button className="button cursor-pointer bg-gray-50 rounded-sm" onClick={goToNextSlide}>
            <ChevronRight size={20} color="black" />
          </button>
        </div>
      </div>
      <Slider
        ref={sliderRef}
        {...SLIDER_SETTINGS}
      >
        {
          properties
            .filter(p =>
              p.category === category || (p.isNear && category === 0)
            )
            .map((property) => (
              <div key={property.name}>
                <PropertyListCard property={property} />
              </div>
            ))
        }
      </Slider>

    </div>
  );
}




