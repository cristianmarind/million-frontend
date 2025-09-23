"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import _ from "lodash";
import Slider, { Settings } from "react-slick";
import { ChevronRight, ChevronLeft } from "lucide-react";


import Property from "../../core/domain/Property";
import PropertyListCard from "./PropertyListCard";
import { PROPERTY_CATEGORIES } from "../../common/settings";


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
      breakpoint: 1000,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2
      }
    },
    {
      breakpoint: 768,
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
    router.push(`/properties/categories/${category}`);
  };

  const propertiesToRender = properties
    .filter(p =>
      p.category === category || (p.isNear && category === 0)
    );

  if (_.isEmpty(propertiesToRender)) {
    return null; // Renderizar msg no hay
  }

  return (
    <div className="property-category container w-100">
      <div className="row justify-content-between">
        <div className="col-12 col-sm-8 d-flex align-items-center mb-1 mt-2">
          <span onClick={goToCategoryPage} className="h3 fw-bold mb-0 text-truncate" style={{ cursor: 'pointer' }}>
            {PROPERTY_CATEGORIES[category].name || 'Propiedades'}
          </span>
        </div>
        <div className="col-12 col-sm-4 d-flex justify-content-between justify-content-sm-end align-items-center mb-1 mt-2">
          <button className="btn btn-light me-3" onClick={goToPreviousSlide} style={{ cursor: 'pointer' }}>
            <ChevronLeft size={20} color="black" />
          </button>
          <button className="btn btn-light" onClick={goToNextSlide} style={{ cursor: 'pointer' }}>
            <ChevronRight size={20} color="black" />
          </button>
        </div>
      </div>
      <Slider
        ref={sliderRef}
        {...SLIDER_SETTINGS}
      >
        {
          propertiesToRender
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




