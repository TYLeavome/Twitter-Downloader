const image_area = document.querySelector("#react-root > div > div > div > main > div > div > div > div > div > div:nth-child(3) > div > div > section > div > div");
const first_line = image_area.querySelector('div:nth-child(3)');
const image1 = first_line.querySelector('div > div > div > div > li:nth-child(1) > div > div > div > a');
const image2 = first_line.querySelector('div > div > div > div > li:nth-child(2) > div > div > div > a');
const image3 = first_line.querySelector('div > div > div > div > li:nth-child(3) > div > div > div > a');
const wait_time = 500;

// 根据传入的下载地址src和需要保存的filename下载单个图片
function download_img(src, filename) {
    var req = new XMLHttpRequest();
    // console.log('正在连接url...');
    req.open("GET", src, true);
    // console.log('连接成功');
    req.responseType = 'blob';
    req.onload = function (e) {
        if (navigator.msSaveBlob) {
            var name = resourceUrl.substr(resourceUrl.lastIndexOf("/") + 1);
            return navigator.msSaveBlob(req.response, name);
        } else {
            var url = window.URL.createObjectURL(req.response);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
        }
    }
    return req.send();
}

function getCssSelector(element) {
    var paths = [];
    while (element) {
        var tagName = element.nodeName.toLowerCase();
        if (element.id) {
            paths.unshift(tagName + '#' + element.id);
            break;
        } else {
            var sib = element, nth = 1;
            while (sib = sib.previousElementSibling) {
                nth++;
            }
            paths.unshift(tagName + ":nth-child(" + nth + ")");
        }
        element = element.parentElement;
    }
    return paths.join(" > ");
}

function get_click_node(css) {
    // 根据给定的CSS选择器获取节点
    let node = document.querySelector(css);
    if (!node) {
        return null; // 如果节点不存在，则返回null
    }

    // 检查节点是否可点击（这里的判断可以根据实际情况调整）
    function isClickable(node) {
        return node.tagName === 'A' || node.tagName === 'BUTTON' || node.hasAttribute('onclick') || typeof node.onclick === 'function';
    }

    // 生成CSS选择器
    function getCssSelector(element) {
        var paths = [];
        while (element) {
            var tagName = element.nodeName.toLowerCase();
            if (element.id) {
                paths.unshift(tagName + '#' + element.id);
                break;
            } else {
                var sib = element, nth = 1;
                while (sib = sib.previousElementSibling) {
                    nth++;
                }
                paths.unshift(tagName + ":nth-child(" + nth + ")");
            }
            element = element.parentElement;
        }
        return paths.join(" > ");
    }

    // 向上回溯查找可点击的节点
    while (node && !isClickable(node)) {
        node = node.parentElement;
    }

    // 如果找到可点击的节点，返回其CSS选择器
    if (node) {
        return getCssSelector(node);
    } else {
        return null; // 如果没有找到，返回null
    }
}

function auto_process() {
    setTimeout(() => {
        // 2. 模拟点击右上角按钮展开新的评论区域的效果，然后等待2秒
        const expandCommentsBtn = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div:nth-child(3) > div');
        expandCommentsBtn.click();
        setTimeout(() => {
            // 3. 在content_block内读取评论内容并输出
            const content_block = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > section > div > div > div:nth-child(1) > div > div > article > div > div > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1)');
            const content = content_block.textContent.replace(/[\u{1F600}-\u{1F64F}]/gu, "").replace(/http[s]?:\/\/\S+/g, "");
            console.log(content);
            // 4. 在date_block内读取日期并输出
            const date_block = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > section > div > div > div:nth-child(1) > div > div > article > div > div > div:nth-child(3) > div > div > div > div > div:nth-child(1) > a > time');
            const date = date_block.getAttribute('datetime'); // 假设时间存储在datetime属性中
            console.log(date);
            setTimeout(() => {
                // 5. 再次点击expandCommentsBtn，关闭展开的评论区域
                expandCommentsBtn.click();
                setTimeout(() => {
                    // 6. 获取所有图片链接并输出
                    document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > img')
                    const ul_node = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div > div > div > div > ul');
                    let images = [];
                    if (ul_node) {
                        const li_nodes = ul_node.querySelectorAll('li');
                        images = Array.from(li_nodes).map(li => li.querySelector('img').src);
                    } else {
                        const single_image_node = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > img');
                        if (single_image_node) {
                            images.push(single_image_node.src);
                        }
                    }
                    console.log(images);

                    // 下一步是图片下载，这部分通常在服务器端处理
                    // 假设我们已经有了 images 数组、content 和 date 变量
                    images.forEach((src, index) => {
                        // 替换src中的格式参数，获取原图链接
                        const srcOriginal = src.replace(/format=jpg&name=\w+/, 'format=jpg&name=orig');
                        // 格式化日期时间字符串
                        const dateTimeFormatted = date.replace('T', ' ').replace(/:/g, '').replace(/\.\d+Z$/, '');
                        // 生成文件名，这里用‘text’作为示例，你可以替换为实际的内容文本
                        const filename = `${dateTimeFormatted} ${content} ${index + 1}.jpeg`;
                        // 调用download_img函数下载图片
                        download_img(srcOriginal, filename);
                    });
                    setTimeout(() => {
                        // 8. 模拟自动点击左上角“X”回到原来页面的效果
                        const closeBtn = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div:nth-child(2)');
                        closeBtn.click();
                    }, wait_time);
                }, wait_time);
            }, wait_time);
        }, wait_time);
    }, wait_time);
}

function auto_download(css){
    img = document.querySelector("css")
    // img.click()
    auto_process()
}

document.addEventListener('dblclick', function(event) {
    // 确保是鼠标左键双击
    if (event.button === 0) {
        // 获取双击的元素
        const targetElement = event.target;
        // 获得元素的CSS选择器
        const cssSelector = getCssSelector(targetElement);
        // 调用auto_download函数，并传入CSS选择器
        auto_download(cssSelector);
    }
});
