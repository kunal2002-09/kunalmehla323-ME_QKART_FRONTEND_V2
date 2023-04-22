import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
import Admin from "./components/Admin"
export const config = {
  endpoint: `https://qkart-7qcg.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
      {/* <Register /> */}
      <Switch>
        
        <Route path={"/admin"}>
          <Admin />
        </Route>
        <Route path={"/login"}>
          <Login />
        </Route>
        <Route path={"/register"}>
          <Register />
        </Route>
         <Route exact={true} path="/checkout">
          <Checkout></Checkout>
        </Route>
         <Route exact={true} path="/thanks">
          <Thanks></Thanks>
        </Route>
        <Route path={"/"}>
          <Products />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
