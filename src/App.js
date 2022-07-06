import cardBack from "./images/card-back3.jpg";
import { useEffect, useState } from "react";
import { FaGithubSquare } from "react-icons/fa";

function App() {
  // Helper Functions
  // shuffle function
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }
  // end of shuffle function

  // import img's function
  function importAll(r) {
    let images = {};
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item);
    });
    return images;
  }
  // end of helper functions

  // states
  const folders = ["pokemons", "lordotr", "programmingl"];
  const [images] = useState(
    importAll(require.context(`./images/pokemons`, false, /\.(png|jpe?g|svg)$/))
  );

  const [errors, setErrors] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);
  const [displayResetButton, setDisplayResetButton] = useState("none");

  const [cardsArray, setCardsArray] = useState(
    shuffle(
      Object.entries(images)
        .map((e) => {
          const result = {
            name: e[0].slice(0, -4),
            backImg: cardBack,
            frontImg: e[1],
            turned: false,
          };
          return [{ ...result }, { ...result }];
        })
        .flat(1)
    )
  );

  // handleCardClick function
  function handleCardClick(event, index, card) {
    event.preventDefault();
    if (!playing) {
      return;
    }

    // this if prevents multiple clicks
    if (selectedCards.length < 2) {
      setSelectedCards([...selectedCards, { name: card.name, index }]);

      setCardsArray(
        cardsArray.map((e, i) => {
          if (i === index) {
            return { ...e, turned: true };
          } else return e;
        })
      );
    }
  }

  function checkCards() {
    if (!playing) {
      return;
    }
    // if match
    if (
      selectedCards[0]?.name === selectedCards[1]?.name &&
      selectedCards.length > 0
    ) {
      setSelectedCards([]);
    }
    // if  not match
    else if (selectedCards.length === 2) {
      setTimeout(() => {
        setCardsArray(
          cardsArray.map((e, i) => {
            // turn back down wrong cards
            if (i === selectedCards[0].index || i === selectedCards[1].index) {
              return { ...e, turned: false };
            } else return e;
          })
        );
        setSelectedCards([]);
        setErrors(errors + 1);
        // game over condition
        if (errors + 1 >= 5) {
          setPlaying(false);
          setDisplayResetButton("block");
        }
      }, 1000);
    }
  }

  function startGame(e) {
    e.target.style.display = "none";
    setPlaying(true);
    setCardsArray(
      cardsArray.map((e) => {
        return { ...e, turned: true };
      })
    );

    setTimeout(() => {
      setCardsArray(
        cardsArray.map((e) => {
          return { ...e, turned: false };
        })
      );
    }, 5000);
  }

  // useEffect
  useEffect(() => {
    checkCards();
  }, [selectedCards]);

  // styles
  const buttonStyle = {
    fontFamily: "Roboto",
    fontWeight: "700",
    cursor: "pointer",
    position: "absolute",
    top: "calc(50% - 1rem)",
    left: "50%",
    transform: "translate(-50%, 0)",
    fontSize: "2rem",
    textAlign: "center",
    textTransform: "capitalize",
    border: "2px solid black",
    borderRadius: "20px",
    color: "#d12608",
    backgroundColor: "white",
    textDecoration: "none",
    width: "auto",
    padding: "0.25rem",
  };

  // main return
  return (
    <>
      <main style={{ minHeight: "85vh" }}>
        <Cards cardsArray={cardsArray} handleCardClick={handleCardClick} />

        <button onClick={(e) => startGame(e)} style={buttonStyle}>
          start
        </button>
        <div
          className='errors-container'
          style={{ margin: "0 auto", width: "200px", textAlign: "center" }}
        >
          <p
            style={{
              textAlgin: "center",
              fontFamily: "Roboto",
              fontWeight: "700",
              fontSize: "2rem",
              margin: "0",
              padding: "0",
            }}
          >
            {errors} errors {displayResetButton === "block" && "You Lost !!!"}
          </p>
        </div>
        <button
          style={{
            backgroundColor: "transparent",
            cursor: "pointer",
            display: displayResetButton,
            border: "none",
          }}
        >
          <a href='/' style={buttonStyle}>
            Reset
          </a>
        </button>
      </main>
      {/* gitHub ref */}
      <div
        className='github'
        style={{
          textAlign: "center",
        }}
      >
        <a
          href='https://github.com/vzsoares'
          target='_blank'
          rel='noreferrer'
          className='github'
        >
          <FaGithubSquare
            style={{ color: "black", fontSize: "3rem", marginTop: "0.5rem" }}
          />
        </a>
      </div>
    </>
  );
}

// Cards Component
function Cards({ cardsArray, handleCardClick }) {
  // cartas return
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(7,1fr)",
        width: "650px",
        margin: "0 auto",
        marginTop: "1rem",
      }}
      className='cartas-container'
    >
      {cardsArray.map((card, index) => {
        return (
          <div className='carta' key={index}>
            <button
              onClick={(event) =>
                !card.turned
                  ? handleCardClick(event, index, card)
                  : event.preventDefault()
              }
              style={{ background: "none", border: "none" }}
            >
              <img
                style={{
                  width: "80px",
                  height: "180px",
                }}
                src={!card.turned ? card.backImg : card.frontImg}
                alt=''
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
// end of cartas component

export default App;
