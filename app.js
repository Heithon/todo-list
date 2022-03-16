
let add = document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click", e => {
    e.preventDefault();
    //提取带操作元素和输入信息
    let form = e.target.parentElement;
    let text = form.children[0].value;
    let month = form.children[1].value;
    let day = form.children[2].value;

    month = Math.floor(Number(month));
    day = Math.floor(Number(day));

    if (text === "") {
        alert("请输入内容！！！");
        return;
    }
    if ((month != "") || (day != "")) {
        if ((month < 1) || (month > 12)) {
            alert("月份请输入1-12的数字。");
            return;
        }
        if ((day < 1) || (day > 31)) {
            alert("日期请输入1-31的数字。");
            return;
        }
    }

    // 创建每一个事项
    let toDo = document.createElement("div");
    toDo.classList.add("toDo");
    let description = document.createElement("p");
    description.classList.add("description");
    description.style.wordBreak = "break-word";
    description.innerText = text;
    let time = document.createElement("p");
    time.classList.add("time");
    time.innerText = month + "/" + day;
    toDo.appendChild(description);
    toDo.appendChild(time);
    // 创建删除和完成按钮
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = '<span class="iconfont complete"></span>';
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");//有则去掉，无则加上
    })

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<span class="iconfont trash"></span>';
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
            // 从localstorage里删除
            let text = todoItem.children[0].innerText;
            let ListArray = JSON.parse(localStorage.getItem("list"));
            ListArray.forEach((item, index) => {
                if (item.text === text) {
                    ListArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(ListArray));
                }
            })
            todoItem.remove();
        })
        todoItem.style.animation = "scaleDown 0.25s forwards";
    })

    toDo.appendChild(completeButton);
    toDo.appendChild(trashButton);

    toDo.style.animation = "scaleUp 0.3s forwards";


    form.children[0].value = "";//清空输入框
    section.appendChild(toDo);

    // 存储数据
    let myTodo = {
        text: toDo.children[0].innerText,
        month: month,
        day: day

    };


    let myList = localStorage.getItem("list");
    if (myList == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(myListArray));
    }
})

load();

function load() {// 加载事项
    let loadList = localStorage.getItem("list");
    if (loadList !== null) {
        let myListArray = JSON.parse(loadList);
        myListArray.forEach(item => {

            let toDo = document.createElement("div");
            toDo.classList.add("toDo");
            let description = document.createElement("p");
            description.classList.add("description");
            description.style.wordBreak = "break-word";
            description.innerText = item.text;
            let time = document.createElement("p");
            time.classList.add("time");
            time.innerText = item.month + "/" + item.day;
            toDo.appendChild(description);
            toDo.appendChild(time);

            // 创建删除和完成按钮
            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = '<span class="iconfont complete"></span>';
            completeButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done");//有则去掉，无则加上
            })

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<span class="iconfont trash"></span>';
            trashButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.addEventListener("animationend", () => {
                    // 从localstorage里删除
                    let text = todoItem.children[0].innerText;
                    let ListArray = JSON.parse(localStorage.getItem("list"));
                    ListArray.forEach((item, index) => {
                        console.log(text + '//' + item.text);
                        if (item.text == text) {
                            ListArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(ListArray));
                        }
                    })
                    todoItem.remove();
                })
                todoItem.style.animation = "scaleDown 0.25s forwards";
            })

            toDo.style.animation = "scaleUp 0.3s forwards";
            toDo.appendChild(completeButton);
            toDo.appendChild(trashButton);

            section.appendChild(toDo);

        });
    }
}

function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        let ai = Number(arr1[i].month) * 100 + Number(arr1[i].day);
        let aj = Number(arr2[j].month) * 100 + Number(arr2[j].day);

        if (ai > aj) {
            result.push(arr2[j]);
            j++;
        }
        else {
            result.push(arr1[i]);
            i++;
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }
    return result;
}


function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let mid = Math.floor(arr.length / 2);
        let left = arr.slice(0, mid);
        let right = arr.slice(mid, arr.length);
        return mergeTime(mergeSort(left), mergeSort(right));
    }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    let rearr = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(rearr));

    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    load();
})
