import React, { Component } from "react"
import styled from "styled-components"
import Header from "./Header"
import styles from "../utilities/styles"
import Spacing from "./Spacing"

export default class AppScrollContainer extends Component {
  onScroll() {
    console.log("ON SCROLL")

    var el = document.getElementById("scroll")
    var minPixel = el.offsetTop
    var maxPixel = minPixel + el.scrollHeight
    var value = document.body.scrollTop

    // respect bounds of element
    var percent = (value - minPixel) / (maxPixel - minPixel)
    percent = Math.min(1, Math.max(percent, 0)) * 100

    console.log(el.scrollHeight)
    console.log(percent)
  }

  render() {
    const { user, fullwidth = false } = this.props
    return (
      <Container onScroll={this.onScroll} id="scroll">
        <Header
          user={user}
          backText={this.props.backText || "Back"}
          title={this.props.title || "Remix"}
        />
        <Spacing size={120} />
        <Scroll fullwidth={fullwidth}>
          <PaddingContainer>{this.props.children}</PaddingContainer>
        </Scroll>
      </Container>
    )
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${styles.colors.grey[100]};
  height: 100vh;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
`

const PaddingContainer = styled.div`
  padding: 25px;
  width: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  @media (min-width: 999px) {
    padding: 20px;
  }
`

const Scroll = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-self: center;
  ${props => (!props.fullwidth ? "max-width: 1000px" : "")};

  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 20px;
  }

  ::-webkit-scrollbar-track {
    background: #f8f8f8;
    border-radius: 20px;
  }
`