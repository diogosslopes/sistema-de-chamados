
import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/auth'

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}){

  const {signed, loading, loggedIn} = useContext(AuthContext)
  
  

  if(loading){
    return(
      <div></div>
    )
  }
 console.log(loggedIn)
  if(!signed && isPrivate){
    return <Redirect to="/" />
  }

  if(signed && !isPrivate){
    return <Redirect to="/dashboard" />
  }


  return(
    <Route
      {...rest}
      render={ props => (
        <Component {...props} />
      )}
    />
  )
}