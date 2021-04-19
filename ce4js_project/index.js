function getDataCollection(collectionName) {
  return new Promise((resolve, reject) => {
    db.collection(collectionName).onSnapshot((snapshot) => {
      let itemList = [];
      snapshot.forEach((doc) => {
        itemList.push(doc);
      });
      resolve(itemList);
    });
  });
}

//sign in
let signInMenu = document.getElementById("signInMenu");
let signIn = document.getElementById("signIn");
let signOut = document.getElementById("signOut");

let userInfo = localStorage.getItem("sign_in");
function checkSignIn(bool){
  if (bool == "false" || bool == null) {
    signOut.style.display = "none";
    signIn.style.display = "";
  } else if(bool == "true"){
    signIn.style.display = "none";
    signOut.style.display = "";
    let username = document.querySelector("#username");
    username.textContent = "admin";
  }
}
checkSignIn(userInfo);
const signOutDropdown = document.querySelector("#signOutDropdown");
signOutDropdown.onclick = () => {
  signOut.style.display = "none";
  signIn.style.display = "";
  userInfo = false;
  localStorage.setItem("sign_in", userInfo);
};
// image silder code
let slider = document.querySelector(".splide__list");
const addImg = (parent, tag, tagClass, src) => {
  let li = document.createElement(tag);
  li.classList += tagClass;
  let img = document.createElement("img");
  img.src = src;
  li.appendChild(img);
  parent.appendChild(li);
};
const showAll = document.getElementsByClassName("showAll");
console.log(showAll);
for (let i = 0; i < showAll.length; i++) {
  showAll[i].onclick = () => {
    console.log(showAll[i].getAttribute("data-id"));
    if (showAll[i].getAttribute("data-id") == "laptop") {
      localStorage.setItem(`flags`, `laptop`);
    } else if (showAll[i].getAttribute("data-id") == "component") {
      localStorage.setItem(`flags`, JSON.stringify({ component: "" }));
    } else {
      localStorage.setItem(`flags`, "hardware");
    }
    window.location.href = "/ce4js_project/product/product.html";
  };
}

//cart
let badge = document.querySelector(".badge");
const updateBadge = () => {
  let sum = 0;
  let resource = JSON.parse(localStorage.getItem("cartItems"));
  if (resource != null) {
    if (resource.length)
      sum = resource.reduce((sum, item) => {
        return sum + item.number;
      }, 0);
  }
  badge.textContent = sum;
};
updateBadge();

