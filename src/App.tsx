import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import styled, { CSSProperties } from "styled-components";
import Device from "./Breakpoints";

import Countries from "./countries.json";

type CountryCode = keyof typeof Countries;

const primary = "191919";
const secondary = "F6E4F6";
const correct = "218380 ";
const incorrect = "E3655B";
const contrast = "C6D8D3";
const contrast2 = "218380";

const StyledApp = styled.div<{ isCorrect: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    overflow-x: hidden;
    overflow-y: hidden;
    align-items: center;
    background-color: ${`#${primary}`};
    height: 100vh;
    width: 100vw;

    .title {
        color: ${`#${secondary}`};
        font-size: 2.5rem;
        padding: 0px;
        margin: 0px;
    }

    .flag {
        width: 35%;
        aspect-ratio: 16 / 9;
        border: solid ${`#${secondary}`} 4px;
        border-radius: 24px;

        @media ${Device.lg} {
            width: 80%;
        }
    }

    .streak {
        color: ${`#${secondary}`};
        font-size: 0.8rem;
    }

    .options {
        width: 35%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;

        @media ${Device.lg} {
            width: 80%;
        }
    }

    .button {
        font-size: 1rem;
        width: 15rem;
        flex-grow: 1;
        padding: 1rem 2rem;
        border: none;
        border-radius: 24px;
        background-color: ${`#${secondary}`};
        color: ${`#${primary}`};

        transition: background-color 0.6s;

        @media (min-width: 800px) {
            &:hover {
                background-color: ${`#${contrast}`};
            }
        }

        @media ${Device.lg} {
            font-size: 0.8rem;
        }
    }

    .next {
        background-color: ${`#${contrast2}`};
        color: ${`#${primary}`};
        min-width: 24ch;
        flex-grow: 0;
        font-size: 1rem;

        &:hover {
            background-color: ${`#${contrast2}`};
            box-shadow: 0px 4px 5px 2px ${`#${secondary}`};
        }

        transition: box-shadow 0.4s;

        @media ${Device.lg} {
            font-size: 0.8rem;
            min-width: 0ch;
            padding: 1rem 2rem;
        }
    }

    .modal {
        position: absolute;
        width: 100vw;
        padding: 4rem;
        opacity: 0;
        top: auto;
        left: auto;
        display: flex;
        flex-direction: column;
        gap: 20px;
        justify-content: center;
        align-items: center;
        background-color: ${`#${contrast}`};
        font-size: 2rem;
        color: ${`#${primary}`};
        overflow-x: hidden;
        overflow-y: hidden;

        ${(props) => (props.isCorrect ? "opacity: 1;" : "")}
        transition: opacity 1s;
        z-index: 999;

        @media ${Device.lg} {
            padding: 2rem;
            font-size: 1rem;
        }
    }
`;

function App() {
    const [country, setCountry] = useState<CountryCode>("AD");
    const [isCorrect, setIsCorrect] = useState(false);
    const [options, setOptions] = useState<Array<CountryCode>>([]);
    const [incorrectAnswers, setIncorrectAnswers] = useState<
        Array<CountryCode>
    >([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const countryCodes: CountryCode[] = Object.keys(
        Countries
    ) as unknown as CountryCode[];

    const randomInRange = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    const getRandomCountry = () => {
        return countryCodes[randomInRange(0, countryCodes.length)];
    };

    const nextCountry = () => {
        // Choose a random country from list
        var nextCountry = getRandomCountry();
        var nextOptions = [nextCountry];
        while (nextOptions.length < 4) {
            var possibleOption = getRandomCountry();
            if (!nextOptions.includes(possibleOption)) {
                nextOptions.push(possibleOption);
            }
        }
        setCountry(nextCountry);
        setOptions(nextOptions);
        setIncorrectAnswers([]);
        setIsCorrect(false);
    };

    const checkAnswer = (val: CountryCode) => {
        if (val === country) {
            setIsCorrect(true);
            if (incorrectAnswers.length === 0) {
                setCurrentStreak(currentStreak + 1);
            }
        } else {
            setIncorrectAnswers([...incorrectAnswers, val]);
            setCurrentStreak(0);
        }
    };

    const getOptionsInRandomOrder = (): CountryCode[] => {
        var usedIndexes: number[] = [];
        var nextOptions: CountryCode[] = [];
        while (usedIndexes.length < 4) {
            var index = randomInRange(0, 4);
            if (!usedIndexes.includes(index)) {
                usedIndexes.push(index);
                nextOptions.push(options[index]);
            }
        }
        return nextOptions;
    };

    useEffect(() => {
        nextCountry();
    }, []);

    const inIncorrectAnwers = (option: CountryCode): boolean => {
        return incorrectAnswers.includes(option);
    };

    return (
        <StyledApp className="App" isCorrect={isCorrect}>
            <img
                className="flag"
                src={`images/${country.toLowerCase()}.png`}
                alt="Country Flag"
            />
            <div className="options">
                {getOptionsInRandomOrder().map((option) => {
                    return (
                        <button
                            className="button"
                            onClick={() => checkAnswer(option)}
                            style={
                                inIncorrectAnwers(option)
                                    ? { backgroundColor: `#${incorrect}` }
                                    : isCorrect && option === country
                                    ? { backgroundColor: `#${correct}` }
                                    : undefined
                            }
                            disabled={inIncorrectAnwers(option) || isCorrect}
                        >
                            {Countries[option]}
                        </button>
                    );
                })}
            </div>

            {/* <h1 className="title">Guess the Flag</h1> */}
            <p className="streak">Streak: {currentStreak}</p>

            {isCorrect ? (
                <div className="modal">
                    <div>Correct!</div>
                    <button className="button next" onClick={nextCountry}>
                        Next Country
                    </button>
                </div>
            ) : null}
        </StyledApp>
    );
}

export default App;
