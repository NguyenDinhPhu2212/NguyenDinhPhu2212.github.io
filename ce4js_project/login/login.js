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
const forms = document.querySelector("#form");
const check = (username, password) => {
  return new Promise((resolve, reject) => {
    getDataCollection("user").then((rs) => {
      let bool = false;
      rs.forEach((doc) => {
        if (
          doc.data().username == username &&
          doc.data().password == password
        ) {
          bool = true;
        }
      });
      resolve(bool);
    });
  });
};
console.log(forms.children);
const adv = document.querySelector("#form p");
console.log(adv.textContent);
const form_ct = document.getElementsByClassName("form-control");
for(i in form_ct){
  form_ct[i].onclick = ()=>{
    adv.style.display = "none";
  }
}
forms.onsubmit = async (event) => {
  event.preventDefault();
  await check(forms.username.value, forms.password.value).then((rs) => {
    if (rs) {
      localStorage.setItem("sign_in", true);
      window.location.href = "../index.html";
    } else {
      adv.style.display = "";
    }
  });
};