//items
const items = document.querySelector(".items");
const card = (obj, des) => {
  let card = document.createElement("div");
  card.style.width = "250px";
  card.className = "class col me-auto";
  card.setAttribute("data-id", obj.id);
  let card_img = document.createElement("img");
  card_img.className = "card-img-top";
  card_img.src = obj.src[0];
  card_img.style.cursor = "pointer";
  let card_body = document.createElement("div");
  let card_title = document.createElement("h6");
  card_title.classList += "card-title ";
  if (obj.subName == null) {
    card_title.textContent = obj.name;
  } else card_title.textContent = obj.subName;
  card_title.style.cursor = "pointer";
  let card_text = document.createElement("p");
  card_text.className = "card-text";
  card_text.textContent =
    "Price: " +
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(obj.price);
  let btn = document.createElement("button");
  btn.classList.add("btn", "btn-primary");
  btn.textContent = "Thêm vào giỏ hàng";
  card_body.appendChild(card_title);
  card_body.appendChild(card_text);
  card_body.appendChild(btn);
  card_body.style.height = "150px";
  card_body.style.position = "relative";
  btn.style.position = "absolute";
  btn.style.bottom = "0";
  card.appendChild(card_img);
  card.appendChild(card_body);
  des.appendChild(card);
  if (obj.status == 0) {
    btn.disabled = true;
  }
  card_title.onmouseover = () => {
    card_title.style.color = "rgb(0, 119, 255)";
  };
  card_title.onmouseout = () => {
    card_title.style.color = "black";
  };
  [card_img, card_title].forEach((element) => {
    element.onclick = () => {
      localStorage.setItem(
        "requestID",
        JSON.stringify({ located: obj.located, id: obj.id })
      );
      window.location.href = "/ce4js_project/detail/detail.html";
    };
  });
  btn.onclick = () => {
    db.collection(obj.located)
      .doc(obj.id)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          let itemInfo = doc.data();
          itemInfo.id = obj.id;
          itemInfo.located = obj.located;
          itemInfo.number = 1;
          if (
            localStorage.getItem("cartItems") == null ||
            JSON.parse(localStorage.getItem("cartItems")).length == 0
          ) {
            let arr = [];
            arr.push(itemInfo);
            localStorage.setItem("cartItems", JSON.stringify(arr));
          } else {
            let resource = JSON.parse(localStorage.getItem("cartItems"));
            let index = resource.findIndex(function (item) {
              return item.id == obj.id;
            });
            if (index != -1) {
              resource[index].number++;
            } else resource.push(itemInfo);
            localStorage.setItem("cartItems", JSON.stringify(resource));
          }
          updateBadge();
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  };
};
getDataCollection("homeAdvert").then((result) => {
  let database = [];
  result.forEach((item) => {
    let data = item.data();
    database.push(data);
  });
  localStorage.setItem("homeAdvert", JSON.stringify(database));

  const homeAdvert = JSON.parse(localStorage.getItem("homeAdvert"));
  homeAdvert[0].src.forEach((src) => {
    addImg(slider, "li", "splide__slide", src);
  });
  let image_slider = new Splide("#image_slider", {
    perPage: 1,
    type: "loop",
    cover: false,
    autoHeight: true,
    autoplay: true,
    interval: 1500,
    pauseOnHover: false,
    breakpoints: {
      600: {
        perPage: 1,
      },
    },
  }).mount();
});
getDataCollection("computer-data").then((rs) => {
  let database = [];
  rs.forEach((item) => {
    let data = item.data();
    data.id = item.id;
    data.located = "computer-data";
    database.push(data);
  });
  localStorage.setItem("laptopDatabase", JSON.stringify(database));
  const laptopDatabase = JSON.parse(localStorage.getItem("laptopDatabase"));
  for (let i = 0; i < 8; i++) {
    card(laptopDatabase[i], items);
  }
}, false);

//render icon of component
const componentIcon = document.querySelector(".componentIcon");

function renderIcon(obj) {
  let div = document.createElement("div");
  let i = document.createElement("i");
  i.classList += obj.class;
  i.value += obj.type;
  let p = document.createElement("p");
  p.textContent = obj.type;
  div.appendChild(i);
  div.appendChild(p);
  componentIcon.appendChild(div);
  div.onclick = () => {
    localStorage.setItem("flags", JSON.stringify({ component: obj.type }));
    window.location.href = "/ce4js_project/product/product.html";
  };
}
db.collection("componentType")
  .get()
  .then((snapshot) => {
    let db =[];
    snapshot.docs.forEach((doc) => {
      db.push(doc.data());
      renderIcon(doc.data());
    });
    let obj = {
      type: "other",
      class: "fal fa-ellipsis-h-alt",
    };
    db.push(obj);
    localStorage.setItem("componentType", JSON.stringify(db))
    renderIcon(obj);
  });
let hardware = document.querySelector(".hardware");
getDataCollection("build-computer").then((rs) => {
  let database = [];
  let type = [];
  rs.forEach((doc) => {
    let data = doc.data();
    data.id = doc.id;
    data.located = "build-computer";
    database.push(data);
    if (type.length == 0) {
      type.push(doc.data().type);
    } else {
      const tmp = type.find((i) => i == doc.data().type);
      if (tmp == null) type.push(doc.data().type);
    }
  });
  localStorage.setItem("hardwareDB", JSON.stringify(database));
  localStorage.setItem("hardwareType", JSON.stringify(type));
  
  const hardwareDB = JSON.parse(localStorage.getItem("hardwareDB"));
  console.log(hardwareDB[0]);
  for (let i = 0; i < 8; i++) {
    card(hardwareDB[i], hardware);
  }
}, false);
getDataCollection("components").then((rs) => {
  let database = [];
  rs.forEach((item) => {
    let data = item.data();
    data.id = item.id;
    data.located = "components";
    database.push(data);
  });
  localStorage.setItem("components", JSON.stringify(database));
  
}, false);