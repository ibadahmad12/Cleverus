import React, {
  useState,
  useEffect,
  useImperativeHandle,
  Fragment,
} from "react";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import ClipLoader from "react-spinners/ClipLoader";
import "./GoogleMaps.scss";
import { MdLocationOn } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { ImSad2 } from "react-icons/im";
import axios from "axios";
import Geocode from "react-geocode";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "@reach/combobox/styles.css";
// import { connect } from "react-redux";
import { useRef } from "react";
import { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import Loader from "./loader";
import cogoToast from "cogo-toast";
import PlaceDetails from "./PlaceDetail/placeDetails";

const mapStyles = {
  width: "100%",
  height: "100%",
};

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
Geocode.setLocationType("APPROXIMATE");

function GoogleMaps(props) {
  const [initialCheck, setInitialCheck] = React.useState(false);
  const [marker, setMarker] = useState({ lng: 0.1276, lat: 51.5072 });
  const [address, setAddress] = useState("Dubai");
  const [showingInfoWindow, setShowingInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [userLat, setUserLat] = useState();
  const [userLng, setUserLng] = useState();
  const [locateUser, setLocateUser] = useState({ value: false });
  const [noService, setNoService] = useState(false);
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState();
  const selectAddress = useRef();
  let country = "";
  let state = "";
  let city = "";

  React.useEffect(() => {
    if (initialCheck) {
      setLoading(true);
      getData();
    } else {
      setInitialCheck(true);
    }
  }, [marker]);

  const getData = async () => {
    try {
      const { data } = await axios.post("/reviews/predictions", {
        longitude: marker.lng,
        latituide: marker.lat,
      });

      props.setOpen(true);

      props.setPlaces(data);
      data && setLoading(false);
      storeData(data);
    } catch (error) {
      setLoading(false);
      cogoToast.error("Cant You Try Again :(", error);
    }
  };

  const storeData = async (data) => {
    const locations = {
      longitude: marker.lng,
      latitude: marker.lat,
      resturants: null,
      hotels: null,
      barbers: data.data,
      hospitals: null,
    };
    try {
      const res = await axios.post("/reviews/store", locations);
      res && cogoToast.success("Data is been stored Successfully");
    } catch (error) {
      cogoToast.error("Looks like data might not be backed up successfully :(");
    }
  };

  const saveCoords = (mapProps, map, clickEven) => {
    setShowingInfoWindow(false);
    setNoService(false);
    setLoadingAddress(true);
    setLoading(true);
    Geocode.fromLatLng(clickEven.latLng.lat(), clickEven.latLng.lng()).then(
      (response) => {
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;

              default:
                break;
            }
          }
        }
        setLoading(false);
        if (country[0] === " ") {
          country = country.slice(1, country.length);
        }
        setMarker({
          lat: parseFloat(clickEven.latLng.lat()),
          lng: parseFloat(clickEven.latLng.lng()),
        });
        setLoadingAddress(false);
        const resAddress = response.results[0].formatted_address;

        // props.Address &&
        //   props.Address({
        //     address: resAddress,
        //     country,
        //     state,
        //     city,
        //     lat: clickEven.latLng.lat(),
        //     lng: clickEven.latLng.lng(),
        //   });
        selectAddress.current.handleAddress(resAddress);
        // props.setAddress && props.setAddress(resAddress);
        setAddress(resAddress);
        // props.active(true);
      },
      (error) => {
        // props.active(false);
        // setLoading(false);
        // setLoadingAddress(false);
        // setNoService(true);
      }
    );
  };

  const saveSearchedCoords = (lat, lng) => {
    setShowingInfoWindow(false);
    setLoadingAddress(true);
    setNoService(false);
    setLoading(true);
    Geocode.fromLatLng(lat, lng).then(
      (response) => {
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;

              default:
                break;
            }
          }
        }
        setLoading(false);
        if (country[0] === " ") {
          country = country.slice(1, country.length);
        }
        setMarker({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        });
        setLocateUser({
          value: true,
          marker: { lat: parseFloat(lat), lng: parseFloat(lng) },
        });
        const resAddress = response.results[0].formatted_address;
        // props.Address &&
        //   props.Address({
        //     address: resAddress,
        //     country,
        //     state,
        //     city,
        //     lat,
        //     lng,
        //   });
        // props.setAddress && props.setAddress(resAddress);
        setAddress(resAddress);
        setLoadingAddress(false);
        const timer = setTimeout(() => {
          setLocateUser({ value: false });
        }, 1000);
        // props.active(true);
        return () => clearTimeout(timer);
      },
      (error) => {
        // props.active(false);
        setLoading(false);
        setLoadingAddress(false);
        setNoService(true);
      }
    );
  };

  const movedCenter = (mapProps, map) => {
    setShowingInfoWindow(false);
    setLoadingAddress(true);
    setNoService(false);
    setLoading(true);
    Geocode.fromLatLng(map.center.lat(), map.center.lng()).then(
      (response) => {
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;

              default:
                break;
            }
          }
        }
        setLoading(false);
        if (country[0] === " ") {
          country = country.slice(1, country.length);
        }
        setMarker({
          lat: parseFloat(map.center.lat()),
          lng: parseFloat(map.center.lng()),
        });
        const resAddress = response.results[0].formatted_address;
        // props.Address &&
        //   props.Address({
        //     address: resAddress,
        //     country,
        //     state,
        //     city,
        //     lat: map.center.lat(),
        //     lng: map.center.lng(),
        //   });
        // props.setAddress && props.setAddress(resAddress);
        selectAddress.current.handleAddress(resAddress);
        setAddress(resAddress);
        setLoadingAddress(false);
        // props.active(true);
      },
      (error) => {
        setLoading(false);
        setLoadingAddress(false);
        setNoService(true);
        // props.active(false);
      }
    );
  };

  const onMarkerClick = (props, marker, e) => {
    setActiveMarker(marker);
    setShowingInfoWindow(true);
  };

  const onClose = (props) => {
    if (showingInfoWindow) {
      setActiveMarker(null);
      setShowingInfoWindow(false);
    }
  };

  const locateMe = () => {
    setShowingInfoWindow(false);

    setLoadingAddress(true);
    setNoService(false);
    setLoading(true);
    Geocode.fromLatLng(userLat, userLng).then(
      (response) => {
        for (
          let i = 0;
          i < response.results[0].address_components.length;
          i++
        ) {
          for (
            let j = 0;
            j < response.results[0].address_components[i].types.length;
            j++
          ) {
            switch (response.results[0].address_components[i].types[j]) {
              case "locality":
                city = response.results[0].address_components[i].long_name;
                break;
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;

              default:
                break;
            }
          }
        }
        setLoading(false);
        if (country[0] === " ") {
          country = country.slice(1, country.length);
        }
        setMarker({ lat: parseFloat(userLat), lng: parseFloat(userLng) });
        setLocateUser({
          value: true,
          marker: { lat: parseFloat(userLat), lng: parseFloat(userLng) },
        });
        const resAddress = response.results[0].formatted_address;
        // props.Address &&
        //   props.Address({
        //     address: resAddress,
        //     country,
        //     state,
        //     city,
        //     lat: userLat,
        //     lng: userLng,
        //   });
        // props.setAddress && props.setAddress(resAddress);

        selectAddress.current.handleAddress(resAddress);
        setAddress(resAddress);
        setLoadingAddress(false);
        const timer = setTimeout(() => {
          setLocateUser({ value: false });
        }, 1000);
        // props.active(true);
        return () => clearTimeout(timer);
      },
      (error) => {
        // props.active(false);
        setLoading(false);
        setLoadingAddress(false);
        setNoService(true);
      }
    );
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
      });
    }
  }, []);

  const [googleProps, setGoogleProps] = useState({
    containerStyle: mapStyles,
    google: props.google,
    zoom: 12,
    style: mapStyles,
    initialCenter: marker,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    zoomControl: true,
    onClick: saveCoords,
    onDragend: movedCenter,
  });

  useEffect(
    () =>
      locateUser?.value &&
      setGoogleProps({
        containerStyle: mapStyles,
        google: props.google,
        zoom: 12,
        style: mapStyles,
        initialCenter: marker,
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        center: locateUser.marker,
        zoomControl: true,
        onClick: saveCoords,
        onDragend: movedCenter,
      }),
    [locateUser?.value] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return (
    <div className="map-desktop">
      {loading && <Loader />}
      <Fragment>
        <Search
          ref={selectAddress}
          {...props}
          saveSearchedCoords={saveSearchedCoords}
        />
        <div
          onClick={() => locateMe()}
          style={{
            marginTop: "10%",
            bottom: "unset",
          }}
          className="locate-me"
        >
          {" "}
          <MdLocationOn size="22" color="#00000" />
          <span className="">Locate Me</span>
        </div>
        {/* {noService && (
          <div
            style={{
              top: props.width === "sm" ? "70%" : "80%",
              height: props.width === "sm" ? "" : "33px",
            }}
            className="d-flex flex-direction-row justify-content-between align-items-center pl-2 pr-2 error-message"
          >
            <div className="mt-auto mb-auto d-flex align-items-center ">
              <ImSad2 />
              <span className="ml-2">{t("google-maps.outside-location")}</span>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setNoService(false)}
            >
              <AiOutlineClose color="grey" size={20} />
            </div>
          </div>
        )} */}
        <Map {...googleProps}>
          <Marker
            // icon={{
            //   url: pin,
            // }}
            onClick={onMarkerClick}
            position={marker}
          />
          <InfoWindow
            marker={activeMarker}
            visible={showingInfoWindow}
            onClose={onClose}
          >
            <div>
              {loadingAddress ? (
                <div className="d-flex justify-content-center align-items-center w-100">
                  <ClipLoader color="#000" loading size={20} />
                </div>
              ) : (
                <p className="pt-2">{address}</p>
              )}
            </div>
          </InfoWindow>
        </Map>
      </Fragment>
    </div>
  );
}

