
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ConfirmationPage from '../pages/ConfirmationPage'

import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Clients from '../pages/Clients';
import CompletedTasks from '../pages/CompletedTasks';
import Reports from '../pages/Reports';



export default function Routes() {
  return (
    <Switch>
      <Route exact path="/" component={SignIn} />
      <Route exact path="/register" component={SignUp} />
      <Route exact path="/confirmation" component={ConfirmationPage} />
      <Route exact path="/dashboard" component={Dashboard} isPrivate />
      <Route exact path="/completedtasks" component={CompletedTasks} isPrivate />
      <Route exact path="/reports" component={Reports} isPrivate />
      <Route exact path="/profile" component={Profile} isPrivate />
      <Route exact path="/clients" component={Clients} isPrivate />

    </Switch>
  )
}