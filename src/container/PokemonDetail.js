// import React, { Component } from "react";
// import axios from "axios";
// import { POKEMON_API_URL } from "./../config/index";
// export default class PokemonDetail extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // intially i am keeping the value of pokemon as null, when I will set the state then I will change thet value of state
//       pokemon: null,
//     };
//   }
//   //here componentDidMount is exactly same as useEffect which was used in function component where as componentDidMount used in class component
//   componentDidMount() {
//     const { match } = this.props;
//     //here we will only get id if there  is match present with id, if there is no id inside the match then we can't access the id, here we have added a kind of check to avoid errors
//     const { id } = match?.params;
//     //here we have added a forward slash because in the pokemon api we don't have a slash
//     axios.get(POKEMON_API_URL + "/" + id).then((response) => {
//       if (response.status >= 200 && response.status < 300) {
//         console.log(response.data);
//         //here we will get data with .data propety applied on the promise what we get
//         this.setState({ pokemon: response.data });
//       }
//     });
//   }
//   render() {
//     return (
//       <div>
//         {" "}
//         <h1 style={{ marginTop: 200 }}> Pokemon</h1>{" "}
//       </div>
//     );
//   }
// }

//when we click on particular pokemon then this page gets opened, to get this page we read the params present inside the url and based on that we fetch the data of that pokemon and get all the details
import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { POKEMON_API_URL } from "./../config/index";
import {
  Box,
  CircularProgress,
  Grid,
  makeStyles,
  Button,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { Typography } from "@material-ui/core";
import { toggleFavourite } from "../redux/action";
const useStyles = makeStyles((theme) => ({
  pokedexContainer: {
    height: "85vh",
    backgroundColor: "black",
    marginTop: "75px",
    textAlign: "center",
    borderRadius: "5px",
    paddingTop: "30px",
  },
  textTitle: {
    color: "white",
    textTransform: "upperCase",
  },
  loading: {
    marginTop: "80px",
  },
  pokemonImage: {
    width: "200px",
    height: "200px",
  },
  pokemonInfo: {
    bottom: "60px",
    // backgroundColor: "blue",
    position: "absolute",
    width: "100%",
  },
  seperator: {
    hwight: "0.001mm",
    width: "95%",
  },
  favourite: {
    height: "50px",
    width: "50px",
    marginTop: "15px",
    // border: "1px solid white",
  },
  text: {
    fontSize: "35px",
    color: "white",
  },
}));
function PokemonDetail(props) {
  const classes = useStyles();
  const { id } = useParams();

  const [pokemonData, setPokemonData] = useState({});
  const [pokeImg, setPokeImg] = useState("");
  const [types, setTypes] = useState([]);
  useEffect(() => {
    // setTimeout(() => {

    // }, 0);
    axios.get(POKEMON_API_URL + "/" + id).then((response) => {
      //   console.log(response.data);
      if (response.status >= 200 && response.status < 300) {
        console.log(response.data);
        setPokemonData(response.data);
        setPokeImg(response.data.sprites.front_default);
        setTypes(response.data.types);
        console.log(typeof pokemonData);
        console.log(pokemonData.name + pokemonData.height);
      }
    });
    //the below line is used for missing dependency message in terminal
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //this function is used to check whether the favourite button is red or white
  const favouriteChecker = (pokemon) => {
    let found = false;
    props.favourites?.map((p) => {
      if (p.id === pokemon.id) {
        found = true;
      }
      return found;
    });
    return found;
  };
  console.log("insidepokemondetails", props);
  const { name, height, weight } = pokemonData;
  if (pokemonData) {
    return (
      <Box>
        <Box className={classes.pokedexContainer}>
          <Typography className={classes.textTitle} variant="h1">
            {/* {pokemonData.name ? (
              pokemonData.name
            ) : (
              <CircularProgress className={classes.loading} />
            )} */}
            {name}
          </Typography>

          <img className={classes.pokemonImage} src={pokeImg} alt={name} />
          <Box className={classes.pokemonInfo}>
            <hr className={classes.seperator} />
            <Grid container>
              <Grid item md={1}>
                <Button
                  className={classes.favourite}
                  onClick={() => props.toggleFavourite(pokemonData)}
                >
                  <FavoriteIcon
                    style={{
                      color: favouriteChecker(pokemonData) ? "red" : "white",
                      fontSize: "50px",
                    }}
                  />
                </Button>
              </Grid>
              <Grid item md={2}>
                <Typography className={classes.text}>
                  Name
                  <br />
                  {name}
                </Typography>
              </Grid>
              <Grid item md={2}>
                <Typography className={classes.text}>
                  Height
                  <br />
                  {height}m
                </Typography>
              </Grid>
              <Grid item md={2}>
                <Typography className={classes.text}>
                  Name
                  <br />
                  {weight}kg
                </Typography>
              </Grid>
              {/* here types is an array of objects, so we can apply map method on it, so on iteration we get an array element, here each array element is an object and inside that object we have our value preset inside it, now we can do the destructuring and can get the require valaue  */}
              {/* {types.map((pokemonType) => {
                const { name } = pokemonType.type;
                return (
                  <Grid item md={2}>
                    <Typography className={classes.text}>
                      Type
                      <br />
                      {name}kg
                    </Typography>
                  </Grid>
                );
              })} */}
              {types.map((pokemonType) => {
                const { name } = pokemonType.type;
                return (
                  <Grid item md={2}>
                    <Typography className={classes.text}>
                      Type
                      <br />
                      {name}
                    </Typography>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
        ;
      </Box>
    );
  } else {
    <CircularProgress />;
  }
}
const mapStateToProps = (state) => ({
  favourites: state.favourites,
});

const mapDispatchToProps = (dispatch) => ({
  toggleFavourite: (pokemon) => dispatch(toggleFavourite(pokemon)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PokemonDetail);
