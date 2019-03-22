var maxFileSize = 40;

var modalConfig = {
    overlay: true,
    modal: true
};

$(window).ready(() => {

    var notSelectFileModal = new mdui.Dialog("#not-select-file", modalConfig);

    var fileNotValidModal = new mdui.Dialog("#file-not-valid", modalConfig);

    var uploadFailModal = new mdui.Dialog("#upload-fail", modalConfig);

    var convertErrorModal = new mdui.Dialog("#convert-error", modalConfig);

    var helpModal = new mdui.Dialog("#help", modalConfig);

    $("#select-file").on("click", () => {
        $("#upload-file").trigger("click");
    });

    $("#upload-file").on("change", () => {
        $("#file-name").text($("#upload-file").val().split("\\").pop());
    });

    $("#upload").on("click", () => {
        let file = $("#upload-file").prop("files")[0];

        if (file === undefined) {
            notSelectFileModal.open();
        } else {
            // 检查大小和扩展名
            let fileSize = (file.size / 1024 / 1024) + 1;

            let fileExtension = file.name.split(".").pop();

            if (fileSize > maxFileSize || fileExtension !== "ncm") {
                fileNotValidModal.open();
            } else {
                // 构造表单对象
                let form = new FormData();
                form.append('file', file);

                // 加载loader
                $("#upload").text("上传中......");
                $("#upload-status-bar").show();

                // 上传文件
                $.ajax({
                    url: "/upload_ncm_music",
                    type: "POST",
                    cache: false,
                    data: form,
                    processData: false,
                    contentType: false,
                    error: (res) => {
                        uploadFailModal.open();
                    },
                    success: (res) => {
                        switch (res["err_code"]) {
                            // 没有任何错误
                            case 0:
                                $("#download-status-bar").show();
                                setTimeout(() => {
                                    $("#download-status-bar").hide();
                                    $("#download-file").removeAttr("disabled");
                                    $("#download-file").attr("onclick", "window.open('" + res["err_msg"] + "')");
                                    $("#download-file-name").text(res["err_msg"].split("/").pop())
                                }, (Math.random() + 1) * 1500);
                                break;
                            // 上传过程出现错误
                            case -1:
                                uploadFailModal.open();
                                break;
                            // 文件转换出现错误
                            case -2:
                                convertErrorModal.open();
                                break;
                        }
                        $("#upload").text("上传到服务器");
                        $("#upload-status-bar").hide();
                    }
                })
            }
        }
    });

    $(".help").on("click", () => {
        helpModal.open();
    });
});