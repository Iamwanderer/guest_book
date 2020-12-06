$(function() {

    "use strict";

    function feedbackMaker() {
        let startFeedback = document.getElementById("feedback");
        startFeedback.onclick = function(event) {
            let div = document.createElement("div");
            let form = `<form id="dialog" onsubmit="event.preventDefault()" action="/add" method="post">
                <h2>Мой комментарий:</h2>
                <i id="close_form" class="material-icons close_form">clear</i>
                <div id="error" class="error"></div>

                <span class="form_container">
                    <span class="feedback_wrap"><p>Имя (на английском):</p><input name="name" id="user_name" type="text" maxlength="40" value="" required placeholder="e.g. Piter"></span>
                    <span class="feedback_wrap"><p>E-mail:</p><input name="mail" id="email" type="text" maxlength="40" value="" required placeholder="mail@example.com"></span>
                    <span class="feedback_wrap"><p>Моя домашняя страница:</p><input id="homepage" name="page" type="text" maxlength="100" placeholder="example.com" value=""></span>
                </span>

                <span class="feedback_wrap"><p>Текст комментария:</p><textarea class="textarea_form" id="feedback" maxlength="800" required></textarea></span>

                <span class="form_container">
                    <input id="image_loader" type="file" hidden>
                    <input id="upload" type="button" class="button_submit" value="Добавить изображение">
                    <input id="view_preview" type="button" class="button_submit" value="Предварительный просмотр">
                    <input id="feedback_send" type="submit" class="button_submit" value="Опубликовать">
                </span></form>`;

            div.className = "feedback_form";
            div.innerHTML = form;
            let main = document.querySelector("main");
            main.prepend(div);
            uploadImage();

            startFeedback.style.display = "none";

            document.getElementById("close_form").onclick = function(event) {
                document.querySelector(".feedback_form").remove();
                startFeedback.style.display = "block";
            };

            function nameValidation() {
                let nameInput = document.getElementById("user_name");
                nameInput.oninput = function() {
                    if (this.value.match(/[^0-9A-Z a-z]/gi)) {
                        this.value = this.value.replace(/[^0-9A-Z a-z]/gi, "");
                    }
                };
            }
            nameValidation();

            function emailHandler() {
                let emailInput = document.getElementById("email");
                let error = document.getElementById("error");

                function emailValidation() {
                    emailInput.oninput = function() {
                        error.innerHTML = "";
                        this.value = this.value.toLowerCase();
                        if (this.value.match(/[^@0-9a-z-\.]/gi)) {
                            this.value = this.value.replace(/[^@0-9a-z-\.]/gi, "");
                        }
                    };

                    emailInput.onblur = function() {
                        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,})$/;

                        if (!this.value.match(reg) && this.value != "") {
                            error.innerHTML = "Ошибка. Пожалуйста, введите правильный email.";
                            this.classList.add("invalid");
                            return false;
                        }

                        async function checkingMailOriginality(event) {
                            let data = document.getElementById("email").value;
                            if (data == "") return false;
                            let path = "/check";

                            let response = await fetch(path, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json;charset=utf-8",
                                },
                                body: JSON.stringify(data),
                            });

                            let result = await response.text();

                            if (result != 0) {
                                error.innerHTML =
                                    "Вы уже комментировали. Допустим только один отзыв!";
                            }
                        }
                        checkingMailOriginality();
                    };
                }
                emailValidation();
            }
            emailHandler();

            function homePageValidation() {
                let homepage = document.getElementById("homepage");
                homepage.onblur = function() {
                    this.value = this.value.toLowerCase().replace("https://", "").replace("http://", "");
                };
            }
            homePageValidation();

            function feedbackValidation() {
                let feedbackInput = document.getElementById("feedback");
                let temp = document.createElement("div");
                let sanitized;

                feedbackInput.oninput = async function(event) {
                    temp.innerHTML = feedbackInput.value;
                    sanitized = temp.textContent || temp.innerText;
                    if (sanitized.match(/[<>\[\]]/gi)) {
                        sanitized = this.value.replace(/[<>\[\]]/gi, "");
                    }
                    feedbackInput.value = sanitized;
                };
            }
            feedbackValidation();

            function showPreview() {
                let viewPreview = document.getElementById("view_preview");
                viewPreview.onclick = function() {
                    let name = document.getElementById("user_name").value;
                    let homepage = document.getElementById("homepage").value;
                    let feedback = document.getElementById("feedback").value;
                    let img = uploadImg;
                    let date = new Date();

                    let homepageTemplate = homepage ?
                        `<a href="http://${homepage}"><i class="material-icons home_page">link</i></a>` : "";

                    let imageTemplate = img ? `<span class="img_wrap"><img class="" src="${img}"></span>` : "";

                    let template = `<span class="user_info"><p>${name}</p>${homepageTemplate}
                        <p>${date.getFullYear()}-${date.getMonth() + 1}-${date.getUTCDate()} 
                        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</p>
                        <input id="continue_editing" type="button" class="button_submit continue_editing" value="Продолжить редактирование" >
                        </span><span class="feedback_text">${feedback}</span>${imageTemplate}`;

                    let li = document.createElement("li");
                    li.innerHTML = template;

                    document.getElementById("feedback_list").prepend(li);
                    document.querySelector(".feedback_form").style.display = "none";

                    document.getElementById("continue_editing").onclick = function(event) {
                        document.querySelector(".feedback_form").style.display = "flex";
                        li.remove();
                    };
                };
            }
            showPreview();

            function feedbackSend() {
                let sendButton = document.getElementById("feedback_send");

                sendButton.onclick = async function(event) {
                    let name = document.getElementById("user_name").value;
                    let email = document.getElementById("email").value;
                    let homepage = document.getElementById("homepage").value;
                    let feedback = document.getElementById("feedback").value;
                    let error = document.getElementById("error").innerHTML;
                    let img = uploadImg;

                    if (!name || !email || !feedback || error) {
                        return;
                    }

                    let data = {
                        name: name,
                        mail: email,
                        page: homepage,
                        feedback: feedback,
                        image: img,
                    };

                    let path = "/add";

                    let response = await fetch(path, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json;charset=utf-8",
                        },
                        body: JSON.stringify(data),
                    });

                    let result = await response.text();
                    document.location.href = "/";
                };
            }
            feedbackSend();
        };
    }
    feedbackMaker();

    function makeStartButton() {
        let button = `<div class="set_sort_param"><span>Сортировать</span>
            <i class="material-icons sort_param">sort</i></div>`;

        if ($("#feedback_list").find("li").length > 1) {
            $("main").prepend(button);
        }
    }
    makeStartButton();

    $(".set_sort_param").on("click", function() {
        $(".actions_list").remove();
        $(".set_sort_param").append(`
            <div id="actions_list" class="actions_list sort_action">
            <ul>
                <li data-val="sort-data-desc" class="selected_sort_par"><i class="material-icons">navigate_next</i>по убыванию даты публикации</li>
                <li data-val="sort-data-asc"><i class="material-icons">navigate_next</i>по возрастанию даты публикации</li>
                <li data-val="sort-mail-asc"><i class="material-icons">navigate_next</i>по возрастанию e-mail пользователя</li>
                <li data-val="sort-mail-desc"><i class="material-icons">navigate_next</i>по убыванию e-mail пользователя</li>
                <li data-val="sort-name-asc"><i class="material-icons">navigate_next</i>имя пользователя по алфавиту</li>
                <li data-val="sort-name-desc"><i class="material-icons">navigate_next</i>имя пользователя по обратному алфавиту</li>
            </ul>
            </div>`);

        var url = self.location.href;

        $("#actions_list").find("li").each(function() {
            if (url.includes(this.dataset.val)) {
                $("#actions_list").find("li").removeClass();
                $(this).addClass("selected_sort_par");
            }
        });

        $("#actions_list").find("li").on("click", function() {
            if ($(this).hasClass("sorted")) {
                $("#actions_list").remove();
                return false;
            } else {
                document.location.href = "/" + this.dataset.val + "/";
            }
        });

        $(document).mouseup(function(e) {
            var container = $(".actions_list");
            if (container.has(e.target).length === 0) {
                container.remove();
            }
        });

        $(".dialogue_off").on("click", function() {
            $("#actions_list").remove();
        });
    });

    var uploadImg = "";

    function uploadImage() {
        let imageLoader = document.getElementById("image_loader");
        imageLoader.addEventListener("change", handleImage, false);

        $("#upload").click(function() {
            $("#image_loader").click();
        });

        function handleImage(e) {
            let target = imageLoader.files[0];
            let type = target.type.split("/");
            let typeArr = ["jpg", "jpeg", "gif", "png"];

            if (!typeArr.includes(type[1])) {
                document.forms[0].elements[5].value = "Недопустимый формат";
                return;
            } else {
                document.getElementById("upload").setAttribute("disabled", "true");
                document.forms[0].elements[5].value = "Изображение загружено";
            }

            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);

            reader.onload = function(event) {
                let image = new Image();
                image.src = event.target.result;

                image.onload = function() {
                    let imgWidth = image.width;
                    let imgHeight = image.height;
                    let orientation = imgWidth / imgHeight;

                    if (imgHeight > 240 || imgWidth > 320) {

                        if (orientation <= 1 || imgHeight * (320 / imgWidth) > 240) {

                            imgWidth = imgWidth * (240 / imgHeight);
                            imgHeight = 240;

                        } else {

                            imgHeight = imgHeight * (320 / imgWidth);
                            imgWidth = 320;

                        }
                    }

                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    canvas.width = imgWidth;
                    canvas.height = imgHeight;
                    ctx.drawImage(image, 0, 0, imgWidth, imgHeight);

                    let preview = new Image(imgWidth, imgHeight);
                    preview.src = canvas.toDataURL("image/jpeg", 1.0);
                    uploadImg = preview.src;
                };
            };
        }
    }
});