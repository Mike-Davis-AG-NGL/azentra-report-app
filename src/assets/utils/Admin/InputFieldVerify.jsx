// import React from 'react';
import styled from 'styled-components';

export const InputFieldVerify = ({ value, onChange, onVerify, loading }) => {
    return (
        <StyledWrapper>
            <div className="search">
                <input
                    placeholder="Enter OTP..." type="text" value={value}
                    onChange={onChange} maxLength={8} disabled={loading}
                />
                <button type="submit" onClick={onVerify} disabled={loading}>Verify</button>
            </div>
        </StyledWrapper>
    );
}

const StyledWrapper = styled.div`
  .search {
    display: inline-block;
    position: relative;
  }

  .search input[type="text"] {
    width: 250px;
    padding: 10px;
    border: none;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .search button[type="submit"] {
    background-color: #4e99e9;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    right: 0;
    transition: .9s ease;
  }

  .search button[type="submit"]:hover {
    transform: scale(1.1);
    color: rgb(255, 255, 255);
    background-color: blue;
  }`;
