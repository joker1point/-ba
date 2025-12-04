// 请求通知权限
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

// 显示通知
function showNotification(title, options) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
    }
}

// 模拟发送邮件
function sendEmailNotification(subject, message) {
    // 这里可以替换为实际的邮件发送API
    console.log(`发送邮件：\n主题：${subject}\n内容：${message}`);
    return true;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 请求通知权限
    requestNotificationPermission();
    // 暗黑模式切换
    const modeToggle = document.getElementById('modeToggle');
    const body = document.body;
    
    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        body.setAttribute('data-theme', 'dark');
        modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        body.setAttribute('data-theme', 'light');
        modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    
    // 切换主题
    modeToggle.addEventListener('click', function() {
        if (body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        }
    });

    // 回到顶部按钮
    const backToTop = document.getElementById('backToTop');
    
    // 滚动监听
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    // 回到顶部点击事件
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 移动端菜单
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // 点击导航链接后关闭菜单
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    document.querySelectorAll('.skill-card, .stat-item, .skill-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 需求表单处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // 简单的表单验证
            if (!data.name || !data.contact || !data.serviceType || !data.description) {
                alert('请填写所有必填字段！');
                return;
            }
            
            // 这里可以添加表单提交逻辑，例如发送到服务器
            console.log('需求表单数据:', data);
            
            // 模拟提交成功
            showNotification('需求提交成功！我会尽快与您联系。', 'success');
            
            // 重置表单
            contactForm.reset();
            
            // 发送邮件通知
            const subject = `新的需求提交 - ${data.serviceType}`;
            const message = `
姓名：${data.name}
联系方式：${data.contact}
需求类型：${data.serviceType}
具体需求：${data.description}
期望交付时间：${data.deliveryTime || '未指定'}
            `;
            sendEmailNotification(subject, message);
            
            // 显示浏览器通知
            showNotification('新需求提交', {
                body: `${data.name}提交了新的${data.serviceType}需求`,
                icon: 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="%234285f4"/><path fill="white" d="M43.2 77.6l37.8-23.2L43.2 31v46.6z"/><path fill="rgba(255,255,255,0.3)" d="M81 30.8l-37.8 23.2 37.8 23.2V30.8z"/></svg>'
            });
        });
    }

    // 留言表单处理
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');
    
    if (commentForm && commentsList) {
        // 加载本地存储的留言
        loadComments();
        
        // 如果没有留言，添加一些模拟数据
        if (commentsList.children.length === 0) {
            addMockComments();
        }
        
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取留言内容
            const commentContent = document.getElementById('commentContent').value;
            
            if (!commentContent.trim()) {
                alert('请填写留言内容！');
                return;
            }
            
            // 创建留言对象
            const comment = {
                id: Date.now(),
                content: commentContent,
                time: new Date().toLocaleString('zh-CN')
            };
            
            // 保存留言到本地存储
            saveComment(comment);
            
            // 显示留言
            addCommentToDOM(comment);
            
            // 重置表单
            commentForm.reset();
            
            // 使用更友好的提示方式
            showNotification('留言提交成功！', 'success');
        });
    }

    // 技能详情页的技能进度条动画
    const skillProgresses = document.querySelectorAll('.skill-progress');
    if (skillProgresses.length > 0) {
        const skillObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 获取宽度值
                    const width = entry.target.style.width;
                    entry.target.style.width = '0';
                    // 触发重排
                    entry.target.offsetHeight;
                    // 动画到目标宽度
                    entry.target.style.width = width;
                    skillObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        skillProgresses.forEach(progress => {
            skillObserver.observe(progress);
        });
    }
});

// 保存留言到本地存储
function saveComment(comment) {
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    comments.unshift(comment); // 添加到开头
    localStorage.setItem('comments', JSON.stringify(comments));
}

// 从本地存储加载留言
function loadComments() {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    
    // 清空留言列表
    commentsList.innerHTML = '';
    
    // 添加所有留言
    comments.forEach(comment => {
        addCommentToDOM(comment);
    });
}

