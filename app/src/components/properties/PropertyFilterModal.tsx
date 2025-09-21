"use client"
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Form, Button, Modal } from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import _ from 'lodash'; // Optional
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE, PROPERTY_FILTER_CONTEXT, useFilters } from '../../state/FiltersContext';

export interface FilterFormData {
  propertyName: string;
  propertyAddress: string;
  propertyPrice: [number, number];
}


const PRICE_STEP = 100000;

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
    const minPrice = data.propertyPrice[0] > 0 ? data.propertyPrice[0] : undefined
    const maxPrice = data.propertyPrice[1] < DEFAULT_MAX_PRICE ? data.propertyPrice[1] : undefined
    const values: any = {
      propertyName: propertyName,
      propertyAddress: propertyAddress,
      propertyPrice: [minPrice, maxPrice]
    };

    updateFiltersByContext(PROPERTY_FILTER_CONTEXT, values)
  };

  const handleClear = () => {
    reset();
  };

  const validateNoEmptySpaces = (value: string) => {
    if (value && _.trim(value) === '') return 'Cannot contain only spaces';
    return true;
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Encuentra el lugar de tus sueños</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control {...register('propertyName', { validate: validateNoEmptySpaces })} />
            {errors.propertyName && <Form.Text className="text-danger">{errors.propertyName.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control {...register('propertyAddress', { validate: validateNoEmptySpaces })} />
            {errors.propertyAddress && <Form.Text className="text-danger">{errors.propertyAddress.message}</Form.Text>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Price Range: ${
                _.defaultTo(_.get(propertyPrice, '0'), 0).toLocaleString()} - ${_.defaultTo(_.get(propertyPrice, '1'), DEFAULT_MAX_PRICE).toLocaleString()
              }
            </Form.Label>
            <Slider
              range
              min={DEFAULT_MIN_PRICE}
              max={DEFAULT_MAX_PRICE}
              step={PRICE_STEP}
              value={propertyPrice}
              onChange={(value) => reset({ ...watch(), propertyPrice: value as [number, number] })}
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit" className="mx-2">Apply</Button>
            <Button variant="secondary" onClick={handleClear}>Clear</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>

  );
};

export default PropertyFilterModal;