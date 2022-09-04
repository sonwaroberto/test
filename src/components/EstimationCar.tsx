import React, { SyntheticEvent, useEffect, useState } from 'react'
import { useThemeContext } from '../utils/dataContext'
import { graphql, useStaticQuery } from 'gatsby'
import Img, { FluidObject } from 'gatsby-image'

const queryAsset = graphql`
  query images {
    allStrapiBwImage {
      nodes {
        model
        price
        id
        color
        brand
        localizations {
          data {
            attributes {
              color
            }
          }
        }
        car_image {
          url
        }
        key
      }
    }
  }
`
interface car {
  id: string
  color: string
  price: number
  model: string
  brand: string
  localizations: {
    data: [
      {
        attributes: {
          color: string
        }
      }
    ]
  }
  car_image: {
    url:string
  }
  key: string
}

export default function EstimationCar() {
  const staticQuery = useStaticQuery(queryAsset)
  const cars = staticQuery.allStrapiBwImage.nodes
  const { findElementByKey } = useThemeContext()
  const [selectedCar, setSelectedCar] = useState('prado-car')
  const [totalPrice, setTotalPrice] = useState<number>(50000)
  const [numberDays, setNumberDays] = useState<number>(1)
  const [locationReservation, setLocationReservation] = useState('enVille')
  const [dayTown, setDayTown] = useState<number>(1)
  const [dayOutTown, setDayOutTown] = useState<number>(1)
  const [slideIndex, setSlideIndex] = useState<number>(1)
  let slides = document.getElementsByClassName(
    'mySlides'
  ) as unknown as HTMLElement[]
  let dots = document.getElementsByClassName('dot') as unknown as HTMLElement[]
  const [check, setCheck] = useState<number>(1)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationReservation(event.target.value)
    if (numberDays > 2) {
      setDayOutTown(1)
      setDayTown(numberDays - 1)
    } else {
      setDayOutTown(1)
      setDayTown(1)
    }
    setNumberDays(numberDays)
  }
  const resetPrice = () => {
    cars.map((car: car, i: number) => {
      if (locationReservation === 'enVille') {
        if (selectedCar === car.key) setTotalPrice(numberDays * car.price)
      } else if (locationReservation === 'horsVille') {
        if (selectedCar === car.key)
          setTotalPrice(numberDays * car.price + numberDays * 10000)
      } else {
        if (selectedCar === car.key)
          setTotalPrice(car.price + dayTown * car.price + dayTown * 10000)
      }
    })
  }
  const nextSlide = (n: number) => {
    setSlideIndex(slideIndex + n)
  }
  const prevSlide = (n: number) => {
    setSlideIndex(slideIndex - n)
  }
  const currentSlide = (n: number) => {
    setSlideIndex(n)
  }
  const showSlides = (n: number) => {
    if (n > slides.length) {
      setSlideIndex(1)
    }
    if (n < 1) {
      setSlideIndex(slides.length)
    }
    setCheck(n++)
  }
  const changeSlide = () => {
    let i: number
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none'
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' activeSlide', '')
    }
    slides[slideIndex - 1].style.display = 'block'
    dots[slideIndex - 1].className += ' activeSlide'
  }
  const changeSlideSelect = (key: string) => {
    cars.map((car: car, i: number) => {
      if (car.key === key) {
        setSlideIndex(++i)
      }
    })
  }
  const calculateTotalPrice = (key: string) => {
    cars.map((car: car, i: number) => {
      if (car.key === key) {
        let carPrice = car.price
        if (locationReservation === 'enVille') {
          carPrice = carPrice * numberDays
          setTotalPrice(carPrice)
        } else if (locationReservation === 'horsVille') {
          setTotalPrice(carPrice * numberDays + 10000 * numberDays)
        } else {
          carPrice =
            carPrice * dayTown + carPrice * dayOutTown + 10000 * dayOutTown
          setTotalPrice(carPrice)
        }
      }
    })
  }
  useEffect(() => {
    showSlides(slideIndex)
    cars.map((car: car, i: number) => {
      if (slideIndex === ++i) {
        setSelectedCar(car.key)
      }
    })
  }, [slideIndex])
  useEffect(() => {
    changeSlide()
  }, [check])
  useEffect(() => {
    changeSlideSelect(selectedCar)
    calculateTotalPrice(selectedCar)
  }, [selectedCar, numberDays, dayOutTown, dayTown])
  useEffect(() => {
    resetPrice()
  }, [locationReservation])
  useEffect(() => {
    setNumberDays(dayOutTown + dayTown)
  }, [dayOutTown, dayTown])
  useEffect(() => {
    if (numberDays > 30) {
      setNumberDays(30)
    }
    if (dayOutTown + dayTown > 30) {
      setDayTown(1)
      setDayOutTown(29)
    }
    if (
      numberDays < 1 ||
      dayOutTown < 1 ||
      dayTown < 1 ||
      String(numberDays) == 'NaN' ||
      String(dayOutTown) == 'NaN' ||
      String(dayTown) == 'NaN'
    ) {
      setDayTown(1)
      setDayOutTown(1)
      setNumberDays(1)
    }
  }, [numberDays, dayOutTown, dayTown])
  return (
    <section className="wrapper bg-dark bg-content text-black d-flex active">
      <div
        className="container d-flex justify-content-center flex-column my-6"
        style={{ zIndex: 5, position: 'relative' }}
      >
        <div
          id="nav_estimation"
          className="d-flex row align-items-center justify-content-between"
        >
          <h1 className="title text--dark text-center text-uppercase">
            {findElementByKey('estimation_cout_titre')}
          </h1>
          <div
            className="col-10 col-md-6 col-lg-5 flex-grow-1 flex-grow-lg-0 content  text-lg-start"
            data-group="page-title"
          >
            <div className="d-flex col-12 col-lg-8 justify-content-center justify-content-md-between">
              <form action="/">
                <div className="form-group">
                  <label
                    htmlFor="feedback-user"
                    className="form-label"
                  >
                    {findElementByKey('label_choix_vehicule')}
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={(e) => {
                      setSelectedCar(e.target.value)
                    }}
                    value={selectedCar}
                  >
                    {cars.map((car: car, i: number) => {
                      return (
                        <option
                          key={i}
                          value={car.key}
                        >
                          {car.model}
                        </option>
                      )
                    })}
                  </select>
                </div>
                <div className="">
                  <label
                    htmlFor="feedback-user"
                    className="form-label d-block"
                  >
                    {findElementByKey('label_booking_options')}
                  </label>
                  <div className="d-flex flex-wrap">
                    <div
                      className="form-check form-check-inline"
                      style={{ textAlign: 'left' }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="flexRadioDefault1"
                        checked={locationReservation === 'enVille'}
                        value="enVille"
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault1"
                      >
                        {findElementByKey('label_en_ville')}
                      </label>
                    </div>
                    <div
                      className="form-check form-check-inline"
                      style={{ textAlign: 'left' }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="flexRadioDefault2"
                        onChange={handleChange}
                        value="horsVille"
                        checked={locationReservation === 'horsVille'}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        {findElementByKey('label_hors_ville')}
                      </label>
                    </div>
                    <div
                      className="form-check form-check-inline"
                      style={{ textAlign: 'left' }}
                    >
                      <input
                        className="form-check-input"
                        type="radio"
                        id="flexRadioDefault2"
                        onChange={handleChange}
                        value="lesDeux"
                        checked={locationReservation === 'lesDeux'}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexRadioDefault2"
                      >
                        {findElementByKey('label_les_deux')}
                      </label>
                    </div>
                  </div>
                </div>
                {locationReservation !== 'lesDeux' ? (
                  <div className="form-group">
                    <label
                      htmlFor="feedback-user"
                      className="form-label"
                    >
                      {findElementByKey('label_nombre_jour')}
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="email"
                      value={numberDays}
                      placeholder={`${findElementByKey('label_nombre_jour')}`}
                      name="email"
                      min={1}
                      max={30}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setNumberDays(parseFloat(e.target.value))
                      }}
                      disabled={locationReservation === 'lesDeux'}
                    />
                  </div>
                ) : (
                  <div className="d-flex flex-column flex-md-row justify-content-between">
                    <div className="form-group col-12 col-md-6 col-lg-5">
                      <label
                        htmlFor="feedback-user"
                        className="form-label"
                      >
                        {findElementByKey('label_nombre_jour_en_ville')}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="email"
                        value={dayTown}
                        placeholder={`${findElementByKey(
                          'label_nombre_jour_en_ville'
                        )}`}
                        name="email"
                        min={1}
                        max={29}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setDayTown(parseFloat(e.target.value))
                        }}
                        disabled={locationReservation !== 'lesDeux'}
                      />
                    </div>
                    <div className="form-group col-12 col-md-6 col-lg-5">
                      <label
                        htmlFor="feedback-user"
                        className="form-label"
                      >
                        {findElementByKey('label_nombre_jour_hors_ville')}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="email"
                        value={dayOutTown}
                        placeholder={`${findElementByKey(
                          'label_nombre_jour_hors_ville'
                        )}`}
                        name="email"
                        min={1}
                        max={29}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setDayOutTown(parseFloat(e.target.value))
                        }}
                        disabled={locationReservation !== 'lesDeux'}
                      />
                    </div>
                  </div>
                )}
                <span
                  style={{
                    fontSize: '0.75rem',
                  }}
                  className="msg_add_price_outTown"
                >
                  {findElementByKey('msg_add_price_outTown')}
                </span>
                <div className="d-flex mt-4 align-items-center flex-column justify-content-between">
                  <div style={{ color: 'white', fontSize: 'larger' }}>
                    {findElementByKey('texte_total_estimation')}
                    &nbsp;
                    <span>
                      {locationReservation === 'lesDeux'
                        ? dayTown + dayOutTown
                        : numberDays}
                    </span>
                    &nbsp;
                    {findElementByKey('texte_total_estimation_suite')}
                    &nbsp;
                    <span
                      style={{
                        fontSize: '12px',
                      }}
                    >
                      :&nbsp;{findElementByKey('monnaie_value')}
                    </span>{' '}
                    {totalPrice}
                  </div>
                  <div
                    className="mt-4 d-none d-lg-block"
                    style={{ width: '100%' }}
                  >
                    <li className="nav-item mt-4 btn-nav_reserver list-unstyled mt-lg-0">
                      <a
                        href="https://www.blackwalker.com/book-a-car/"
                        className="btn btn-md btn-light rounded nav-link"
                        style={{ color: '#343f52', width: '100%' }}
                      >
                        {findElementByKey('nav_reserver')}
                      </a>
                    </li>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-5 offset-md-1 mt-4">
            <div
              className="card shadow-xl mt-md-n1 "
              data-nav="true"
              data-margin="5"
            >
              <div className="slideshow-container">
                <>
                  {cars.map((car: car, i: number) => (
                    <div
                      className="mySlides"
                      key={i}
                    >
                      <div className="numbertext">
                        {i + 1} / {cars.length}
                      </div>
                      <img
                        className="rounded d-block w-100"
                        style={{ width: '100%' }}
                        alt="Image car"
                        src={car.car_image.url}
                      />
                      <div className="d-flex align-items-center">
                        <img
                          src="/img/toyota.png"
                          className="icon-svg icon-svg-xs solid-duo text-grape-fuchsia mt-1 me-3"
                          style={{ width: '1.5rem', height: '1.5rem' }}
                          alt=""
                        />
                        <div>
                          <div
                            className="brand"
                            style={{ fontSize: 'bold' }}
                          >
                            {car.brand}
                          </div>
                          <div className="model">{car.model}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <a
                    className="prev"
                    onClick={() => prevSlide(1)}
                  >
                    ❮
                  </a>
                  <a
                    className="next"
                    onClick={() => nextSlide(1)}
                  >
                    ❯
                  </a>
                </>
              </div>
              <br />
              <div style={{ textAlign: 'center' }}>
                {cars.map((car: car, i: number) => {
                  return (
                    <span
                      key={i}
                      className="dot"
                      onClick={() => currentSlide(++i)}
                    ></span>
                  )
                })}
              </div>
            </div>
            <div
              className="mt-4 d-block d-lg-none"
              style={{ width: '100%' }}
            >
              <li className="nav-item mt-4 btn-nav_reserver list-unstyled mt-lg-0">
                <a
                  href="https://www.blackwalker.com/book-a-car/"
                  className="btn btn-md btn-light rounded nav-link"
                  style={{ color: '#343f52', width: '100%' }}
                >
                  {findElementByKey('nav_reserver')}
                </a>
              </li>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
