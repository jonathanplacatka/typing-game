import { useEffect, useRef, useState } from "react";
import LogoV1 from "image/LogoV1.svg"
import image1 from "image/image1.svg"
import Image from "next/image";
import { useRouter } from 'next/navigation'


export default function UsernameForm() {

    const router = useRouter();

    const [inputValue, setInputValue] = useState('');
    const usernameButtonRef = useRef<HTMLButtonElement>(null);
    const [changedUsername, setChangedUsername] = useState(false);
    const [hasUsernameError, setHasUsernameError] = useState(false);

    const changeUsername = () => {
        
        if (usernameButtonRef.current) {
            if (inputValue.trim().length < 3) {

                setHasUsernameError(true);

            } else {
                sessionStorage.setItem('username', inputValue);

                setChangedUsername(prevState => !prevState)
                setHasUsernameError(false);

                setTimeout(() => {
                    if (usernameButtonRef.current) {
                        setChangedUsername(prevState => !prevState)
                    }
                }, 2000)
            }
        }
    }

    useEffect(() => {

        let username: string | null = sessionStorage.getItem("username");
        if (username) {
            setInputValue(username)
        }

    }, [])

    return (
        <div className="flex justify-center min-w-96">
            <div className='flex flex-col items-center bg-gray-accent rounded-lg p-6 mt-6 w-full'>

                    <span className="items-start text-white">Username - <em>Optional</em></span>

                    <input 
                        className={`p-2 rounded ${hasUsernameError ? 'border-2 border-red-600' : 'border border-gray-300'} bg-white mt-6 text-black w-52`}
                        placeholder="Minimum 3 characters"
                        minLength={3}
                        value={inputValue}
                        type="text"
                        onChange={(e) => setInputValue(e.target.value)}>
                    </input>

                    <span className={`mb-3 text-red-600 ${hasUsernameError ? 'opacity-100' : 'opacity-0'}`}>Name must be 3 characters</span>

                    <button 
                        ref={usernameButtonRef} 
                        disabled={changedUsername} 
                        className={`btntext  ${changedUsername ? 'bg-gray-400' : 'border border-white hover:bg-blue-700text-white'}  text-white rounded-lg px-3 py-2 min-w-[140px]`} 
                        onClick={changeUsername}> {`${changedUsername ? 'Name Changed!' : 'Change'}`}
                    </button>
            </div>
        </div>  
    );
}