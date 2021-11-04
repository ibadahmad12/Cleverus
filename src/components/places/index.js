import React from "react";
import NavBar from "../navbar";
import Footer from "../footer/index";
import axios from "axios";
import PlacesModal from "./pop-up";
import SinglePlace from "./singlePlace";
import GoogleMaps from "./GoogleMaps";

axios.defaults.headers.common = {
  Authorization: `BEARER ${process.env.REACT_APP_API_KEY}`,
};

const Places = () => {
  const [places, setPlaces] = React.useState([]);

  const [open, setOpen] = React.useState(false);

  // console.log("this is API Format", placesData);

  return (
    <div>
      <PlacesModal open={open} setOpen={setOpen} places={places} />
      {/* <NavBar /> */}
      <div style={{ marginTop: "0px" }}>
        <GoogleMaps setOpen={setOpen} setPlaces={setPlaces} />
      </div>
    </div>
  );
};

export default Places;
