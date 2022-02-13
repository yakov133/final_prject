import style from "./App.module.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AllRecips from "./pages/AllRecips";
import PageNotFound from "./pages/PageNotFound";
import NewRecipe from "./pages/NewRecipe";
import MyRecipe from "./pages/MyRecipe";
import About from "./pages/About";
import Modal from "./components/Modal";
import Details from "./pages/Details";
import Categories from "./pages/Categories";
import Update from "./pages/Update";
import { AiFillGithub } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { AiOutlinePoweroff } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { Redirect } from "react-router-dom";
import Navbar from "./components/Navbar";


function App() {
  const [userLogedIn, setuserLogedIn] = useState(false);
  const [modal, setModal] = useState(false);
  const [humburgerlinks, sethumburgerlinks] = useState(false);

  let category = ""
  const getCategory = ()=>category;
  const setCategory = (str)=>category=str;
  let details = "";
  const getDetails = ()=>details;
  const setDetails = (str)=>details=str;
  let recipUpdate = "";
  const getrecipUpdate = ()=>recipUpdate;
  const setrecipUpdate = (obj)=>recipUpdate=obj;

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      setuserLogedIn(JSON.parse(localStorage.getItem("auth")));
    }
  }, []);
  
  return (
    <BrowserRouter>
      <div>

      <Navbar userLogedIn={userLogedIn} setuserLogedIn={setuserLogedIn} modal={modal} setModal={setModal} humburgerlinks={humburgerlinks} sethumburgerlinks={sethumburgerlinks}/>
      
      
        <Switch>
          <Route exact path="/" render={() => <Home setCategory={setCategory}/>} />
          <Route exact path="/AllRecips" render={() => <AllRecips setDetails={setDetails} />} />
          <Route exact path="/NewRecipe" render={() => <NewRecipe userLogedIn={userLogedIn} />} />
          <Route exact path="/MyRecipe" render={() => <MyRecipe userLogedIn={userLogedIn} setrecipUpdate={setrecipUpdate}/>} />
          <Route exact path="/About" render={() => <About />} />
          <Route exact path="/Details" render={() => <Details userLogedIn={userLogedIn} getDetails={getDetails} setDetails={setDetails}/>} />
          <Route exact path="/Categories" render={() => <Categories getCategory={getCategory} setCategory={setCategory} setDetails={setDetails} />} />
          <Route exact path="/Update" render={() => <Update getrecipUpdate={getrecipUpdate}/>} />

          <Route component={() => <PageNotFound />} />
        </Switch>
        <footer >&copy;  <a className={style.linkdin} href="https://www.linkedin.com/in/yakov-kassa-406636116/" target="_blank" rel="noopener noreferrer">yakov kassa</a> <a href="https://github.com/yakov133/ethiopian_food" target="_blank" rel="noopener noreferrer"><AiFillGithub  className={style.icons}/></a> </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;


// {userLogedIn ? (
//   <nav className={style.nav_user_loged_in}>
//     <Link className={style.link_nav} to="/About">
//       אודות
//     </Link>
//     <Link className={style.link_nav} to="/NewRecipe">
//       מתכון חדש
//     </Link>
//     <Link className={style.link_nav} to="/MyRecipe">
//       המתכונים שלי 
//     </Link>
//     <Link className={style.link_nav} to="/AllRecips">
//       כל המתכונים     
//     </Link>
//     <Link className={style.link_nav} to="/">
//       בית     
//     </Link>
    
//     <button
//       onClick={() => {
//         setuserLogedIn(false);
//         localStorage.clear();
//         return <Redirect to="/" />
//       }}
//       className={style.sign_out}
//     >
//       <AiOutlinePoweroff />
//       {/* <AiOutlineLogout />  */}
//     </button>
//   </nav>
// ) : (
//   <nav className={style.nav_no_user}>
//    <Link className={style.link_nav} to="/About">
//       אודות
//     </Link>
//     <Link className={style.link_nav} to="/AllRecips">
//       כל המתכונים     
//     </Link>
//     <Link className={style.link_nav} to="/">
//       בית     
//     </Link>
//     <button onClick={() => setModal(true)} className={style.sign_out}>
//       <FaRegUser />
//     </button>
//   </nav>
// )}
// {modal ? (    
//     <Modal setuserLogedIn={setuserLogedIn} setModal={setModal} />
// ) : (
//   ""
// )}