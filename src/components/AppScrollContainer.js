import React, { Component } from "react"
import styled from "styled-components/native"
import Routing, { Router } from "../utilities/routing"
const Route = Routing.Route
const Link = Routing.Link

import Header from "./Header"
import { ScrollView } from "react-native"
import styles from "../utilities/styles"

export default class AppScrollContainer extends Component {
  render() {
    const { user } = this.props
    return (
      <Container>
        <Header
          user={user}
          backText={this.props.backText || "Back"}
          title={this.props.title || "Remix"}
        />
        <ScrollView
          contentContainerStyle={{ margin: 15, marginTop: 135 }}
          ref={scroll => {
            this.scrollView = scroll
          }}
        >
          {this.props.children}
        </ScrollView>
      </Container>
    )
  }
}

const Container = styled.View`
  flex: 1;
  background-color: ${styles.colors.grey[100]};
`

const Text = styled.Text`
  font-size: 17px;
`
