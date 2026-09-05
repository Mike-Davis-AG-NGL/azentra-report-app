import { UseTheme } from "../Controllers/UseTheme"
import { COLORS } from "./colors"

export const ButtonXS = ({ name, onClick }) => {
    const theme = UseTheme()
    return (
        <>
            <style>{`
                .buttonxs {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 5px;
                    background: ${theme.primaryAccent};
                    font-family: "Montserrat", sans-serif;
                    box-shadow: 0px 6px 24px 0px ${theme.shadow};
                    overflow: hidden;
                    cursor: pointer;
                    border: none;
                }

                .buttonxs:after {
                    content: " ";
                    width: 0%;
                    height: 100%;
                    background: ${theme.accentHover};
                    position: absolute;
                    transition: all 0.4s ease-in-out;
                    right: 0;
                }

                .buttonxs:hover::after {
                    right: auto;
                    left: 0;
                    width: 100%;
                }

                .buttonxs span {
                    text-align: center;
                    text-decoration: none;
                    width: 100%;
                    padding: 2px 4px;
                    color: ${COLORS.primaryText};
                    font-size: 1.125em;
                    font-weight: 700;
                    letter-spacing: 0.3em;
                    z-index: 20;
                    transition: all 0.3s ease-in-out;
                }

                .buttonxs:hover span {
                    color: ${theme.primaryAccent};
                    animation: scaleUp 0.3s ease-in-out;
                }

                @keyframes scaleUp {
                    0% {
                        transform: scale(1);
                    }

                    50% {
                        transform: scale(0.95);
                    }

                    100% {
                        transform: scale(1);
                    }
                }
            `}</style>

            <button className="buttonxs" onClick={onClick}>
                <span>{name}</span>
            </button>

        </>
    )
}