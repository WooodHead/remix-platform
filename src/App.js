import React from "react"
import { Provider } from "react-redux"
import { ApolloProvider } from "react-apollo"
import store from "./utilities/storage/store"
import Routing, { Router } from "./utilities/routing"
import { Platform, Text } from "react-native"

import { query, mutate } from "./utilities/gql_util"
import { remove } from "./utilities/storage"

import { client } from "./utilities/apollo"

import Home from "./screens/Home"
import Group from "./screens/Group"
import Chat from "./screens/Chat"
import User from "./screens/User"
import Dashboard from "./screens/Dashboard"

import UserLogin from "./screens/UserLogin"
import UserCreate from "./screens/UserCreate"
import UserCreateDone from "./screens/UserCreateDone"
import FriendNew from "./screens/FriendNew"
import GroupCreate from "./screens/GroupCreate"

import { bind } from "decko"
import { get } from "./utilities/storage"

import { Switch } from "react-router"

const Route = Routing.Route
const Link = Routing.Link

class App extends React.Component {
  state = {
    user: undefined,
    loading: true,
  }

  @bind
  setUser(user) {
    this.setState({ user })
  }

  @bind
  renderWithoutUser() {
    // const Stack = require("react-router-native-stack").default

    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route
          exact
          path="/login"
          component={() => <UserLogin setUser={this.setUser} />}
        />
        <Route exact path="/create" component={UserCreate} />
        <Route exact path="/create/done" component={UserCreateDone} />
      </Switch>
    )
  }

  @bind
  renderWithUser() {
    const { user } = this.state
    // const Stack = require("react-router-native-stack").default

    return (
      <Switch>
        <Route
          exact
          path="/"
          component={() => <Dashboard user={user} />}
          animationType="slide-vertical"
        />
        <Route path="/+:group/" component={Group} />
        <Route path="/+:group/#:chat" component={Chat} />
        <Route path="/@:id" component={User} />
        <Route path="/new/friend" component={() => <FriendNew user={user} />} />
        <Route
          path="/new/group"
          component={() => <GroupCreate user={user} />}
        />
      </Switch>
    )
  }

  @bind
  renderMobileRouting() {
    const { user, loading } = this.state
    if (loading) return <Text>Loading</Text>
    if (user) return this.renderWithUser()
    else return this.renderWithoutUser()
  }

  renderWebRouting() {
    return <Text>On the web</Text>
  }

  @bind
  async checkLogin() {
    console.log("[AUTH] Checking authentication")

    const token = await get("token")
    const id = await get("userId")
    let data

    console.log(token, id)

    try {
      data = await query(`{ User(id: ${id}) { id } }`)
    } catch (e) {
      remove("token")
      remove("userId")
      console.log("errorrrr")
      console.log(JSON.stringify(e))
    }

    if (data) {
      console.log("[AUTH] User is authenticated")
      this.setState({
        loading: false,
        user: {
          id,
          token,
        },
      })
    } else {
      console.log("[AUTH] User is not authenticated")
      this.setState({ loading: false, user: undefined })
    }
  }

  componentDidMount() {
    this.checkLogin()
  }

  renderRouting() {
    switch (Platform.OS) {
      case "ios":
        return this.renderMobileRouting()
      default:
      case "web":
        // return this.renderWebRouting()
        return this.renderMobileRouting()
    }
  }

  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <Provider store={store}>{this.renderRouting()}</Provider>
        </Router>
      </ApolloProvider>
    )
  }

  // async registerPushNotifs() {
  //   const { status: { existingStatus } } = await Permissions.getAsync(
  //     Permissions.NOTIFICATIONS
  //   )
  //   let finalStatus = existingStatus

  //   if (existingStatus !== "granted") {
  //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
  //     finalStatus = status
  //   }

  //   if (finalStatus !== "granted") {
  //     return
  //   }

  //   let token = await Notifications.getExpoPushTokenAsync()
  // }
}

export default App
