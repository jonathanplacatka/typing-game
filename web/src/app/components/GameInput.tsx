import { KeyboardEventHandler, useEffect, useMemo, useRef, useState } from "react";
import CharState from "../interfaces/CharState";
import { flushAllTraces } from "next/dist/trace";


import { Inconsolata } from "next/font/google";


const inconsolata = Inconsolata({subsets: ['latin']});

interface GameInputProps {
    gameText: string
    userInput: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onCorrectInput: () => void
    hasGameEnded: boolean
    hasGameStarted: boolean
}

export default function GameInput({gameText, userInput, onChange, onCorrectInput, hasGameEnded, hasGameStarted}: GameInputProps) {

    const [inputString, setInputString] = useState(userInput);
    const [isTyping, setIsTyping] = useState(false); 
    const isTypingTimeout = useRef(0);

    const inputRef = useRef<HTMLInputElement>(null);

    if (inputRef.current && hasGameStarted) {
        inputRef.current.focus();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> ) => {
        setInputString(e.target.value);
        onChange(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setIsTyping(true);
        if(isTypingTimeout.current) {
            clearTimeout(isTypingTimeout.current);
        }
    }

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        isTypingTimeout.current = window.setTimeout(() => {setIsTyping(false)}, 500);
    }
    

    const renderText = () => {

        const caretPosition = inputString.length;

        const beforeCaret = gameText.slice(0, caretPosition);
        const afterCaret = gameText.slice(caretPosition);

        return (
            <>
                <div>
                    <span>{beforeCaret}</span>
                    <span className={`caret ${!isTyping && ' caret-blink'}`}></span>
                    <span style={{color: 'gray'}}>{afterCaret}</span>
                </div>
            </>
          );

    } 


    return (
        <div className="relative my-5">
            <input 
                ref={inputRef}
                className=" left-0 top-0 h-full w-full "
                type="text"
                value={inputString} 
                autoFocus
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onKeyUp={handleKeyUp}
                disabled={hasGameEnded}
            />

            <div>
                {renderText()}
            </div>
        </div>
    );
}