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
let signInMenu = document.querySelector("#signInMenu");
let signIn = document.querySelector("#signInMenu a");
let signOut = document.querySelector("#signOut");
console.log(signIn);
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
// display result
const laptopDatabase = JSON.parse(localStorage.getItem("laptopDatabase"));
const components = JSON.parse(localStorage.getItem("components"));
const hardwareDB = JSON.parse(localStorage.getItem("hardwareDB"));

const urlParam = new URLSearchParams(window.location.search);
const keyWord = urlParam.get("search");
const resultContain = document.querySelector(".result");

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
  if (db.status == 0) {
    btn.disabled = true;
  }
  card_body.appendChild(card_title);
  card_body.appendChild(card_text);
  card_body.appendChild(btn);
  card_body.style.height = "150px";
  card_body.style.position = "relative";
  btn.style.position = "absolute";
  btn.style.bottom = "0";
  card.appendChild(card_img);
  card.appendChild(card_body);
  resultContain.appendChild(card);
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

function filterByKey(obj) {
  return obj.filter(
    (item) =>
      item.name.toLowerCase().includes(keyWord.toLowerCase()) ||
      item.type.toLowerCase().includes(keyWord.toLowerCase())
  );
}
const laptopRS = filterByKey(laptopDatabase);
console.log(laptopRS);
const componentRS = filterByKey(components);
console.log(componentRS);
const hardwareRS = filterByKey(hardwareDB);

let filter = document.querySelector(".filterRS");
const result = document.querySelector(".result");

function renderFilter(str, id) {
  let p = document.createElement("p");
  p.setAttribute("data-id", id);
  p.textContent = str;
  p.style.cursor = "pointer";
  filter.appendChild(p);
  p.onclick = () => {
    while (resultContain.firstChild) {
      resultContain.removeChild(resultContain.lastChild);
    }
    console.log(p.parentElement.children);
    const child = p.parentElement.children;
    for (let i = 0; i < child.length; i++) {
      if (child[i].attributes[0].nodeValue != id) {
        child[i].style.border = "1px solid rgb(201, 201, 201)";
      }
    }
    if (p.getAttribute("data-id") == "laptop") {
      laptopRS.forEach((item) => {
        card(item);
      });
      p.style.border = "1px solid rgb(0, 162, 255)";
    } else if (p.getAttribute("data-id") == "hardware") {
      hardwareRS.forEach((item) => {
        card(item);
      });
      p.style.border = "1px solid rgb(0, 162, 255)";
    } else {
      componentRS.forEach((item) => {
        card(item);
      });
      p.style.border = "1px solid rgb(0, 162, 255)";
    }
  };
}
let h4 = document.querySelector(".container h4");
h4.classList += "mt-4";
h4.textContent = `Tìm thấy ${
  laptopRS.length + componentRS.length + hardwareRS.length
} kết quả cho từ khoá "${keyWord}".`;

renderFilter(`Laptop (${laptopRS.length})`, "laptop");
renderFilter(`Phụ kiện máy tính (${componentRS.length})`, "component");
renderFilter(`Phụ kiện máy tính (${hardwareRS.length})`, "hardware");
laptopRS.forEach((item) => {
  card(item);
});
