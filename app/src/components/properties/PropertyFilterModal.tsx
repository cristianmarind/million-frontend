"use client"
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import _ from 'lodash';
import { Form, Button, Modal } from 'react-bootstrap';
import Slider from 'rc-slider';
import { Save, Eraser } from "lucide-react";

import 'rc-slider/assets/index.css';
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE, PROPERTY_FILTER_CONTEXT, FilterFormData, useFilters } from '../../state/FiltersContext';


const PRICE_STEP = 100000;
const CLEAR_FILTER_VALUES: Required<FilterFormData> = {
  propertyName: "",
  propertyAddress: "",
  propertyPrice: [0, DEFAULT_MAX_PRICE],
}

const getCurrentMaxPrice = (val: number): string => {
  if (val === DEFAULT_MAX_PRICE) {
    return "Sin límite"
  }
  return "$" + val.toLocaleString()
}

interface PropertyFilterModalProps {
  show: boolean;
  onClose: () => void;
}
const PropertyFilterModal = ({
  show, onClose
}: PropertyFilterModalProps)  => {
  const { defaultFilterValue, updateFiltersByContext } = useFilters(PROPERTY_FILTER_CONTEXT);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<FilterFormData>({
    defaultValues: defaultFilterValue,
  });

  const propertyPrice = watch('propertyPrice');

  const onSubmit: SubmitHandler<FilterFormData> = (data) => {
    const propertyName = _.trim(data.propertyName) || undefined;
    const propertyAddress = _.trim(data.propertyAddress) || undefined
    const minPrice = data.propertyPrice && data.propertyPrice[0] > 0 ? data.propertyPrice[0] : undefined
    const maxPrice = data.propertyPrice && data.propertyPrice[1] < DEFAULT_MAX_PRICE ? data.propertyPrice[1] : undefined
    const values: any = {
      propertyName: propertyName,
      propertyAddress: propertyAddress,
      propertyPrice: [minPrice, maxPrice]
    };

    updateFiltersByContext(PROPERTY_FILTER_CONTEXT, values)
    onClose();
  };

  const handleClear = () => {
    reset(CLEAR_FILTER_VALUES);
  };

  const validateNoEmptySpaces = (value: string | undefined) => {
    if (typeof value === 'string' && value !== '' && _.trim(value) === '') return 'Cannot contain only spaces';
    return true;
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose}
      aria-labelledby="filter-modal-title"
      aria-describedby="filter-modal-description"
    >
      <Modal.Header closeButton className="py-2 border-bottom-0">
        <Modal.Title id="filter-modal-title">Encuentra el lugar de tus sueños</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5">
        <div id="filter-modal-description" className="visually-hidden">
          Formulario para filtrar propiedades por nombre, dirección y rango de precio
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="propertyName" className="fw-bold">Nombre de la propiedad</Form.Label>
            <Form.Control 
              id="propertyName"
              {...register('propertyName', { validate: validateNoEmptySpaces })}
              aria-describedby={errors.propertyName ? "propertyName-error" : undefined}
              aria-invalid={!!errors.propertyName}
            />
            {errors.propertyName && (
              <Form.Text id="propertyName-error" className="text-danger" role="alert">
                {errors.propertyName.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="propertyAddress" className="fw-bold">Dirección/Ubicación</Form.Label>
            <Form.Control 
              id="propertyAddress"
              {...register('propertyAddress', { validate: validateNoEmptySpaces })}
              aria-describedby={errors.propertyAddress ? "propertyAddress-error" : undefined}
              aria-invalid={!!errors.propertyAddress}
            />
            {errors.propertyAddress && (
              <Form.Text id="propertyAddress-error" className="text-danger" role="alert">
                {errors.propertyAddress.message}
              </Form.Text>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="priceRange">
              <span className="me-1 fw-bold">Rango de precio:</span>
              <span>${_.defaultTo(_.get(propertyPrice, '0'), 0).toLocaleString()}</span>
              <span className="mx-1">-</span>
              <span>{getCurrentMaxPrice(_.defaultTo(_.get(propertyPrice, '1'), DEFAULT_MAX_PRICE))}</span>
            </Form.Label>
            <Slider
              id="priceRange"
              range
              min={DEFAULT_MIN_PRICE}
              max={DEFAULT_MAX_PRICE}
              step={PRICE_STEP}
              value={propertyPrice}
              onChange={(value) => reset({ ...watch(), propertyPrice: value as [number, number] })}
              aria-label={`Rango de precio de $${DEFAULT_MIN_PRICE.toLocaleString()} a $${DEFAULT_MAX_PRICE.toLocaleString()}`}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="dark" type="submit" className="mx-2">
              <Save className="me-2" style={{ width: '20px', height: '20px' }} aria-hidden="true" />
              Aplicar filtros
            </Button>
            <Button variant="light" onClick={handleClear} type="button">
              <Eraser className="me-2" style={{ width: '20px', height: '20px' }} aria-hidden="true" />
              Limpiar filtros
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>

  );
};

export default PropertyFilterModal;