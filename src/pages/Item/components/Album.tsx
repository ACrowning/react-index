import React from "react";
import { Carousel } from "antd";
import styles from "../../Item/item.module.css";

interface AlbumProps {
  albumPhotos?: string[];
}

const Album: React.FC<AlbumProps> = ({ albumPhotos }) => {
  return (
    <div className={styles.carouselContainer}>
      <Carousel>
        {albumPhotos && albumPhotos.length > 0 ? (
          albumPhotos.map((photo, index) => (
            <div key={index}>
              <img
                className={styles.carouselImage}
                src={`http://localhost:4000/static/${photo}`}
                alt={`Album photo ${index + 1}`}
              />
            </div>
          ))
        ) : (
          <div className={styles.noPhotos}>No album photos available</div>
        )}
      </Carousel>
    </div>
  );
};

export default Album;
