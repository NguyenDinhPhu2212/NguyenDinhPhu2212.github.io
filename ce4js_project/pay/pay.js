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
// has or no item
const hasItem = document.querySelector(".hasItem");
const noItem = document.querySelector(".noItem");

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
  if (sum == 0) {
    hasItem.style.display = "none";
    noItem.style.display = "";
  } else if (sum > 0) {
    hasItem.style.display = "";
    noItem.style.display = "none";
  }
};
updateBadge();

//cart item
const items = document.querySelector(".items");
const total = document.querySelector("#total");
const getTotal = () => {
  const resource = JSON.parse(localStorage.getItem("cartItems"));
  const sum = resource.reduce((sum, item) => {
    return sum + parseInt(item.price)* parseInt(item.number);
  }, 0);
  console.log(sum);
  total.textContent = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(sum);
};
getTotal();
const deleteItem = (id) => {
  let resource = JSON.parse(localStorage.getItem("cartItems"));
  resource = resource.filter((item) => {
    return item.id != id;
  });
  localStorage.setItem("cartItems", JSON.stringify(resource));
};
const changeNumberItem = (id, int) => {
  let resource = JSON.parse(localStorage.getItem("cartItems"));
  resource.forEach((item) => {
    if (item.id == id) {
      item.number += int;
    }
  });
  localStorage.setItem("cartItems", JSON.stringify(resource));
};
function cartItem(db) {
  let li = document.createElement("li");
  li.style.listStyleType = "none";
  li.setAttribute("data-id", db.id);
  let contain = document.createElement("div");
  contain.classList.add("d-flex", "align-items-center");

  let img = document.createElement("img");
  img.src = db.src[0];
  img.classList.add("cartImg", "me-4");
  img.style.cursor = "pointer";

  let info = document.createElement("div");
  info.classList += "flex-grow-1";
  let itemName = document.createElement("h5");
  itemName.textContent = db.name;
  itemName.style.cursor = "pointer";
  let itemPrice = document.createElement("p");
  itemPrice.innerHTML = `Price: <span style="color:red">${new Intl.NumberFormat(
    "vi-VN",
    { style: "currency", currency: "VND" }
  ).format(db.price)}</span>`;
  info.appendChild(itemName);
  info.appendChild(itemPrice);

  let num = document.createElement("div");
  num.classList.add("d-flex", "justify-content-evenly", "align-items-center");
  num.id = "number";
  num.style.minWidth = "180px";
  let div = document.createElement("div");
  div.classList += "d-flex justify-content-around align-items-center";
  let plus = document.createElement("i");
  plus.classList.add("fal", "fa-plus");
  let minus = document.createElement("i");
  minus.classList.add("fal", "fa-minus");
  let dlt = document.createElement("i");
  dlt.classList.add("fal", "fa-trash-alt");
  dlt.style.cursor = "pointer";
  dlt.style.color = "red";
  let count = document.createElement("p");
  count.textContent = db.number;

  div.appendChild(minus);
  div.appendChild(count);
  div.appendChild(plus);
  num.appendChild(div);
  num.appendChild(dlt);
  contain.appendChild(img);
  contain.appendChild(info);
  contain.appendChild(num);
  li.appendChild(contain);
  items.appendChild(li);

  itemName.onmouseover = () => {
    itemName.style.color = "rgb(0, 119, 255)";
  };
  itemName.onmouseout = () => {
    itemName.style.color = "black";
  };
  [img, itemName].forEach((element) => {
    element.onclick = () => {
      localStorage.setItem(
        "requestID",
        JSON.stringify({ located: db.located, id: db.id })
      );
      window.location.href = "/ce4js_project/detail/detail.html";
    };
  });

  plus.onclick = () => {
    changeNumberItem(db.id, 1);
    count.textContent = parseInt(count.textContent) + 1;
    updateBadge();
    getTotal();
  };
  minus.onclick = () => {
    if (parseInt(count.textContent) - 1 == 0) {
      items.removeChild(li);
      deleteItem(db.id);
    } else {
      changeNumberItem(db.id, -1);
      count.textContent = parseInt(count.textContent) - 1;
    }
    updateBadge();
    getTotal();
  };
  dlt.onclick = () => {
    items.removeChild(li);
    deleteItem(db.id);
    updateBadge();
    getTotal();
  };
}
const showItem = () => {
  const resource = JSON.parse(localStorage.getItem("cartItems"));
  resource.forEach((item) => {
    cartItem(item);
  });
};
showItem();
//delete cart
const deleteCart = document.querySelector(".hasItem div p");
deleteCart.onclick = () => {
  if (window.confirm("Bạn chắc chắn muốn xoá giỏ hàng?")) {
    while (items.firstChild) {
      items.removeChild(items.lastChild);
    }
    localStorage.setItem("cartItems", JSON.stringify([]));
    updateBadge();
  }
};
//modal
function makeModal(modalID, titleTag, bodyID, bodyTag, buttonContent) {
  return `<div id="${modalID}" class="modal" tabindex="-1">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-header">
                <h3 class="modal-title">${titleTag}</h3>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div id="${bodyID}" class="modal-body">
              ${bodyTag}
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger d-block" style ="margin-right: 100px;
                width: 300px;">${buttonContent}</button>
              </div>
            </div>
          </div>
        </div>`;
}
let cartModal = makeModal(
  "cartModal",
  "Thông tin thanh toán",
  "cartBody",
  '<div class="d-flex flex-wrap justify-content-around"></div>',
  "Thanh toán"
);
document.body.insertAdjacentHTML("beforeend", cartModal);
let myModal = new bootstrap.Modal(document.getElementById("cartModal"), {
  keyboard: false,
});
let payBtn = document.querySelector(".payBtn");
payBtn.onclick = () => {
  myModal.show();
};
let cartBody = document.querySelector("#cartBody div");
const info = document.createElement("form");
const infoTitle = document.createElement("h4");
infoTitle.textContent = "Thông tin khách hàng";
infoTitle.classList += "modalTitle";
info.appendChild(infoTitle);
function createInput(type, placeholder) {
  let input = document.createElement("input");
  input.style.margin = "10px 0";
  input.classList += "form-control";
  input.placeholder = placeholder;
  input.type = type;
  info.appendChild(input);
}
createInput("text", "Họ và tên");
createInput("email", "Địa chỉ email");
createInput("text", "Số điện thoại");
createInput("text", "Địa chỉ");
const note = document.createElement("textarea");
note.className = "form-control";
note.rows = "3";
note.placeholder = "Ghi chú";
info.appendChild(note);
cartBody.appendChild(info);
info.style.margin = "10px 10px";
info.style.width = "400px";

const payments = document.createElement("form");
const payTitle = document.createElement("h4");
payTitle.textContent = "Hình thức thanh toán";
payTitle.classList += "modalTitle";
payments.appendChild(payTitle);
function createRadio(value, id, check) {
  let div = document.createElement("div");
  div.classList += "form-check mt-4 md-4";
  let input = document.createElement("input");
  input.classList += "form-check-input";
  input.id = id;
  input.name="exampleRadios";
  input.type = "radio";
  if (check == true) {
    input.setAttribute('checked', true);
  }
  div.appendChild(input);
  let label = document.createElement("label");
  label.classList += "form-check-label";
  label.for = id;
  label.textContent = value;
  div.appendChild(label);
  payments.appendChild(div);
}
createRadio("Thanh toán tiền mặt khi nhận hàng", "cash", true);
createRadio(
  "Thanh toán qua chuyển khoản tài khoảng ngân hàng",
  "credit",
  false
);
cartBody.appendChild(payments);
payments.style.margin = "10px 10px";
