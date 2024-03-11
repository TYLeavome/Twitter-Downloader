// const image_area = document.querySelector("#react-root > div > div > div > main > div > div > div > div > div > div:nth-child(3) > div > div > section > div > div");
// const first_line = image_area.querySelector('div:nth-child(3)');
// const image1 = first_line.querySelector('div > div > div > div > li:nth-child(1) > div > div > div > a');
// const image2 = first_line.querySelector('div > div > div > div > li:nth-child(2) > div > div > div > a');
// const image3 = first_line.querySelector('div > div > div > div > li:nth-child(3) > div > div > div > a');
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

// 根据传入的下载地址src和文件名下载单个mp4
function mp4_download(src, filename) {
    fetch(src).then(res => res.blob()).then(blob => {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
    )
}

function download_imgs(images, date, content) {
    // 替换src中的格式参数，获取原图链接
    const srcOriginal = images[0].replace(/format=jpg&name=\w+/, 'format=jpg&name=orig');
    // 格式化日期时间字符串
    const dateTimeFormatted = date.replace('T', ' ').replace(/:/g, '').replace(/\.\d+Z$/, '');
    max_str = 60;
    if (content.length > max_str) {
        content = content.substring(0, max_str);
    }
    if (images.length == 1) {
        if (content == '') {
            filename = `${dateTimeFormatted}.jpeg`;
        } else {
            filename = `${dateTimeFormatted} ${content}.jpeg`;
        }
        // 调用download_img函数下载图片
        download_img(srcOriginal, filename);
    } else {
        images.forEach((src, index) => {
            if (content == '') {
                filename = `${dateTimeFormatted} ${index + 1}.jpeg`;
            } else {
                filename = `${dateTimeFormatted} ${content} ${index + 1}.jpeg`;
            }
            // 调用download_img函数下载图片
            download_img(srcOriginal, filename);
        });
    }
}

function auto_process() {
    setTimeout(() => {
        // 2. 模拟点击右上角按钮展开新的评论区域的效果，然后等待2秒
        const expandCommentsBtn = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div:nth-child(3) > div');
        const closeBtn = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div:nth-child(2)');
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
                    // 初始化images数组用于存储图片链接
                    const images = [];
                    // 尝试获取单个图片
                    const single_image_node = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > img');
                    if (single_image_node) {
                        // 如果存在单个图片，获取图片链接并添加到images数组
                        images.push(single_image_node.src);
                        console.log(images);
                        closeBtn.click();
                        download_imgs(images, date, content);
                    } else {
                        // 尝试获取包含多个图片的ul节点
                        const ul_node = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div > div > div > div > ul');
                        if (ul_node && ul_node.querySelectorAll('li').length > 0) {
                            // 获取第一个li节点内的图片链接并添加到images数组
                            images.push(ul_node.querySelector('li img').src);
                            // 定位向右滚动按钮
                            const toRightBtn = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div');
                            if (toRightBtn) {
                                const li_nodes = ul_node.querySelectorAll('li');
                                num_img = li_nodes.length;
                                switch (num_img) {
                                    case 2:
                                        setTimeout(() => {
                                            toRightBtn.click(); // 点击向右按钮
                                            imgSrc = li_nodes[1].querySelector('img').src;
                                            images.push(imgSrc);
                                            console.log(images);
                                            setTimeout(() => {
                                                closeBtn.click();
                                                download_imgs(images, date, content);
                                            }, wait_time);
                                        }, wait_time);
                                        break
                                    case 3:
                                        setTimeout(() => {
                                            toRightBtn.click(); // 点击向右按钮
                                            imgSrc = li_nodes[1].querySelector('img').src;
                                            images.push(imgSrc);
                                            setTimeout(() => {
                                                toRightBtn.click(); // 点击向右按钮
                                                imgSrc = li_nodes[2].querySelector('img').src;
                                                images.push(imgSrc);
                                                console.log(images);
                                                setTimeout(() => {
                                                    closeBtn.click();
                                                    download_imgs(images, date, content);
                                                }, wait_time);
                                            }, wait_time);
                                        }, wait_time);
                                        break
                                    case 4:
                                        setTimeout(() => {
                                            toRightBtn.click(); // 点击向右按钮
                                            imgSrc = li_nodes[1].querySelector('img').src;
                                            images.push(imgSrc);
                                            setTimeout(() => {
                                                toRightBtn.click(); // 点击向右按钮
                                                imgSrc = li_nodes[2].querySelector('img').src;
                                                images.push(imgSrc);
                                                setTimeout(() => {
                                                    toRightBtn.click(); // 点击向右按钮
                                                    imgSrc = li_nodes[3].querySelector('img').src;
                                                    images.push(imgSrc);
                                                    console.log(images);
                                                    setTimeout(() => {
                                                        closeBtn.click();
                                                        download_imgs(images, date, content);
                                                    }, wait_time);
                                                }, wait_time);
                                            }, wait_time);
                                        }, wait_time);
                                        break
                                }
                            }
                        } else {
                            setTimeout(() => {
                                // 尝试获取视频节点
                                const video = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div > div:nth-child(1) > div > video');
                                if (video) {
                                    // 如果视频存在，获取视频的src地址
                                    const videoSrc = video.querySelector('source').src;
                                    console.log(videoSrc);
                                    // mp4_download(videoSrc, 'video_filename.mp4');
                                }
                                setTimeout(() => {
                                    const closeBtn = document.querySelector('#react-root > div > div > div > div:nth-child(2) > div > div > div > div > div > div > div > div > div > div:nth-child(2)');
                                    closeBtn.click();
                                }, wait_time);
                            }, wait_time);
                        }
                    }
                }, wait_time);
            }, wait_time);
        }, wait_time);
    }, wait_time);
}

function auto_download(css) {
    img = document.querySelector("css")
    // img.click()
    auto_process()
}

document.addEventListener('dblclick', function (event) {
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
