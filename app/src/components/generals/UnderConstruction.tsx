"use client"
import React from 'react';
import { Hammer } from 'lucide-react';

const UnderConstruction = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "height": "50vh"
        }}      >
            <span className="fs-1 me-2">
                Sitio en construcción
            </span>
            <Hammer className="hammer" size={40} />
        </div>
    );
};

export default UnderConstruction;