// react imports
import React, {useState} from "react";
import {useEffect} from "react";

// import {ToastContainer, toast} from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// my imports
import {movies, slots, seats} from "../utils/movieData/BookMovieData";
import LastBooking from "../components/lastBooking";
import SelectMovie from "../components/SelectMovie";
import SelectSlot from "../components/SelectSlot";
import SelectedSeat from "../components/SelectedSeat";

const BookMovie = () => {
  const [lastBooking, setLastBooking] = useState({});
  const [selectedMovie, setSelectedMovie] = useState();
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedSeats, setSelectedSeats] = useState();
  const [selectedCount, setSelectedCount] = useState(0);
  const [totalData, setTotalData] = useState({});

  // error states

  const [bookMovieError, setBookMovieError] = useState();
  const [getLastMovieError, setGetLastMovieError] = useState();

  // validation states
  const [isMovie, setIsMovie] = useState();
  const [isSlot, setIsSlot] = useState();
  const [isSeat, setIsSeat] = useState();
  const [bookMovieStatus, setBookMovieStatus] = useState();
  const [getlastMovieStatus, setGetlastMovieStatus] = useState();

  // fetching last booking details
  const fetchLastBooking = () => {
    // initially get last movie status will be pending
    setGetlastMovieStatus("pending");
    fetch(`${process.env.API_URI}/api/booking`)
      .then((res) => res.json())
      .then((json) => {
        setLastBooking(json);

        // status will be fullfilled after getting successfull response
        setGetlastMovieStatus("fullfilled");
      })
      .catch((error) => {
        //if any error will accours then status will be rejected
        setGetlastMovieStatus("rejected");
        setBookMovieError(error);
        alert(error);
        console.log(error);
      });
  };

  // reseting form after successfully submitting all data
  const resetForm = () => {
    setSelectedMovie();
    setSelectedSlot();
    setSelectedSeats();
    document.querySelectorAll("input").forEach((input) => (input.value = 0));
  };

  // here we are using useState hook (didMount) to display last booking details on every render
  useEffect(() => {
    fetchLastBooking();
  }, []);

  useEffect(() => {
    var finalData = {};
    finalData.movie = selectedMovie;
    finalData.slot = selectedSlot;
    finalData.seats = {
      A1: 0,
      A2: 0,
      A3: 0,
      A4: 0,
      D1: 0,
      D2: 0,
    };
    finalData.seats[selectedSeats] = parseInt(selectedCount);
    if (selectedMovie) {
      setIsMovie();
    }
    if (selectedSlot) {
      setIsSlot();
    }

    if (selectedCount > 0) {
      setIsSeat();
    }
    setTotalData(finalData);
  }, [selectedMovie, selectedSlot, selectedSeats, selectedCount]);

  const sendData = (data) => {
    // initially book movie status will be pending
    setBookMovieStatus("pending");
    fetch(`${process.env.API_URI}/api/booking`, {
      method: "POST",
      body: JSON.stringify({...data}),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // status will be fullfilled after getting successfull response
        setBookMovieStatus("fullfilled");
        fetchLastBooking();
        resetForm();
      })
      .catch((error) => {
        // if any error will accours then status will be rejected
        setBookMovieStatus("rejected");
        setGetLastMovieError(error);
        console.log(error);
      });
  };

  // this function is validating all feilds and send all data to database after validation
  const bookMovie = () => {
    const validation = {};
    if (!totalData.movie) {
      validation.isMovie = false;
    } else {
      validation.isMovie = true;
    }

    if (!totalData.slot) {
      validation.isSlot = false;
    } else {
      validation.isSlot = true;
    }

    if (!Object.values(totalData.seats).find((a) => a > 0)) {
      validation.isSeat = false;
    } else {
      validation.isSeat = true;
    }

    if (!validation.isMovie) {
      setIsMovie("Please Select a movie");
    }
    if (!validation.isSlot) {
      setIsSlot("please select a slot");
    }
    if (!validation.isSeat) {
      setIsSeat("minimum 1 seat required");
    }

    // if all validation has sucessfull , then send data to api
    if (validation.isMovie && validation.isSlot && validation.isSeat) {
      sendData(totalData);
      localStorage.clear();
    }
  };

  return (
    <>
      <div>
        <h2 className="main-title">Book that show !!</h2>
        <div className="main">
          <div className="left">
            {/* movies row section */}
            <SelectMovie
              selectedMovie={selectedMovie}
              movies={movies}
              setSelectedMovie={setSelectedMovie}
            />

            {isMovie && <p className="err">{isMovie}</p>}
            {/* slot row section */}
            <SelectSlot
              slots={slots}
              selectedSlot={selectedSlot}
              setSelectedSlot={setSelectedSlot}
            />
            {isSlot && <p className="err">{isSlot}</p>}

            {/* seat row section */}
            <SelectedSeat
              seats={seats}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              selectedCount={selectedCount}
              setSelectedCount={setSelectedCount}
            />

            {/* book movie button  section */}
            {isSeat && <p className="err">{isSeat}</p>}
            <div className="book-button">
              <button onClick={bookMovie}>
                {bookMovieStatus === "pending" ? "Please Wait..." : "Book Now"}
              </button>
            </div>
          </div>

          {/* last booking section */}
          <div className="right">
            {/* {status == "pending" && <p>Pending</p>} */}
            <LastBooking
              getlastMovieStatus={getlastMovieStatus}
              lastBooking={lastBooking}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookMovie;
