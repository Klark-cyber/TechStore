import React from "react";
import {createRoot} from "react-dom/client"; //vertual domni hosil qilish uchun react-dom package ornatilgan uning ichidan React-Domni chaqirib oldik
import { Provider } from "react-redux";
import { store } from "./app/store"; 
import App from "./app/App";
import reportWebVitals from "./reportWebVitals";
import CssBaseline from "@mui/material/CssBaseline";
import {ThemeProvider} from "@mui/material/styles";
import theme from "./app/MaterialTheme";
import { BrowserRouter as Router } from "react-router-dom"; //frontend routerlarini yasash uchun router dom yuklab olindi
import "./css/index.css";
import ContextProvider from "./app/context/ContextProvider";

const container = document.getElementById('root')!;
const root = createRoot(container)

//Global integratsiya(redux+mui+router)+ver/real dom connect
root.render( //ver va real dom integratsiyasini amalga oshiryapmiz
  <React.StrictMode> {/**/}
    <Provider store={store}> {/*Redax*/}
     <ContextProvider>
       <ThemeProvider theme={theme}> {/*Materil themelar loyihani barcha qismida birdek ishlashi uchun global qilib install qilindi*/}
        <CssBaseline/>
         <Router>                      {/*Routing tizimini App ning istalgan joyida foydalanaolishimiz uchun Appni Routing ichiga joyladik  */}
          <App />
        </Router>
      </ThemeProvider>
     </ContextProvider>
    </Provider>
  </React.StrictMode>
);


reportWebVitals();
