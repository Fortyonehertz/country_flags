import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
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

    .bottom {
        width: 100%;
        height: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        font-size: 0.8rem;

        .game {
            width: 35%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
    
            .score {
                color: ${`#${secondary}`};
                font-size: 0.8rem;
            }
        
            .options {
                width: 100%;
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 1rem;
        
                @media ${Device.lg} {
                    width: 80%;
                }
            }
        }

        .correct {
            color: ${`#${secondary}`};
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
    
            .subtitle {
                font-size: 2rem;
            }
    
            .next {
                background-color: ${`#${contrast2}`};
                color: ${`#${secondary}`};
                min-width: 24ch;
                flex-grow: 0;
                font-size: 1rem;
        
                &:hover {
                    background-color: ${`#${contrast2}`};
                    box-shadow: 0px 6px 16px -8px ${`#${secondary}`};
                }
        
                transition: box-shadow 0.4s;
        
                @media ${Device.lg} {
                    font-size: 0.8rem;
                    min-width: 0ch;
                    padding: 1rem 2rem;
                }
            }
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

        @media (hover: hover) {
            &:hover {
                background-color: ${`#${contrast}`};
            }
        }

        @media (hover: none) {
            &:hover {
                background-color: ${`#${secondary}`};
            }
        }

        @media ${Device.lg} {
            font-size: 0.8rem;
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
    const [currentScore, setCurrentScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const countryCodes: CountryCode[] = Object.keys(
        Countries
    ) as unknown as CountryCode[];

    console.log('Rerender')

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
        setOptions(randomiseOptions(nextOptions));
        setIncorrectAnswers([]);
        setIsCorrect(false);
    };

    const checkAnswer = (val: CountryCode) => {
        if (val === country) {
            setIsCorrect(true);
            if (incorrectAnswers.length === 0) {
                if (currentScore + 1 > bestScore) {
                    setBestScore(currentScore + 1);
                }
                setCurrentScore(currentScore + 1);
            }
        } else {
            setIncorrectAnswers([...incorrectAnswers, val]);
            setCurrentScore(0);
        }
    };

    const randomiseOptions = (selectedOptions: CountryCode[]): CountryCode[] => {
        var usedIndexes: number[] = [];
        var nextOptions: CountryCode[] = [];
        while (usedIndexes.length < 4) {
            var index = randomInRange(0, 4);
            if (!usedIndexes.includes(index)) {
                usedIndexes.push(index);
                nextOptions.push(selectedOptions[index]);
            }
        }
        return nextOptions;
    }

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
            

            <div className="bottom">
                {isCorrect ? (
                    <div className="correct">
                        <div className="subtitle">Correct!</div>
                        You chose: {Countries[country]}
                        <button className="button next" onClick={nextCountry}>
                            Next Country
                        </button>
                        {(currentScore === bestScore && currentScore > 0) ? <div>New high score! {bestScore}</div> : null }
                    </div>
                ) : <div className="game">
                        <div className="options">
                            {options.map((option) => {
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
                        <p className="score">Score: {currentScore}</p>
                    </div>
                }
            </div>
        </StyledApp>
    );
}

export default App;
