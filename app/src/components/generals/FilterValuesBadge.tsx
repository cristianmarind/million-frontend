"use client";
import { useEffect, useState, useRef } from "react";
import _ from 'lodash';
import { X } from 'lucide-react';
import clsx from "clsx";

import { Badge } from "react-bootstrap";
import { FilterFormDataStrings, LABEL_BY_KEY, useFilters } from "../../state/FiltersContext";


export default function FilterValuesBadge({
  context,
}: {
  context: string;
}) {
  const { filters, clearFilerItemByContext } = useFilters(context);
  const ref = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: [1] }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  const contextFilter = _.filter(filters, { context });
  
  const currentFilters: Partial<FilterFormDataStrings> = contextFilter.reduce((accum, item) => {
    if (Array.isArray(item.value)) {
      if (_.every(item.value, _.isNil) || _.isEqual(item.value, item.defaultValue)) {
        return accum;
      }
      
      return {
        ...accum,
        [item.key]: item.value.join(" - "),
      }
    }
    if (!_.isNil(item.value) && item.value !== "" && !_.isEqual(item.value, item.defaultValue)) {
      return {
        ...accum,
        [item.key]: item.value,
      }
    }
    return accum
  }, {});

  if (_.isEmpty(currentFilters)) {
    return null
  }

  return (
    <>
      <div ref={ref} className="sentinel"></div>
      <div className={clsx(
        "filter-badges",
        isSticky ? "isSticky" : ""
      )}>
        <div className="d-flex flex-wrap">
          {
            Object.keys(currentFilters).map((filterKey) => (
              <Badge key={filterKey} bg="dark" className="d-flex align-items-center justify-content-between text-light me-2 p-2 cursor-pointer">
                <span className="me-2">{LABEL_BY_KEY[filterKey as keyof typeof LABEL_BY_KEY]}:</span>
                <span>{currentFilters[filterKey as keyof FilterFormDataStrings]}</span>
                <X className="ms-2" style={{ width: '10px', height: '10px' }} onClick={() => clearFilerItemByContext(context, filterKey)} />
              </Badge>
            ))
          }
        </div>
      </div>
    </>

  );
}




