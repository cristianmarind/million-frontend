"use client";
import { useRef, useEffect, useState, useLayoutEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import _ from "lodash";
import Slider, { Settings } from "react-slick";
import { ChevronRight, ChevronLeft } from "lucide-react";


import Property from "../../core/domain/Property";
import PropertyListCard from "./PropertyListCard";
import { PROPERTY_CATEGORIES } from "../../common/settings";


// Hook personalizado para detectar el ancho de la ventana
const useWindowWidth = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Establecer el ancho inicial
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
};

// Función para obtener la configuración del slider basada en el ancho
const getSliderSettings = (windowWidth: number): Settings => {
  let initialSlidesToShow = 4; // Por defecto para pantallas grandes

  if (windowWidth <= 768) {
    initialSlidesToShow = 1;
  } else if (windowWidth <= 992) {
    initialSlidesToShow = 2;
  } else if (windowWidth <= 1200) {
    initialSlidesToShow = 3;
  }

  return {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: initialSlidesToShow,
    slidesToScroll: 1,
    arrows: false,
    className: "justify-left",
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
          dots: true
        }
      }
    ]
  };
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
  const [mounted, setMounted] = useState(false);
  const windowWidth = useWindowWidth();
  
  // Obtener la configuración del slider basada en el ancho de la ventana
  const sliderSettings = useMemo(() => getSliderSettings(windowWidth), [windowWidth]);
  const goToNextSlide = () => {
    sliderRef.current?.slickNext();
  };
  const goToPreviousSlide = () => {
    sliderRef.current?.slickPrev();
  };

  const goToCategoryPage = () => {
    router.push(`/properties/categories/${category}`);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Solo forzar recalculación cuando cambie el ancho de la ventana
  useEffect(() => {
    if (mounted && sliderRef.current && windowWidth > 0) {
      const timer = setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.slickGoTo(0);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mounted, windowWidth]);

  const propertiesToRender = properties
    .filter(p =>
      p.category === category || (p.isNear && category === 0)
    );

  if (_.isEmpty(propertiesToRender)) {
    return null;
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
      <div style={{ width: '100%', overflow: 'hidden' }}>
        {mounted && (
          <Slider
            ref={sliderRef}
            {...sliderSettings}
          >
            {
              propertiesToRender
                .map((property) => (
                  <div key={property.name} style={{ padding: '0 10px' }}>
                    <PropertyListCard property={property} />
                  </div>
                ))
            }
          </Slider>
        )}
      </div>

    </div>
  );
}