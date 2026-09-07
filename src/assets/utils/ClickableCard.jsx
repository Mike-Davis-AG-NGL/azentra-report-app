// import React from 'react';
import styled from 'styled-components';
import { UseTheme } from '../Controllers/UseTheme';

export const ClickableCard = ({ content, onClick }) => {
    const theme = UseTheme()
    return (
        <StyledWrapper
            $cardBg={theme.cardBg}
            $cardBorder={theme.cardBorder}
            $shadow={theme.cardBorder}
            onClick={onClick}
        >
            <div className="card">
                {content}
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .card {
    box-sizing: border-box;
    width: 190px;
    height: 254px;
    background: ${(props) => props.$cardBg};
    border: 2px solid ${(props) => props.$cardBorder};
    box-shadow: 5px 10px 30px ${(props) => props.$shadow};
    backdrop-filter: blur(6px);
    border-radius: 17px;
    text-align: center;
    cursor: pointer;
    transition: all 0.5s;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    font-weight: bolder;
    color: black;
    padding: 150px 120px;
  }

  .card:hover {
    border: 1px solid black;
    transform: scale(1.05);
  }

  .card:active {
    transform: scale(0.95) rotateZ(1.7deg);
  }`;