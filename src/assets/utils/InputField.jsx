import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react"

export const InputField = ({ placeholder, mode = "text", theme, onChange, value }) => {
    const [showPW, setShowPW] = useState(false);

    const getInputType = () => {
        if (mode === "password") return showPW ? "text" : "password"
        if (mode === "email") return "email"
        if (mode === "mobile") return "tel"
        return "text"
    }

    const handleMobileInput = (e) => {
        if (mode !== "mobile") return;
        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10)
    }

    return (
        <>
            <style>{`
                .input-wrapper {
                    position: relative;
                    display: block;
                    width: 100%;
                }
                
                .input {
                    width: 100%;
                    box-sizing: border-box;
                    border: none;
                    outline: none;
                    border-radius: 15px;
                    padding: 1em;
                    padding-right: ${mode === "password" ? "3em" : "1em"}
                    background-color: ${theme.primaryBg};
                    box-shadow: inset 2px 5px 10px ${theme.shadow};
                    transition: 300ms ease-in-out;
                }

                .input:focus {
                    background-color: ${theme.primaryBg};
                    transform: scale(1.05);
                    box-shadow: 13px 13px 100px #969696,
                                -13px -13px 100px #ffffff;
                }

                .eye {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    color: ${theme.primaryAccent}
                }

                .eye:hover {
                    color: ${theme.accentHover}
                }
            `}</style>

            <div className="input-wrapper">
                <input type={getInputType()} autoComplete="off" className="input" placeholder={placeholder} value={value}
                    maxLength={mode === "mobile" ? 10 : undefined} onInput={handleMobileInput} onChange={onChange}></input>

                {mode === "password" && (
                    <span className="eye" onClick={() => setShowPW(!showPW)}>
                        {showPW ? <VisibilityOff /> : <Visibility />}
                    </span>
                )}
            </div>
        </>
    )
}