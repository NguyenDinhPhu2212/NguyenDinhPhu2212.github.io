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

//show data
const addImg = (parent, tag, tagClass, src) => {
    let li = document.createElement(tag);
    li.className = tagClass;
    let img = document.createElement("img");
    img.src = src;
    li.appendChild(img);
    parent.appendChild(li);
};

function slider() {
    return new Splide(".splide", {
        perPage: 1,
        type: "loop",
        cover: false,
        autoHeight: true,
        autoplay: true,
        interval: 1000,
        breakpoints: {
            600: {
                perPage: 1,
            },
        },
    }).mount();
}
const container = document.querySelector(".container");
const requestID = JSON.parse(localStorage.getItem("requestID"));

function displayInfo(response) {
    let name = document.createElement("h4");
    name.textContent = response.name;

    let contain = document.createElement("div");
    //img slider
    let imgSlider = document.createElement("div");
    imgSlider.classList += "splide";
    imgSlider.id = "card-slider";
    let splide_track = document.createElement("div");
    splide_track.classList += "splide__track";
    let splide_list = document.createElement("ul");
    splide_list.classList += "splide__list";
    response.src.forEach((link) =>
        addImg(splide_list, "li", "splide__slide", link)
    );
    splide_track.appendChild(splide_list);
    imgSlider.appendChild(splide_track);
    contain.appendChild(imgSlider);
    //
    let rightSide = document.createElement("div");
    rightSide.id = "rightSide";
    rightSide.classList += "d-flex flex-column";
    let h6 = document.createElement("h6");
    rightSide.appendChild(h6);
    h6.textContent = " Thông số sản phẩm:";
    if (response.parameters != null) {
        let para = document.createElement("ul");
        response.parameters.forEach((pr) => {
            let li = document.createElement("li");
            li.style.listStyleType = "none";
            li.textContent = `${pr.attribute}: ${pr.value}`;
            para.appendChild(li);
        });
        rightSide.appendChild(para);
    }
    let price = document.createElement("h6");
    price.innerHTML = `Giá bán: <span class="h5">${new Intl.NumberFormat(
    "vi-VN",
    { style: "currency", currency: "VND" }
  ).format(response.price)}<span>`;
    rightSide.appendChild(price);
    if (response.guarantee == null) {
        let guarantee = document.createElement("h6");
        guarantee.innerHTML = `Bảo hành: <span class="h5" style="color:red">${response.guarantee} tháng<span>`;
        rightSide.appendChild(guarantee);
    }
    let status = document.createElement("p");
    status.textContent = `Số lượng: còn ${response.status} sản phẩm`;
    status.style.color = "rgb(255, 53, 46)";
    rightSide.appendChild(status);

    let addIntoCart = document.createElement("button");
    addIntoCart.innerHTML = `<i class="fal fa-cart-plus"></i> Thêm vào giỏ hàng`;
    addIntoCart.id = "addIntoCart";
    if (response.status == 0) {
        addIntoCart.disabled = true;
    }
    addIntoCart.onclick = (event) => {
        db.collection(requestID.located)
            .doc(requestID.id)
            .get()
            .then(function(doc) {
                if (doc.exists) {
                    let itemInfo = doc.data();
                    itemInfo.id = doc.id;
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
                        let index = resource.findIndex(function(item) {
                            return item.id == doc.id;
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
            .catch(function(error) {
                console.log("Error getting document:", error);
            });
    };
    rightSide.appendChild(addIntoCart);

    contain.appendChild(rightSide);
    container.appendChild(name);
    container.appendChild(contain);
    slider();
}

//getting data ID
console.log(requestID);
db.collection(requestID.located)
    .doc(requestID.id)
    .get()
    .then(function(document) {
        if (document.exists) {
            displayInfo(document.data(), requestID.id);
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    })
    .catch(function(error) {
        console.log("Error getting document:", error);
    });
//adding data