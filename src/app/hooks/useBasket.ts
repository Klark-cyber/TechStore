import { useState } from "react"
import { CartItem } from "../../lib/types/search"

//Basketga oid mantiqlarni customize hooklarga yuklab uni kerakli componentlarga chaqirib oldik
const useBasket = () => {

    const cartJson: string | null = localStorage.getItem("cartData") //Pasgi qatorda existni tekshirib mavjud bolsa ozgartirib aks holda oz holicha localStoragega yuklagan edik.Endi storedagi arrayni cartItemsga dastlabki qiymat sifatida berish mumkin
    const currentCart = cartJson ? JSON.parse(cartJson) : [] //Agar local Storageda cartJson mavjud bolsa uni uni string holatdan parse methodi orqali objectga ozgartirib cartItems uchun dastlabki qiymat sifatida belgiladik.Agar storedan cartData mavjud bolmasa cartItemsning dastlabki qiymati []
      //Buscet bilan ishlash biznes mantigi
    const [cartItems, setCartItems] = useState<CartItem[]>(currentCart) //cartItemsning type CartItem dan iborat arrayni tashkil qiladi, boshlangich qiymati bosh array 
    

    const onAdd = (input: CartItem) => { //Buscetga product qoshish uchun onAdd handlerdan foydalanamiz. Parametr sifatida type CartItem bolgan objectni qabul qiladi dan 
      
        const exist: CartItem | undefined = cartItems.find((item) => item._id === input._id) //useState ichida cartItems array edi shu sababli unga find() methodini qollab input ichidagi _id si bir xil bolgan objectni topyapmiz.find object qaytaradi
      console.log("obyect topildi:", exist)
      if(exist) {
        console.log("tugma bosildi")
        //Agar cartItems ichida exist mavjud bolsa existga teng bolgan itemni olib uni quantitysini 1 ga oshirib qaytadan map orqali yangi array xosil qilib beradi
        const cartUpdate = cartItems.map((item: CartItem) =>  item._id === input._id 
        ? {...exist, quantity: exist.quantity + 1} 
        : item //exist ichidagi quentityni 1 ga oshirib existni yangi reference orqali saqlab berish. exist._id va input._id bir xil
        );
        setCartItems(cartUpdate)
         localStorage.setItem("cartData", JSON.stringify(cartUpdate)) //browser localStorageda setItem default methodi orqali cartData nomi ostida storega belgilangan malumotni joylab beradi. Unga json korinishda malumotni joylashni buyurdik
      } else {
        const cartUpdate = [...cartItems, {...input}]; //Agar cart ichida inputdan kelgan object mavjud bolmasa cartItemsga inputni qoshib uni yangi referenceda saqlab olamiz
        setCartItems(cartUpdate); //useState ichidagi setCartItems orqali cartItemsni input orqali boyitib uni yangi reference orqali saqlab olyapmiz
        localStorage.setItem("cartData", JSON.stringify(cartUpdate)) //browser localStorageda setItem default methodi orqali cartData nomi ostida storega belgilangan malumotni joylab beradi. Unga json korinishda malumotni joylashni buyurdik
      };
    }

    const onRemove = (input: CartItem) => {
        const exist: any = cartItems.find((item) => item._id === input._id);
        if(exist.quantity === 1) {
            const cartUpdate = cartItems.filter((item:CartItem) => item._id !== input._id); //agar exit.quantty=1 bolsa ushbu elementni ochirganimizda u royxatdan olib tashlanib qolgan arraylar browserda korinadi
            console.log('ochirildi')
            setCartItems(cartUpdate); //useState ichidagi setCartItems orqali cartItemsni input orqali boyitib uni yangi reference orqali saqlab olyapmiz
        localStorage.setItem("cartData", JSON.stringify(cartUpdate)) //browser localStorageda setItem default methodi orqali cartData nomi ostida storega belgilangan malumotni joylab beradi. Unga json korinishda malumotni joylashni buyurdik
        }else {
            const cartUpdate = cartItems.map((item: CartItem) => item._id === input._id 
            ? {...exist, quantity: exist.quantity - 1} //agar cartItems ichida kerakli item mavjud bolsa uni topib quantityni 1 ga kamaytiradi, qolgan arraylarni item ornida ozgarishsiz qaytaradi
                 : item 
                );
         setCartItems(cartUpdate)
        localStorage.setItem("cartData", JSON.stringify(cartUpdate));
        }
    };

    const onDelete = (input: CartItem) => {
        const cartUpdate = cartItems.filter((item: CartItem) => item._id !== input._id);
      setCartItems(cartUpdate)
        localStorage.setItem("cartData", JSON.stringify(cartUpdate));
    }

    const onDeleteAll = () => { //dleteAll ishga tushganda cartItems ni bosh arrayga tenglab localStoragedan cartDatani ochirib yubramiz
        setCartItems([]);
        localStorage.removeItem('cartData');
    }
      return {
        cartItems,
        onAdd,
        onRemove,
        onDelete,
        onDeleteAll,
}
}

export default useBasket;