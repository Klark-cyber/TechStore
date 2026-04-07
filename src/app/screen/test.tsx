//@ts-nocheck => typescript typelarini check qilma

//react 16.8 versiyagacha class componentlar bilan ishlangan, xozirda functional componentlar keng qollaniladi.
//Class component camchiligi: sintaksisi murakkab, constructor yaratish kerak, state property yaratish kerak bolsa uzun kod, state property ichidagi qiymatni chaqirish noqulay


//functional comp ichida suniy state yaratish imkoninini hooklar hal qilib beradi. Yani life cycle methodlarni hooklar orqali functional methodlar ichida yaratib olishimiz mumkin boladi.
//useState bu functional stateni hosil qilib beradi
//useEffect life cycle methodlarni hosil qilib beradi 

import React, {Component} from "react"

class Test extends Component { //class nomini file nomidan kelib chiqib belgilaymiz
  constructor(props) {
    super(props);
    // Test Classimizning state propertylari
    this.state = {
      brand: "Ford",
      model: "Mustang",
      color: "red",
      year: 1964
    };
  }
  changeDetail = () => {
    this.setState({color: "blue", brand: "Tesla", model: "ModelS", year: 2023}); //setState state prpoerty ichidagi kerakli qiymatni ozgartiruvchi tayyor method
  }

// React lifesycle methods: Backenddan datani olishda ishlatiladigan methodlar

// ComponentDidMount():
componentDidMount(){ //dastlabki render vaqtida ishga tushadi
    console.log("componentDidMount");
}
// ComponentDidUpdate():
componentDidUpdate(){// Bu component biz belgilagan qiymat ozgarganda vertual dom real domni yangilaydi
    console.log("ComponentDidUpdate") 
}

// ComponentDidUnmount():
componentWillUnmount(){ //component yashirilganda yoki location boshqa pagega otgan vaqtida ishga tushadi
    console.log("componentWillUnmount");
}

  render() { //class componentda render orqali wievni hosil qilib qaytaryapmiz.
    return (
      <div>
        <h1>My {this.state.brand}</h1>
        <p>
          Color: {this.state.color} - Model: {this.state.model} from {this.state.year}.
        </p>
        <button
          type="button"
          onClick={this.changeDetail}
        >Change Detail</button>
      </div>
    );
  }
}



export default Test;