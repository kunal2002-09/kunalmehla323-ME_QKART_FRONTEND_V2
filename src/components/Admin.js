import { useSnackbar } from "notistack";
import { Box } from "@mui/system";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import axios from "axios";
import "./Admin.css";
import { config } from "../App";
import React, { useState,useEffect } from "react";
import Footer from "./Footer";
import Header from "./Header";
import {
  Button,
  Card,
  Stack,
  CardActions,
  CircularProgress,
  InputAdornment,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  TextField,
  Grid,
} from "@mui/material";
import AdminProductCard from "./AdminProductCard";
import "./ProductCard.css";

const Admin = () => {
  let { enqueueSnackbar } = useSnackbar();
  const [productsList, setProductsList] = useState([]);
  const [login, setLogin] = useState(false);
  const [error, setError] = useState(false);
  const [state, setState] = useState(true);
  const [debounceTimeOut, setDebounceTime] = useState(0);


  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cost: "",
    rating: parseInt(0),
    image:""
  });
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: ""
  });
  useEffect(() => {
    performAPICall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function performAPICall() { 
    try {
      const response = await axios.get(config.endpoint + "/products");
      const products = response.data;
      setState(false);
      setProductsList(products);
      setError(false)
    } catch (error) {
      if (error.response) {
        // RETURN API ERROR
        enqueueSnackbar(error.response.statusText, { variant: "error" });
      } else {
        // IF BACKEND IS NOT RUNNING
        enqueueSnackbar("Something went wrong!", { variant: "error" });
      }
      setError(true);
    }
  }

  const handleInputChange = (event) => {
    const [key, value] = [event.target.name, event.target.value];
    if (key === "rating") {
      setFormData({ ...formData, [key]: parseInt(value) });
    } else {
      setFormData({ ...formData, [key]: value });
    }
  };
  const handleLoginInputChange = (event) => {
    const [key, value] = [event.target.name, event.target.value];

      setLoginFormData({ ...loginFormData, [key]: value });
    
  };
  const adminLogin = async (loginFormData) => {
        try {
          setState(true)
 await axios.post(`${config.endpoint}/auth/login`,{username:loginFormData.username,password:loginFormData.password})
           enqueueSnackbar('Logged in successfully',{variant:'success'})
setLogin(true)

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

  const validateInput = (data) => {
    if (!data.name) {
      enqueueSnackbar("Product name is a required field", {
        variant: "warning",
      });
      return false;
    }
    if (!data.category) {
      enqueueSnackbar("Category is a required field", {
        variant: "warning",
      });
      return false;
    }
    if (!data.cost) {
      enqueueSnackbar("cost is a required field", { variant: "warning" });
      return false;
    }
    if (!data.rating) {
      enqueueSnackbar("Rating is a required field", {
        variant: "warning",
      });
      return false;
    }
    if (
      data.image ===
        "https://st2.depositphotos.com/1561359/12101/v/950/depositphotos_121012076-stock-illustration-blank-photo-icon.jpg" ||
      !data.image
    ) {
      enqueueSnackbar("Image is a required field", {
        variant: "warning",
      });
      return false;
    }
    return true;
  };

  const insertProduct = async (formData) => {
    if (!validateInput(formData)) {
      return;
    }
    try {
     const response = await axios.post(`${config.endpoint}/auth/admin`, {
        name: formData.name,
        catgory: formData.category,
        cost: formData.cost,
        rating: formData.rating,
      });
      setProductsList(response.data)
      setFormData({
        name: "",
        category: "",
        cost: "",
        rating: parseInt(0),
        image:
          ""
      });
      enqueueSnackbar("Product Added Successfully", { variant: "success" });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        { variant: "error" }
      );
    }
  };
  async function performSearch(text) {
    try {
      const response = await axios.get(
        config.endpoint + `/products/search?value=${text}`
      );
      setError(false);
      setProductsList(response.data);
    } catch (error) {
      setProductsList([]);
      setError(true);
    }
  }

  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeOut !== 0) {
      clearTimeout(debounceTimeOut);
    }
    const timeout = setTimeout(() => performSearch(event.target.value), 500);
    setDebounceTime(timeout);
  };

  const deleteProduct = async (productId) => {
    console.log(productId)
    try {
      // TODO: CRIO_TASK_MODULE_CHECKOUT - Delete selected address from the backend and display the latest list of addresses
      const res = await axios.delete(
        `${config.endpoint}/auth/product/${productId}`
      );
      // console.log(res.data);
      setProductsList(res.data);

    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };
  return (
    <>
 
  {login?(<>
    <Header>
    <TextField
        className="search-desktop"
        size="small"
        InputProps={{
          className: "search",
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={(e) => {
          debounceSearch(e, debounceTimeOut);
        }}
      />
    </Header>
    <Box
      display="flex"
      justifyContent={"space-around"}
      alignItems={"center"}
      style={{ height: "65.8vh" }}
      className={"content"}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-around"
        alignItems="center"
        minHeight="50vh"
        style={{
          width: "25vw",
          height: "50vh",
          padding: "40px 50px",
          backdropFilter:" blur(10px) saturate(200%)",
          // -webkit-backdrop-filter: blur(10px) saturate(200%);
          backgroundColor: "rgba(130, 130, 156, 0.44)",
          borderRadius: "12px",
          border: "1px solid rgba(255, 255, 255, 0.125)"
        }}
      >
        <Card
          className="card"
          style={{
            width: "25vw",
            padding: "15px",

 
            // -webkit-backdrop-filter: blur(10px) saturate(200%);
            backgroundColor: "rgba(229, 229, 231, 0.44)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.125"
          }}
        >
          <Typography
            style={{
              fontWeight: "900",
              alignSelf: "center",
              color: "#00845c",
            }}
          >
            Product details
          </Typography>

          <TextField
            id="product-name"
            label="Product name"
            name="name"
            variant="standard"
            color={'primary'}
            onChange={handleInputChange}
            value={formData.name}
            required
            InputLabelProps={{className:'textfield-label'}}
          />
          <TextField
            id="product-cost"
            label="Product cost"
            name="cost"
            variant="standard"
            type="number"
            onChange={handleInputChange}
            value={formData.cost}
            required
         
          />
          <TextField
            id="product-category"
            label="Product category"
            name="category"
            variant="standard"
            onChange={handleInputChange}
            value={formData.category}
            required
          />
          {/* <TextField id="product-rating" label="Product rating" name='rating' variant="standard" onChange={handleInputChange} /> */}
          <TextField
            id="product-image"
            label="Product image"
            name="image"
            variant="standard"
            onChange={handleInputChange}
            value={formData.image}
            required
          />
          <Typography
            style={{ paddingTop: "15px", color: "#5c5a5a" }}
            variant="subtitle-1"
            component="legend"
            required
          >
            Rating
          </Typography>
          <Rating
            name="rating"
            value={formData.rating}
            onChange={handleInputChange}
          />
          <Button
            variant="contained"
            style={{ margin: "20px 0" }}
            onClick={async () => {
              insertProduct(formData);
            }}
          >
            Add product
          </Button>
        </Card>
      </Box>
      <Box>
        <Card
      
          style={{
            width: "25vw",
            height: "50vh",
            padding: "40px 50px",
            backdropFilter:" blur(10px) saturate(200%)",
            // -webkit-backdrop-filter: blur(10px) saturate(200%);
            backgroundColor: "rgba(130, 130, 156, 0.44)",
            borderRadius: "12px",
            border: "1px solid rgba(255, 255, 255, 0.125)"
          }}
        >
          <Card
            className="card"
            key={formData.id}
            style={{ justifyContent: "flex-start" }}
          >
            <CardMedia
              component="img"
              height="230"
              image={!formData.image?"https://st2.depositphotos.com/1561359/12101/v/950/depositphotos_121012076-stock-illustration-blank-photo-icon.jpg":formData.image}
              alt="image"
            ></CardMedia>
            <CardContent>
              <Typography gutterBottom variant="subtitle1">
                {formData.name}
              </Typography>
              <Typography
                color="textPrimary"
                variant="subtitle2"
                style={{ fontWeight: "900" }}
              >
                ${formData.cost}
              </Typography>
              <Rating name="read-only" value={formData.rating} readOnly />
            </CardContent>
          </Card>
        </Card>
      </Box>
    </Box>
 
    <Grid container direction="row" spacing={{ xs: 1, md: 2 }} p={3}>
          {error ? (
            <>
              {" "}
              <Box
                sx={{
                  display: "flex",
                  margin: "auto",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: 300,
                }}
              >
                <SentimentDissatisfied />
                No Products Found
              </Box>
            </>
          ) : (
            ""
          )}
          {state ? (
            <>
              {" "}
              <Box
                sx={{
                  display: "flex",
                  margin: "auto",
                  alignItems: "center",
                  flexDirection: "column",
                  justifyContent: "center",
                  height: 300,
                }}
              >
                <CircularProgress color="success" />
                {""}
                Loading...
              </Box>
            </>
          ) : (
            ""
          )}

          {productsList && (
            <>
              {" "}
              {productsList.map((product) => {
                return (
                  <Grid item md={3} xs={6} key={product._id}>
                    <AdminProductCard
                      product={product}
                      deleteProduct={deleteProduct}
                    />
                  </Grid>
                );
              })}
            </>
          )}
        </Grid>

    <Footer></Footer>
  </>):(<Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
        <h2 className="title">Admin Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={loginFormData.username}
            placeholder="Enter Username"
            onChange={handleLoginInputChange}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={loginFormData.password}
      
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleLoginInputChange}

          />
           <Button className="button" variant="contained" onClick={async ()=>{adminLogin(loginFormData)}}>
          { state?<CircularProgress />:"LOGIN TO QKART"}
           </Button>
      
        </Stack>
      </Box>
      <Footer />
    </Box>)}
  </>
  );
};
export default Admin;
