import React from "react";
import styled from "styled-components";
import { SIGNALS_BY_CODE } from "../../utils";

const TARGET = [
  "who",
  "the",
  "fuck",
  "is",
  "scraeming",
  "log",
  "off",
  "at",
  "my",
  "house",
  "stop",
  "show",
  "yourself",
  "coward",
  "stop",
  "i",
  "will",
  "never",
  "log",
  "off",
  "stop",
];

function TempHelper({ currentWord, text }) {
  const numberOfWords = text.split(" ").length - 1;
  const targetWord = numberOfWords < TARGET.length ? TARGET[numberOfWords] : "";
  const curWordLen = currentWord ? currentWord.length : 0;
  if (curWordLen >= targetWord.length) {
    return null;
  }
  const targetChar = targetWord[curWordLen];
  const targetSignal = SIGNALS_BY_CODE[targetChar];

  return (
    <Wrapper>
      <span>{targetChar}</span>
      <span>{targetSignal}</span>
    </Wrapper>
  );
}

const Wrapper = styled.p`
  display: flex;
  width: 80px;
  justify-content: space-between;
  font-size: 1.5em;
  position: absolute;
  left: 180px;
  top: 200px;
`;

export default TempHelper;
