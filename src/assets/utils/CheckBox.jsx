export const CheckBox = ({ theme, value, setValue }) => {
    return (
        <>
            <style>{`
            .check {
                position: relative;
                width: 20px;
                height: 20px;
                border-radius: 2px;
                appearance: none;
                background-color: ${theme.primaryBg};
                border: 1px solid ${theme.cardBorder};
                transition: all .3s;
            }

            .check::before {
                content: '';
                position: absolute;
                border: solid ${theme.primaryText};
                display: block;
                width: .3em;
                height: .6em;
                border-width: 0 .2em .2em 0;
                z-index: 1;
                opacity: 0;
                right: calc(50% - .3em);
                top: calc(50% - .6em);
                transform: rotate(0deg);
                transition: all .3s;
                transform-origin: center center;
            }

            .check:checked {
                animation: a .3s ease-in forwards;
                background-color: ${theme.primaryAccent};
            }

            .check:checked::before {
                opacity: 1;
                transform: rotate(405deg);
            }

            @keyframes a {
                0% {
                    opacity: 1;
                    transform: scale(1) rotateY(0deg);
                }

                50% {
                    opacity: 0;
                    transform: scale(.8) rotateY(180deg);
                }

                100% {
                    opacity: 1;
                    transform: scale(1) rotateY(360deg);
                }
            }
            `}</style>

            <input className="check" type="checkbox" defaultChecked={false}
                checked={value} onChange={e => setValue(e.target.checked)}></input>
        </>
    )
}