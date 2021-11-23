import React from "react";
import styles from "./placeDetails.module.scss";

const Reviews = ({ place }) => {
  return (
    <>
      <h4 style={{ marginTop: "1rem" }}>What People Say</h4>
      {place?.reviews?.map(({ id, text, user: { name, image_url } }) => {
        return (
          <div className={styles.author_section} key={id}>
            <div className={styles.top_flex}>
              <div>
                {image_url ? (
                  <img src={image_url} className={styles.review_img} />
                ) : (
                  <p className={styles.review_generated_img}>
                    {name.slice(0, 1)}
                  </p>
                )}{" "}
              </div>

              <div className={styles.review_content}>
                <h6>{name}</h6>
                <p style={{ margin: "1em 0 0 0" }}>{text.slice(0, 500)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default Reviews;