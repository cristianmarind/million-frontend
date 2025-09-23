'use client'
import _ from "lodash";

import Owner from '@/app/src/core/domain/Owner';
import Property from '@/app/src/core/domain/Property';
import Image from "next/image";
import moment from "moment";
import styles from "./PropertyCard.module.css";

export const dynamicParams = true;
export const revalidate = 86400;

interface PropertyCardProps {
  owner: Owner;
  property: Property
}

export default function PropertyCard({ owner, property }: PropertyCardProps) {

  return (
    <article className={styles.wrapper} aria-labelledby="property-title">
      <div className={styles.ownerRow}>
        <div className={styles.avatar}>
          <Image
            src={owner.photoUrl || "/placeholder.jpg"}
            alt={`Foto de ${owner.name}`}
            width={64}
            height={64}
            style={{ objectFit: "cover" }}
          />
        </div>
        <div>
          <div className={styles.ownerLabel}>Owner</div>
          <div className={styles.ownerName}>{owner.name}</div>
        </div>
      </div>

      <div className={styles.main}>
        <h2 id="property-title" className={styles.title}>
          {property.name}
        </h2>

        <div className={styles.metaRow}>
          <div className={styles.address}>{property.address}</div>
          <div className={styles.price}>${property.price.toLocaleString()}</div>
          <div className={styles.year}>Año: {property.year}</div>
        </div>
      </div>

      <div className={styles.tracesWrap}>
        <div className={styles.tracesHeader}>Historial</div>

        <div className={styles.traces}>
          {property.propertyTraces.map((t, i) => (
            <div className={styles.traceRow} key={i}>
              <div className={styles.traceEvent}>{t.event}</div>
              <div className={styles.traceValue}>${t.value.toLocaleString()}</div>
              <div className={styles.traceDate}>
                {moment(t.date).format("YYYY/MM/DD")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}