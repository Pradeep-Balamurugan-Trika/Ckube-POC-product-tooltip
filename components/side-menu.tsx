'use client'

import { useState } from "react";
import data from "../data.json";

export const SideMenu = ({addToList}: {addToList: any}) => {
    const [buttonClicked, setButtonClicked] = useState("source");

const handleClick = (item: any) => {
  addToList(item);
};

const handleButtonClick = (buttonType: any) => {
  setButtonClicked(buttonType);
};

const renderEndpoints = () => (
  <>
    <div style={{ display: "flex", width: "100%" }}>
      <div style={{ width: "50%" }}>
        <button
          style={{ width: "100%", height: "32px", cursor: "pointer" }}
          onClick={() => handleButtonClick("source")}
        >
          Source
        </button>
      </div>
      <div style={{ width: "50%" }}>
        <button
          style={{ width: "100%", height: "32px", cursor: "pointer" }}
          onClick={() => handleButtonClick("destination")}
        >
          Destination
        </button>
      </div>
    </div>
    <div style={{ marginTop: "15px" }}>
      {buttonClicked === "source" ? <img className="w-20" src="svg-img/source.svg" alt="source"/> : <img className="w-20" src="svg-img/destination.svg" alt="destination"/>
      }
    </div>
    <div>
      {data["endpoints"].map((item, i) => {
        return (
          item.type === buttonClicked && (
            <p
              key={i}
              style={{ cursor: "pointer" }}
              onClick={() => handleClick(item)}
            >
              {item.name}
            </p>
          )
        );
      })}
    </div>
  </>
);

const renderDataModels = () => (
  <>
    <div style={{ marginTop: "15px" }}>
      <img className="w-20" src="svg-img/datamodel.svg" alt="datamodel"/>
    </div>
    <div>
      {data["Data-models"].map((item, i) => (
        <p
          key={i}
          style={{ cursor: "pointer" }}
          onClick={() => handleClick(item)}
        >
          {item.name}
        </p>
      ))}
    </div>
  </>
);

const displayItem = Object.keys(data).map((item, i) => (
  <div key={i} style={{ minHeight: "300px" }}>
    <p>{item === "endpoints" ? "End Points" : "Data Models"}</p>
    {item === "endpoints" ? renderEndpoints() : renderDataModels()}
  </div>
));

return <div>{displayItem}</div>;
}