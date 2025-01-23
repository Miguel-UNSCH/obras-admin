import React from "react";
import styled from "styled-components";
import { FaYoutube } from "react-icons/fa";
import Link from "next/link";

const ButtonTutorial = () => {
  return (
    <StyledWrapper>
      <Link href="https://www.youtube.com/embed/rs1YAkfF8QM?si=ZqGCtTI1EYK4sWnI">
        <div>
          <button className="button">
            <FaYoutube className="icon" />
            Ver tutorial
          </button>
        </div>
      </Link>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    --bezier: cubic-bezier(0.22, 0.61, 0.36, 1);
    --edge-light: hsla(0, 0%, 50%, 0.8);
    --text-light: rgba(255, 255, 255, 0.4);
    --back-color: 240, 40%;

    cursor: pointer;
    padding: 0.7em 1em;
    border-radius: 0.8em;
    min-height: 2.4em;
    min-width: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;

    font-size: 18px;
    letter-spacing: 0.05em;
    line-height: 1;
    font-weight: bold;

    background: #ffedd5;
    color: #22252a;
    border: 2px solid #fbb889;

    transition: all 0.2s var(--bezier);
  }

  .button:hover {
    background: #ffedd5;
    color: #22252a;
    transform: scale(1.1);
  }

  .button:active {
    background: #ffedd5;
    border: 2px solid #ef7f81;
    color: #22252a;
    letter-spacing: 0.1em;
    transform: scale(1);
  }

  .icon {
    font-size: 20px;
    transition: color 0.3s ease;
  }

  .button:hover .icon {
    color: red;
  }
`;

export default ButtonTutorial;
