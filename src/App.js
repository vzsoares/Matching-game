import "./App.css"
import cardBack from "./images/card-back3.jpg"
import { useEffect, useState, useReducer } from "react"
import { FaGithubSquare } from "react-icons/fa"

function App() {
  // states
  const folders = "pokemons lordotr programmingl"
  const images = importAll(
    require.context(`./images/pokemons`, false, /\.(png|jpe?g|svg)$/)
  )
  const [selectedCards, setSelectedCards] = useState([])
  const [errors, setError] = useState(0)
  const [youLost, setYouLost] = useState("")
  const [winnerSelections, setWinnerSelections] = useState([])
  const [displayResetButton, setDisplayResetButton] = useState("none")
  const [cardsArray, setCardsArray] = useState(
    shuffle(
      Object.entries(images)
        .map((e) => {
          return e[0].slice(0, -4)
        })
        .map((e) => {
          return {
            name: e,
            backImg: cardBack,
            frontImg: images[`${e}.png`],
            turned: false,
          }
        })
        .concat(
          Object.entries(images)
            .map((e) => {
              return e[0].slice(0, -4)
            })
            .map((e) => {
              return {
                name: e,
                backImg: cardBack,
                frontImg: images[`${e}.png`],
                turned: false,
              }
            })
        )
    )
  )

  const [data, setData] = useState({
    cartas: cardsArray,
  })
  const [playing, setPlaying] = useState("")

  // shuffle function
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ]
    }
    return array
  }
  // end of shuffle function
  // import img's function
  function importAll(r) {
    let images = {}
    r.keys().map((item, index) => {
      images[item.replace("./", "")] = r(item)
    })
    return images
  }
  // end of img's function
  // handleCartaClick function
  const handleCartaClick = (event, index, carta) => {
    event.preventDefault()

    if (!playing) {
      return
    }
    setData({ ...data })
    data.cartas[index].turned = true
    setSelectedCards(selectedCards.concat([[carta.name, index]]))

    if (selectedCards.length >= 2) {
      setError(errors + 1)
      setSelectedCards([[carta.name, index]])
    }
  }
  // end of handleCartaClick
  const checkCartas = () => {
    if (!playing) {
      return
    }
    if (selectedCards.length >= 2) {
      selectedCards.forEach((e) => {
        data.cartas[e[1]].turned = false
      })
      if (
        errors === 2 &&
        selectedCards.length === 2 &&
        selectedCards[0][0] !== selectedCards[1][0]
      ) {
        setError(3)
        setPlaying("")
        data.cartas.forEach((e) => {
          e.turned = true
        })
        setDisplayResetButton("block")
        setYouLost("you lost")
      }

      // if match
      if (selectedCards[0][0] === selectedCards[1][0]) {
        setWinnerSelections(winnerSelections.concat([selectedCards]))
        selectedCards.forEach((e) => {
          data.cartas[e[1]].turned = true
        })
        setSelectedCards([])
      }
    }
    winnerSelections.forEach((e) => {
      e.forEach((x) => {
        data.cartas[x[1]].turned = true
      })
    })
  }
  const startGame = (e) => {
    e.target.style.display = "none"
    setSelectedCards([])
    setError(0)
    setPlaying("playing")
    data.cartas.forEach((e) => {
      e.turned = true
      setData({ ...data })
    })
    setTimeout(() => {
      data.cartas.forEach((e) => {
        e.turned = false
        setData({ ...data })
      })
    }, 5000)
  }
  // useEffect
  useEffect(() => {
    checkCartas()
  }, [selectedCards, data])
  // styles
  const imgStyle = {
    width: "80px",
    height: "180px",
  }
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
  }
  // Cartas Component
  function Cartas() {
    const cartasContainerStyle = {}
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
        {data.cartas.map((carta, index) => {
          return (
            <div className='carta' key={index}>
              <a
                href=''
                onClick={(event) =>
                  !carta.turned
                    ? handleCartaClick(event, index, carta)
                    : event.preventDefault()
                }
              >
                <img
                  style={imgStyle}
                  src={!carta.turned ? carta.backImg : carta.frontImg}
                  alt=''
                />
              </a>
            </div>
          )
        })}
      </div>
    )
  }
  // end of cartas component
  // main return
  return (
    <>
      <main style={{ minHeight: "85vh" }}>
        <Cartas />
        <button onClick={(e) => startGame(e)} style={buttonStyle}>
          start
        </button>
        <div
          className='errors-container'
          style={{ margin: "0 auto", width: "200px", textAlign: "center" }}
        >
          <p
            style={{
              // margin: "0 auto",
              textAlgin: "center",
              fontFamily: "Roboto",
              fontWeight: "700",
              fontSize: "2rem",
              margin: "0",
              padding: "0",
            }}
          >
            {errors} errors {youLost}
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
          <a href='' style={buttonStyle}>
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
  )
}

export default App
