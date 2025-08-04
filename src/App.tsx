import { Route, Switch } from 'wouter'
import { Home } from './pages/Home'
import { Swap } from './pages/Swap'
import Demo from './pages/Demo'

export function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/swap" component={Swap} />
      <Route path="/demo" component={Demo} />
    </Switch>
  )
}