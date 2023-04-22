import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
const [state,setState]=useState(false);
const history=useHistory()
  const [formData,setFormData]=useState({username:"",password:""})
// const [username,setUsername]=useState(null)
// const [balance,setBalance]=useState(null)
// const [token,setToken]=useState(null)
  const handleInputChange = (event) => {
    // const target = event.target;
    // const value = target.value;
    // const name = target.name;
  
  
      const [key, value]=[event.target.name,event.target.value]
      // return { ...prevState, [ke]: value };
      setFormData({ ...formData, [key]: value })
    
  }
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    if(!validateInput(formData)){
      return
    }
      
        try {
          setState(true)
         const response = await axios.post(`${config.endpoint}/auth/login`,{username:formData.username,password:formData.password})
           enqueueSnackbar('Logged in successfully',{variant:'success'})
           persistLogin(response.data.token,response.data.username,response.data.balance)
           history.push("/",{from:"Products"})
           } 
           catch (error) {
            if(error.response.status===400){
              enqueueSnackbar(error.response.data.message,{variant:'error'})
            }
            else{
              enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.',{variant:"error"}) 
            }
           }
           setState(false)
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if(!data.username){
      enqueueSnackbar("Username is a required field",{variant:'warning'});
      return false
    }
    if(data.username.length<6){
      enqueueSnackbar("Username must be at least 6 characters",{variant:'warning'});
     return false 
   }
    if(!data.password){
      enqueueSnackbar("Password is a required field",{variant:'warning'});
     return false 
   }
    if(data.password.length<6){
      enqueueSnackbar("Password must be at least 6 characters",{variant:'warning'});
      return false
    }
    
   
     return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
   
  localStorage.setItem("username",username)
  localStorage.setItem("token",token)
  localStorage.setItem("balance",balance)
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={formData.username}
            placeholder="Enter Username"
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
      
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleInputChange}

          />
           <Button className="button" variant="contained" onClick={async ()=>{login(formData)}}>
          { state?<CircularProgress />:"LOGIN TO QKART"}
           </Button>
           <p className="secondary-action">
            Don't have an account?{" "}
             {/* <a className="link" href="#">
              Register now
             </a> */}

<Link to="/register" className="link">Register now</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
