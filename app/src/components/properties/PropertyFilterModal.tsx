/*"use client"
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, Button } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import _ from 'lodash'; // Optional
import { FilterItem, useFilters } from '../../state/FiltersContext';

interface FilterFormData {
  name: string;
  address: string;
  priceRange: [number, number];
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 10000000;
const PRICE_STEP = 100000;

const DEFAULT_FILTERS_VALUES: FilterItem[] = [
  {
    id: 'propertyName',
    value: "",
    context: "propertyName",
    persist: true,
  },
  {
    id: 'propertyName';
    value: any;
    context: string[];
    persist?: boolean;
  },
  {
    id: 'propertyName';
    value: any;
    context: string[];
    persist?: boolean;
  }
]

const PropertyFilterForm = () => {
  const { filters, updateFilter, clearFilters } = useFilters();
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FilterFormData>({
    defaultValues: {
      name: filters.name || '',
      address: filters.address || '',
      priceRange: [filters.minPrice || DEFAULT_MIN_PRICE, filters.maxPrice || DEFAULT_MAX_PRICE],
    },
  });

  const priceRange = watch('priceRange');

  const onSubmit: SubmitHandler<FilterFormData> = (data) => {
    updateFilter('name', _.trim(data.name) || undefined);
    updateFilter('address', _.trim(data.address) || undefined);
    updateFilter('minPrice', data.priceRange[0] > 0 ? data.priceRange[0] : undefined);
    updateFilter('maxPrice', data.priceRange[1] < DEFAULT_MAX_PRICE ? data.priceRange[1] : undefined);
    console.log('Filters Applied:', filters); // Trigger fetch or other actions
  };

  const handleClear = () => {
    clearFilters();
    reset();
  };

  const validateNoEmptySpaces = (value: string) => {
    if (value && _.trim(value) === '') return 'Cannot contain only spaces';
    return true;
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-4 border rounded shadow-sm">
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control {...register('name', { validate: validateNoEmptySpaces })} />
        {errors.name && <Form.Text className="text-danger">{errors.name.message}</Form.Text>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Address</Form.Label>
        <Form.Control {...register('address', { validate: validateNoEmptySpaces })} />
        {errors.address && <Form.Text className="text-danger">{errors.address.message}</Form.Text>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</Form.Label>
        <Slider
          range
          min={DEFAULT_MIN_PRICE}
          max={DEFAULT_MAX_PRICE}
          step={PRICE_STEP}
          value={priceRange}
          onChange={(value) => reset({ ...watch(), priceRange: value as [number, number] })}
        />
      </Form.Group>
      <Button variant="primary" type="submit">Apply</Button>
      <Button variant="secondary" onClick={handleClear}>Clear</Button>
    </Form>
  );
};

export default PropertyFilterForm;*/