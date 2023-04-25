import React, {useEffect} from "react";

import SkeletonComponent from "../utils/common/Skeleton";
// this component rendering last booking details
const LastBooking = ({getlastMovieStatus, lastBooking}) => {
  //if last booked status is pending then it will display a skeleton else the it'll display data

  if (getlastMovieStatus === "pending") {
    return <SkeletonComponent />;
  } else {
    return (
      <div className="last-order">
        <h3>Last booking details:</h3>
        {lastBooking.message ? (
          <div>{lastBooking.message}</div>
        ) : (
          <div>
            <p>
              <b>Seats:</b>
            </p>
            <p>
              <b>A1:</b> {lastBooking?.seats?.A1}
            </p>
            <p>
              <b>A2:</b> {lastBooking?.seats?.A2}
            </p>
            <p>
              <b>A3:</b> {lastBooking?.seats?.A3}
            </p>
            <p>
              <b>A4:</b> {lastBooking?.seats?.A4}
            </p>
            <p>
              <b>D1:</b> {lastBooking?.seats?.D1}
            </p>
            <p>
              <b>D2:</b> {lastBooking?.seats?.D2}
            </p>
            <p>
              <b>Slot:</b> {lastBooking?.slot}
            </p>
            <p>
              <b>Movie:</b> {lastBooking?.movie}
            </p>
          </div>
          // <div>No Booking Found</div>
        )}
      </div>
    );
  }
};

export default LastBooking;
