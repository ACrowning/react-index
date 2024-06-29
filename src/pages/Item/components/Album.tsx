import PropTypes from "prop-types";
import { Carousel } from "antd";
import styles from "../../Item/item.module.css";

const Album = ({ albumPhotos }: any) => {
  return (
    <div className={styles.carouselContainer}>
      <Carousel>
        {albumPhotos && albumPhotos.length > 0 ? (
          albumPhotos.map((photo: any, index: any) => (
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

Album.propTypes = {
  albumPhotos: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Album;
