import { AddShoppingCartOutlined } from "@mui/icons-material";
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const AdminProductCard = ({ product, deleteProduct }) => {
 
  return (
    <Card className="card" key={product.id}>
      <CardMedia
        component="img"
        height="240"
        image={
          product.image
        }
        alt="image"
      ></CardMedia>
      <CardContent>
        <Typography gutterBottom variant="subtitle1">
          {product.name}
        </Typography>
        <Typography color="textPrimary" variant="subtitle2" style={{fontWeight:"900"}}>
         ${product.cost}
          
        </Typography>
        <Rating
          name="read-only"
          value={product.rating}
          readOnly
          // onChange={(event, newValue) => {
          //   setValue(newValue);
          // }
          // }
        />  <CardActions className="card-actions">
        <Button  variant="outlined" color="error" style={{fontWeight:"600"}} startIcon={<DeleteSweepIcon/>} fullWidth name="add to cart" onClick={() => deleteProduct(product._id)}>
      
        {"Delete"}  
        </Button>
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default AdminProductCard;
