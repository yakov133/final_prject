import React, { useEffect, useState } from "react";
import style from "./CSS/categories.module.css";
import axios from "axios";
import { MdReadMore } from "react-icons/md";
import { Redirect } from "react-router-dom";

const Categories = ({ getCategory , setCategory, setDetails }) => {
  const [recipes, setRecipse] = useState([]);
  const [imageFlag, setimageFlag] = useState(false);
  const [flag, setflag] = useState(false);
  let h1_category;
  if(getCategory()==="Milk"){
    h1_category="חלבי";
  }else if(getCategory()==="Meat"){
    h1_category="בשרי";
  }else{
    h1_category="צמחוני";
  };
  useEffect(() => {
    const URL = `/categories/${getCategory()}`;
    axios
      .get(URL)
      .then((res) => {
        setRecipse(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  
  useEffect(() => {
    if(!imageFlag){
      let temp = [...recipes];
        for (let i = 0; i < temp.length; i++) {
          getImage(temp,temp[i].src,i);         
        }
    }
  }, [recipes]);

  const getImage = async(data,filename,i) => {
    await axios
      .get(`/image/${filename}`, { responseType: "blob" })
      .then((res) => {
        if (res.status === 200) {
          const reader = new FileReader();
          reader.readAsDataURL(res.data);
          reader.onload = () => {
            const imgeDataURL = reader.result;
            data[i].src=imgeDataURL;
            if(i+1 === data.length){
              setimageFlag(true)
              setRecipse(data);
            }  
          };
        } else {
          console.log(`error status code: ${res.status}`);
        }
      })
      .catch((err) => console.error(err));
  };



  if (flag) {
    return <Redirect to="/Details" />;
  }

  return (
    <div className={style.info}>
      <h1 className={style.h1_style}>קטגורית {h1_category}</h1>
      <div className={style.order}>
        {recipes.map((recip) => (
          <div key={recip.id} className={style.card_option}>
            <p>{recip.title} מאת: {recip.name}</p> 
            <br />
            <img src={recip.src.includes("data")?recip.src:""} alt={`${recip.title} תמונה`} />
            <p>
              <MdReadMore
              title="למתכון"
                className={style.icon}
                onClick={() => {
                  setDetails(recip.id);
                  setflag(true);
                }}
              />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
