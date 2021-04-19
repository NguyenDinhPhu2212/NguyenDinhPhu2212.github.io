function getDataCollection(collectionName) {
  return new Promise((resolve, reject) => {
    db.collection(collectionName)
      .onSnapshot((snapshot) => {
        let itemList = [];
        snapshot.forEach((doc) => {
          itemList.push(doc);
        });
        resolve(itemList);
      });
  });
}
//sign in
let signInMenu = document.querySelector("#signInMenu");
let signIn = document.querySelector("#signInMenu a");
let signOut = document.querySelector("#signOut");

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
//badge
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
//getting data
//items database

const laptopDatabase = JSON.parse(localStorage.getItem("laptopDatabase"));
//brand database

// component
const componentType = JSON.parse(localStorage.getItem("componentType"));

const components = JSON.parse(localStorage.getItem("components"));
//hardware

const hardwareDB = JSON.parse(localStorage.getItem("hardwareDB"));
const hardwareType = JSON.parse(localStorage.getItem("hardwareType"));
//display module
const filter = document.querySelector(".filter");
const items = document.querySelector(".items");
//render card
const card = (db) => {
  let card = document.createElement("div");
  card.style.width = "250px";
  card.className = "class col";
  card.setAttribute("data-id", db.id);
  let card_img = document.createElement("img");
  card_img.className = "card-img-top";
  card_img.src = db.src[0];
  card_img.style.cursor = "pointer";
  let card_body = document.createElement("div");
  let card_title = document.createElement("h6");
  card_title.classList += "card-title ";
  if (db.subName == null) {
    card_title.textContent = db.name;
  } else card_title.textContent = db.subName;
  card_title.style.cursor = "pointer";
  let card_text = document.createElement("p");
  card_text.className = "card-text";
  card_text.textContent =
    "Price: " +
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(db.price);
  let btn = document.createElement("button");
  btn.classList.add("btn", "btn-primary");
  btn.textContent = "Thêm vào giỏ hàng";
  btn.style.position = "absolute";
  btn.style.bottom = "0";
  if (db.status == 0) {
    btn.disabled = true;
  }
  card_body.appendChild(card_title);
  card_body.appendChild(card_text);
  card_body.appendChild(btn);
  card_body.style.height = "150px";
  card_body.style.position = "relative";
  card.appendChild(card_img);
  card.appendChild(card_body);
  items.appendChild(card);
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
        JSON.stringify({ located: db.located, id: db.id })
      );
      window.location.href = "/ce4js_project/detail/detail.html";
    };
  });
  btn.onclick = () => {
    let itemInfo = laptopDatabase.find((item) => {
      return item.id == db.id;
    });
    if (itemInfo == null) {
      itemInfo = components.find((item) => {
        return item.id == db.id;
      });
    }
    if (itemInfo == null) {
      itemInfo = hardwareDB.find((item) => {
        return item.id == db.id;
      });
    }
    console.log(itemInfo);
    itemInfo.number = 1;
    itemInfo.located = db.located;
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
        return item.id == db.id;
      });
      if (index != -1) {
        resource[index].number++;
      } else resource.push(itemInfo);
      localStorage.setItem("cartItems", JSON.stringify(resource));
    }
    btn.style.boxShadow = "none";
    updateBadge();
  };
};

const flags = localStorage.getItem("flags");

if (flags == "laptop") {
  const title = document.createElement("h4");
  title.textContent = "Nhãn hàng";
  filter.appendChild(title);

  let brandContain = document.createElement("div");
  brandContain.classList += "row";

  function renderBrand({ name, src } = {}) {
    let img = document.createElement("img");
    img.classList += "brands mt-4";
    img.src = src;
    img.value = name;
    brandContain.appendChild(img);
    img.onclick = () => {
      while (items.firstChild) {
        items.removeChild(items.lastChild);
      }
      laptopDatabase.forEach((item) => {
        if (item.brand == name.toUpperCase()) {
          card(item);
        }
      });
    };
  };
  getDataCollection("computerBrands").then((rs) => {
    rs.forEach((doc) => {
      doc.data().info.forEach((brand) => {
        renderBrand(brand);
      });
    });
  });
  filter.appendChild(brandContain);
  laptopDatabase.forEach((item) => {
    card(item);
  });
  
} else if (flags == "hardware") {
  const title = document.createElement("h4");
  title.textContent = "Linh kiện máy tính";
  let contain = document.createElement("div");
  contain.classList += "d-flex flex-wrap mt-4";
  function renderType(type) {
    let p = document.createElement("p");
    p.textContent = type.toUpperCase();
    p.style.cursor = "pointer";
    p.classList += "filterRS";
    contain.appendChild(p);
    p.onclick = () => {
      while (items.firstChild) {
        items.removeChild(items.lastChild);
      }
      p.style.border = "1px solid rgb(0, 162, 255)";
      const child = p.parentElement.children;
      for (let i = 0; i < child.length; i++) {
        if (child[i].textContent != p.textContent) {
          child[i].style.border = "1px solid rgb(201, 201, 201)";
        }
      }
      hardwareDB.forEach((item) => {
        if (item.type.toLowerCase() == type.toLowerCase()) {
          card(item);
        }
      });
    };
  }
  hardwareType.forEach((type) => {
    renderType(type);
  });
  filter.appendChild(title);
  filter.appendChild(contain);
  hardwareDB.forEach((item) => {
    card(item);
  });
} else {
  let contain = document.createElement("div");
  contain.classList += "componentIcon d-flex flex-wrap";

  function renderIcon(obj) {
    let div = document.createElement("div");
    let i = document.createElement("i");
    i.classList += obj.class;
    i.value += obj.type;
    let p = document.createElement("p");
    p.textContent = obj.type;
    div.appendChild(i);
    div.appendChild(p);
    contain.appendChild(div);
    div.onclick = () => {
      while (items.firstChild) {
        items.removeChild(items.lastChild);
      }
      components.forEach((item) => {
        if (item.type == obj.type) {
          card(item);
        }
      });
    };
  }
  componentType.forEach((doc) => {
    renderIcon(doc);
  });
  
  const title = document.createElement("h4");
  title.textContent = "Phụ kiện";
  filter.appendChild(title);
  filter.appendChild(contain);
  let newFlags = JSON.parse(flags);
  if (newFlags.component != "") {
    components.forEach((item) => {
      if (item.type == newFlags.component) {
        card(item);
      }
    });
  } else {
    components.forEach((item) => {
      card(item);
    });
  }
}