// 添加留言到DOM
function addCommentToDOM(comment) {
    const commentsList = document.getElementById('commentsList');
    if (!commentsList) return;
    
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.dataset.commentId = comment.id;
    
    let repliesHTML = '';
    if (comment.replies && comment.replies.length > 0) {
        repliesHTML = '<div class="replies-list">';
        comment.replies.forEach(reply => {
            repliesHTML += `
                <div class="reply-item" data-reply-id="${reply.id}">
                    <div class="reply-content">${escapeHtml(reply.content)}</div>
                    <div class="reply-meta">
                        <span class="reply-time">${reply.time}</span>
                        <span class="reply-author">回复</span>
                    </div>
                </div>
            `;
        });
        repliesHTML += '</div>';
    }
    
    commentItem.innerHTML = `
        <div class="comment-content">${escapeHtml(comment.content)}</div>
        <div class="comment-meta">
            <span class="comment-time">${comment.time}</span>
            <span class="comment-id">#${comment.id}</span>
        </div>
        <div class="comment-actions">
            <button class="btn-reply" onclick="showReplyForm(${comment.id})">回复</button>
        </div>
        <div class="reply-form" id="replyForm-${comment.id}" style="display: none;">
            <textarea id="replyContent-${comment.id}" placeholder="请输入回复内容..."></textarea>
            <div class="reply-form-actions">
                <button class="btn-cancel" onclick="hideReplyForm(${comment.id})">取消</button>
                <button class="btn-submit" onclick="submitReply(${comment.id})">提交回复</button>
            </div>
        </div>
        ${repliesHTML}
    `;
    
    commentsList.insertBefore(commentItem, commentsList.firstChild);
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // 考虑导航栏高度
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 显示回复表单
function showReplyForm(commentId) {
    const replyForm = document.getElementById(`replyForm-${commentId}`);
    if (replyForm) {
        replyForm.style.display = 'block';
    }
}

// 隐藏回复表单
function hideReplyForm(commentId) {
    const replyForm = document.getElementById(`replyForm-${commentId}`);
    const replyContent = document.getElementById(`replyContent-${commentId}`);
    if (replyForm) {
        replyForm.style.display = 'none';
        if (replyContent) {
            replyContent.value = '';
        }
    }
}

// 提交回复
function submitReply(commentId) {
    const replyContent = document.getElementById(`replyContent-${commentId}`);
    if (!replyContent || !replyContent.value.trim()) {
        alert('请填写回复内容！');
        return;
    }
    
    // 创建回复对象
    const reply = {
        id: Date.now(),
        content: replyContent.value.trim(),
        time: new Date().toLocaleString('zh-CN')
    };
    
    // 保存回复到本地存储
    let comments = JSON.parse(localStorage.getItem('comments')) || [];
    const commentIndex = comments.findIndex(c => c.id === commentId);
    if (commentIndex !== -1) {
        if (!comments[commentIndex].replies) {
            comments[commentIndex].replies = [];
        }
        comments[commentIndex].replies.push(reply);
        localStorage.setItem('comments', JSON.stringify(comments));
        
        // 更新DOM显示回复
        updateCommentReplies(commentId, reply);
        
        // 隐藏回复表单并清空内容
        hideReplyForm(commentId);
        
        // 显示成功通知
        showNotification('回复提交成功！', 'success');
    }
}

// 更新评论的回复显示
function updateCommentReplies(commentId, reply) {
    const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
    if (!commentItem) return;
    
    let repliesList = commentItem.querySelector('.replies-list');
    if (!repliesList) {
        repliesList = document.createElement('div');
        repliesList.className = 'replies-list';
        commentItem.appendChild(repliesList);
    }
    
    const replyItem = document.createElement('div');
    replyItem.className = 'reply-item';
    replyItem.dataset.replyId = reply.id;
    replyItem.innerHTML = `
        <div class="reply-content">${escapeHtml(reply.content)}</div>
        <div class="reply-meta">
            <span class="reply-time">${reply.time}</span>
            <span class="reply-author">回复</span>
        </div>
    `;
    
    repliesList.appendChild(replyItem);
}

// 添加模拟留言数据
function addMockComments() {
    const mockComments = [
        {
            id: 1,
            content: '我需要一个电商网站，包含商品展示、购物车和支付功能，请问大概需要多少钱？',
            time: new Date(Date.now() - 3*24*60*60*1000).toLocaleString('zh-CN'),
            replies: [
                {
                    id: 1001,
                    content: '您好！电商网站的价格会根据功能复杂度、设计要求等因素有所不同。一般来说，基础版电商网站价格在5000-10000元左右，功能更复杂的企业版可能需要20000元以上。建议您详细描述需求，我可以给您提供更准确的报价。',
                    time: new Date(Date.now() - 2*24*60*60*1000).toLocaleString('zh-CN')
                }
            ]
        },
        {
            id: 2,
            content: '您好，我想开发一个微信小程序，用于预约服务，请问多久能完成？',
            time: new Date(Date.now() - 2*24*60*60*1000).toLocaleString('zh-CN'),
            replies: [
                {
                    id: 1002,
                    content: '微信小程序的开发周期一般在2-4周左右，具体取决于功能复杂度。预约服务类的小程序相对简单，如果需求明确，大概2周就能完成开发和测试。',
                    time: new Date(Date.now() - 1.5*24*60*60*1000).toLocaleString('zh-CN')
                }
            ]
        },
        {
            id: 3,
            content: '我的网站有一些bug需要修复，主要是前端显示问题，能帮忙处理吗？',
            time: new Date(Date.now() - 1*24*60*60*1000).toLocaleString('zh-CN')
        },
        {
            id: 4,
            content: '我需要对接第三方支付API，你们有这方面的经验吗？',
            time: new Date(Date.now() - 12*60*60*1000).toLocaleString('zh-CN'),
            replies: [
                {
                    id: 1003,
                    content: '是的，我有丰富的第三方支付API对接经验，包括支付宝、微信支付、银联等。请告诉我您需要对接的具体支付平台和需求，我可以为您提供专业的对接服务。',
                    time: new Date(Date.now() - 10*60*60*1000).toLocaleString('zh-CN')
                }
            ]
        }
    ];
    
    mockComments.forEach(comment => {
        saveComment(comment);
        addCommentToDOM(comment);
    });
}

// 显示通知函数
function showNotification(message, type = 'success') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-size: 16px;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3秒后隐藏并移除
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 模拟发送邮件函数（实际项目中需要后端支持）
function sendEmail(data) {
    // 这里是模拟代码，实际项目中需要使用后端API来发送邮件
    console.log('发送邮件:', data);
    
    // 示例：使用fetch发送数据到服务器
    /*
    fetch('https://your-api.com/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('邮件发送结果:', result);
    })
    .catch(error => {
        console.error('邮件发送错误:', error);
    });
    */
}

// 页面加载动画
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});