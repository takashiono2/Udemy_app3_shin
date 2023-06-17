import { useEffect,useState } from 'react';
import './App.css';
import { getAllPokemon,getPokemon } from "./utils/pokemon.js";
import Card from './components/Card/Card';
import Navabar from './components/Navbar/Navabar';

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon/";

  const[loading,setLoading] = useState(true);
  const[pokemonData,setPokemonData] = useState([]);
  const[nextURL, setNextURL] = useState("");
  const[prevURL, setPrevURL] = useState("");

  useEffect(()=>{
    const fetchPokemonData = async () => {
      let res = await getAllPokemon(initialURL);

      loadPokemo(res.results);
      setNextURL(res.next);
      setPrevURL(res.previous);
      setLoading(false);
    };
    fetchPokemonData();
  },[]);

  const loadPokemo = async (data) =>{
    let _pokemonData = await Promise.all(
      data.map((pokemon) =>{
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };
  // console.log(pokemonData);


  const handleNextPage = async()=>{
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    await loadPokemo(data.results);
    // console.log(data);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  }

  const handlePrevPage = async()=>{
    if(!prevURL) return;
    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemo(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  }

  return (
    <>
      <Navabar/>
        <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ):(
          <>
            <div className="pokemonCardContainer">
            { pokemonData.map((pokemon,i)=>{
              return (
                <div>
                  <Card key={i} pokemon={pokemon}/>
                </div>
              );
            })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
          )}
        </div>
    </>
  );
}

export default App;