const Search = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [parentAddress, setParentAddress] = useState(false);
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    // requestOptions: {
    //   componentRestrictions: {
    //     country:
    //       props.country.toLowerCase() === "saudi arabia"
    //         ? "sa"
    //         : props.country.toLowerCase() === "united arab emirates"
    //         ? "ae"
    //         : "eg",
    //   },
    // },
    // debounce: 300,
  });

  const [selectedCategory, setSelectedCategory] = React.useState("restaurants");

  React.useEffect(() => {
    //getting the active category
    document.querySelector(".active").classList.remove("active");
    //removing the active category
    document.querySelector(`.${selectedCategory}`).classList.add("active");
  }, [selectedCategory]);
  const handleSelect = (address) => {
    searchAddress(address);
  };

  useImperativeHandle(
    ref,
    () => ({
      handleAddress(e) {
        setValue(e);
        !parentAddress && setParentAddress(!parentAddress);
      },
    }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleInput = (e) => {
    setValue(e.target.value);

    parentAddress && setParentAddress(!parentAddress);
  };

  const searchAddress = async (address) => {
    try {
      setValue(address, false);
      clearSuggestions();
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      props.saveSearchedCoords(lat, lng);
    } catch (error) {}
  };
  return (
    <div
      style={{ top: props.width === "sm" ? "30px" : "10px" }}
      className="search-box d-flex"
    >
      <Combobox
        className="w-50"
        onSelect={(address) => handleSelect(address)}
        style={{ flex: "30%" }}
      >
        <ComboboxInput
          value={value}
          onChange={(e) => handleInput(e)}
          disabled={!ready}
          placeholder={"Search"}
          className="w-100 pl-3 search-input"
        />

        {!parentAddress && (
          <ComboboxPopover
            className="pl-3"
            style={{
              border: "none",
              outline: "none",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
              zIndex: "20",
              background: "#F5F5F5",
              borderRadius: "4px",
            }}
          >
            <ComboboxList>
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <ComboboxOption
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: "11px",
                    }}
                    key={place_id}
                    value={description}
                  />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        )}
      </Combobox>
      <Combobox className="w-50 module-search-box">
        <div className="module-wrapper">
          <span
            className="restaurants active"
            onClick={(e) => setSelectedCategory("restaurants")}
          >
            Resturants
          </span>
          <span
            className="hospitals"
            onClick={(e) => setSelectedCategory("hospitals")}
          >
            Hospitals
          </span>
          <span
            className="hotels"
            onClick={(e) => setSelectedCategory("hotels")}
          >
            Hotels
          </span>
          <span className="parks" onClick={(e) => setSelectedCategory("parks")}>
            Parks
          </span>
          <span className="pumps" onClick={(e) => setSelectedCategory("pumps")}>
            Fuel Pumps
          </span>
          <span className="malls" onClick={(e) => setSelectedCategory("malls")}>
            Malls
          </span>
        </div>
      </Combobox>
    </div>
  );
});

// const mapStateToProps = (state) => {
//   return { country: state.language.country, width: state.layout.screenWidth };
// };

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
})(GoogleMaps);
