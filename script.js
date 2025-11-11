 
// ====== الإعدادات والمتغيرات الأساسية ======
const DESIGNS_CONTAINER_ID = 'designs-grid'; // الحاوية الرئيسية للتصاميم
const COLOR_MODAL_ID = 'color-modal'; // الحاوية المنبثقة لاختيار الألوان
const BACK_BUTTON_ID = 'back-btn'; // زر العودة
const CONFIRM_BUTTON_ID = 'confirm-btn'; // زر تأكيد الألوان (واتساب)
const SAVE_BUTTON_ID = 'save-btn'; // زر الحفظ المؤقت
const RESET_BUTTON_ID = 'reset-btn'; // زر تصفير الخانات
const PREVIEW_STATUS_ID = 'preview-status'; // عنصر عرض حالة التصميم في المودال
const PREVIEW_NUMBER_ID = 'preview-number'; // عنصر عرض رقم التصميم في المودال
const PREVIEW_IMAGE_ID = 'preview-image'; // عنصر عرض الصورة في المودال
const WHATSAPP_NUMBER = '+967777967272'; // رقم الواتساب المستهدف

let currentDesignId = null; // لتتبع رقم التصميم الحالي (1 إلى 60)

// قائمة الأحرف للإصدارات (1-1, 1-2, 1-3, ...)
const VERSIONS = ['-1', '-2', '-3', '-4', '-5', '-6', '-7', '-8', '-9', '-10'];

// عند تحميل الصفحة، نجهز كل شيء
document.addEventListener('DOMContentLoaded', () => {
    // 1. إخفاء المودال عند التحميل
    document.getElementById(COLOR_MODAL_ID).style.display = 'none';
    
    // 2. تفعيل وظائف الأزرار الرئيسية
    initializeDesignButtons();
    
    // 3. تفعيل وظائف اختيار الألوان
    initializeColorPickers();
    
    // 4. تفعيل أزرار الإجراءات داخل المودال
    setupModalActions();
    
    // 5. تحديث حالة أزرار "قم بالتلوين" في الواجهة الرئيسية
    updateAllDesignButtonsStatus();

    // 6. تفعيل نوافذ معاينة الصور
    initializePreviewModals();

    // تحميل الإصدارات الافتراضية للنقشة 1
    loadVersionsForDesign(1);

    // ربط الـ select لتغيير النقشة
    document.getElementById('main-design-number').addEventListener('change', (e) => {
        const selectedDesignId = e.target.value;
        loadVersionsForDesign(selectedDesignId);
    });
});

// ==========================================================
// 1. وظائف واجهة المستخدم (فتح/إغلاق المودال وتحديث الحالة)
// ==========================================================

// وظيفة فتح/إخفاء واجهة اختيار الألوان
function toggleColorModal(designId, isEdit = false) {
    const mainContainer = document.querySelector('main.container');
    const modal = document.getElementById(COLOR_MODAL_ID);
    
    if (modal.style.display === 'flex') {
        // العودة للواجهة الرئيسية (إغلاق المودال)
        modal.style.display = 'none';
        mainContainer.style.display = 'block'; 
        currentDesignId = null;
        updateAllDesignButtonsStatus(); // تحديث أزرار الواجهة الرئيسية بعد الإغلاق
    } else {
        // فتح واجهة الاختيار
        currentDesignId = designId;
        mainContainer.style.display = 'none';
        modal.style.display = 'flex';
        
        // تحديث محتوى المودال
        loadModalContent(designId, isEdit);
    }
}

// وظيفة تحميل محتوى المودال (رقم، صورة، حالة، بيانات)
function loadModalContent(designId, isEdit) {
    const statusElement = document.getElementById(PREVIEW_STATUS_ID);
    const numberElement = document.getElementById(PREVIEW_NUMBER_ID);
    const imageElement = document.getElementById(PREVIEW_IMAGE_ID);
    
    // 1. تحديث رقم التصميم
    numberElement.textContent = designId;

    // 2. تحديث صورة التصميم
    imageElement.src = `img/${designId}.jpg`;
    imageElement.alt = `نقشة رقم ${designId}`;
    
    // 3. تحديث الحالة
    const status = localStorage.getItem(`design_${designId}_status`) || '⚠️ لم يتم الاختيار';
    statusElement.textContent = status;
    statusElement.className = getStatusClass(status); // تحديث فئة الـ CSS لتعكس الحالة

    // 4. جلب البيانات المحفوظة إذا كانت تعديل أو موجودة
    if (isEdit) {
        loadDesignData(designId);
    } else {
        // في حال اختيار جديد، نبدأ بالتصفير
        resetColorInputs();
    }
}

// وظيفة إضافة مُستمعي الأحداث لأزرار التصاميم في الواجهة الرئيسية
function initializeDesignButtons() {
    document.querySelectorAll('.design-container').forEach(container => {
        const designId = container.dataset.id;
        const button = container.querySelector('.design-button');
        
        button.addEventListener('click', () => {
            // نتحقق من محتوى الزر لمعرفة ما إذا كان "تعديل"
            const isEdit = button.textContent.includes('تعديل') || button.textContent.includes('تم الإرسال');
            toggleColorModal(designId, isEdit);
        });
    });
}

// وظيفة تحديث حالة جميع أزرار الواجهة الرئيسية (قم بالتلوين/تعديل)
function updateAllDesignButtonsStatus() {
    document.querySelectorAll('.design-container').forEach(container => {
        const designId = container.dataset.id;
        const button = container.querySelector('.design-button');
        const status = localStorage.getItem(`design_${designId}_status`);
        
        if (status === 'تم الإرسال') {
            button.textContent = 'تم الإرسال (تعديل)';
        } else if (status === 'تم الاختيار') {
            button.textContent = 'تعديل ألوان هذه النقشة';
        } else {
            button.textContent = 'قم بالتلوين';
        }
    });
    // تحديث عدادات الحالة في الـ Header (اختياري)
    updateHeaderCounters();
}

// ==========================================================
// 2. وظائف اختيار الألوان وعرضها
// ==========================================================

// وظيفة تهيئة أزرار اختيار الألوان داخل المودال
function initializeColorPickers() {
    // نُنشئ حقل اللون المخفي مرة واحدة
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.style.display = 'none';
    document.body.appendChild(colorInput);

    // إضافة مُستمع لجميع أزرار الألوان
    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const buttonType = e.target.dataset.type; // 'background', 'pattern', 'edges'
            const versionId = e.target.closest('.version-container').dataset.version; // '1-1', '1-2', ...

            colorInput.click(); // فتح منتقي الألوان الأصلي

            colorInput.onchange = (event) => {
                const selectedColor = event.target.value; // الكود #RRGGBB
                
                // البحث عن عناصر العرض الخاصة بهذا الإصدار وهذا النوع
                const versionContainer = document.querySelector(`.version-container[data-version="${versionId}"]`);
                
                // تحديث الدائرة (class: .color-circle)
                const circle = versionContainer.querySelector(`.color-display[data-type="${buttonType}"] .color-circle`);
                if (circle) circle.style.backgroundColor = selectedColor;
                
                // تحديث كود اللون (class: .color-code)
                const codeDisplay = versionContainer.querySelector(`.color-display[data-type="${buttonType}"] .color-code`);
                if (codeDisplay) {
                    codeDisplay.textContent = selectedColor;
                    codeDisplay.dataset.color = selectedColor; // حفظ الكود داخلياً لجمعه لاحقاً
                }
            };
        });
    });
}

// ==========================================================
// 3. وظائف إدارة البيانات والحفظ والتصفير
// ==========================================================

// وظيفة جمع البيانات من جميع الإصدارات
function collectDesignData() {
    const data = {};
    document.querySelectorAll('.version-container').forEach(versionContainer => {
        // نأخذ الجزء الثاني من data-version ليكون هو مفتاح الإصدار (a, b, c, ...)
        const fullVersion = versionContainer.dataset.version; 
        const version = fullVersion.split('-')[1]; // مثال: من '1-1' نأخذ 'a'

        const backgroundCode = versionContainer.querySelector(`.color-display[data-type="background"] .color-code`).dataset.color || versionContainer.querySelector(`.color-display[data-type="background"] .color-code`).textContent;
        const patternCode = versionContainer.querySelector(`.color-display[data-type="pattern"] .color-code`).dataset.color || versionContainer.querySelector(`.color-display[data-type="pattern"] .color-code`).textContent;
        const edgesCode = versionContainer.querySelector(`.color-display[data-type="edges"] .color-code`).dataset.color || versionContainer.querySelector(`.color-display[data-type="edges"] .color-code`).textContent;

        data[version] = {
            background: backgroundCode,
            pattern: patternCode,
            edges: edgesCode,
        };
    });
    return data;
}

// وظيفة تحميل البيانات المحفوظة من Local Storage
function loadDesignData(designId) {
    const dataJSON = localStorage.getItem(`design_${designId}_data`);
    if (!dataJSON) return resetColorInputs(); // تصفير إذا لم يكن هناك بيانات

    const data = JSON.parse(dataJSON);
    
    // يتم تحميل البيانات في الإصدارات العشرة
    for (const version of VERSIONS) {
        const fullVersion = `${designId}${version}`; // يجب بناء مفتاح version-container
        const colors = data[version];
        if (colors) {
             const versionContainer = document.querySelector(`.version-container[data-version="${fullVersion}"]`);
             if (versionContainer) {
                 for (const [type, colorCode] of Object.entries(colors)) {
                    // تحديث الدائرة
                    const circle = versionContainer.querySelector(`.color-display[data-type="${type}"] .color-circle`);
                    if (circle) circle.style.backgroundColor = colorCode;
                    
                    // تحديث كود اللون
                    const codeDisplay = versionContainer.querySelector(`.color-display[data-type="${type}"] .color-code`);
                    if (codeDisplay) {
                        codeDisplay.textContent = colorCode;
                        codeDisplay.dataset.color = colorCode;
                    }
                }
             }
        }
    }
}

// وظيفة تصفير الخانات
function resetColorInputs() {
    // تصفير جميع دوائر الألوان وعرض الكود
    document.querySelectorAll('.color-circle').forEach(circle => {
        circle.style.backgroundColor = '#f0f0f0'; // لون افتراضي محايد
    });
    document.querySelectorAll('.color-code').forEach(codeDisplay => {
        codeDisplay.textContent = '#N/A';
        codeDisplay.dataset.color = '#N/A';
    });
}


// وظيفة إضافة مُستمعي الأحداث لأزرار الإجراءات داخل المودال
function setupModalActions() {
    // زر العودة
    document.getElementById(BACK_BUTTON_ID).addEventListener('click', () => {
        toggleColorModal(currentDesignId); // إغلاق المودال والعودة
    });
    
    // زر الحفظ المؤقت
    document.getElementById(SAVE_BUTTON_ID).addEventListener('click', () => {
        if (!currentDesignId) return;
        const designData = collectDesignData();
        localStorage.setItem(`design_${currentDesignId}_data`, JSON.stringify(designData));
        
        // تحديث الحالة
        const status = 'تم الاختيار';
        localStorage.setItem(`design_${currentDesignId}_status`, status);
        document.getElementById(PREVIEW_STATUS_ID).textContent = status;
        document.getElementById(PREVIEW_STATUS_ID).className = getStatusClass(status);

        alert(`تم حفظ الألوان مؤقتاً للتصميم رقم ${currentDesignId}`);
    });
    
    // زر التصفير
    document.getElementById(RESET_BUTTON_ID).addEventListener('click', resetColorInputs);
    
    // زر التأكيد (واتساب)
    document.getElementById(CONFIRM_BUTTON_ID).addEventListener('click', sendToWhatsApp);

    // زر الإغلاق (X)
    document.querySelector('.close-button').addEventListener('click', () => {
        toggleColorModal(currentDesignId);
    });
}

// ==========================================================
// 4. وظيفة الإرسال عبر واتساب
// ==========================================================

function sendToWhatsApp() {
    if (!currentDesignId) return;
    
    const designData = collectDesignData();
    let messageText = ` عزيزي المصمم المبدع صدام ، انيك عار الذي يكرهك .. قم بأعتماد هذه الالوان للتصميم رقم (${currentDesignId}) : \n\n_________________\n`;

    // بناء نص الرسالة بالتنسيق المطلوب
    for (const [version, colors] of Object.entries(designData)) {
        // تجاوز الإصدارات التي لم يتم تلوينها (إذا كانت كلها #N/A)
        if (colors.background === '#N/A' && colors.pattern === '#N/A' && colors.edges === '#N/A') continue;

        messageText += `-- الاصدار ${version.toUpperCase()} / \n`;
        messageText += `* لون الخلفية : ${colors.background}\n`;
        messageText += `* لون النقشة : ${colors.pattern}\n`;
        messageText += `* لون الحواشي : ${colors.edges}\n`;
        messageText += `-----\n`;
    }
    
    messageText += `\n**تم ارسال الطلب من تطبيق اختيار الألوان.**`;

    // ترميز النص ليتناسب مع رابط URL
    const encodedMessage = encodeURIComponent(messageText);

    // إنشاء رابط الواتساب
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // فتح الرابط
    window.open(whatsappURL, '_blank');
    
    // تحديث الحالة بعد الإرسال
    const status = 'تم الإرسال';
    localStorage.setItem(`design_${currentDesignId}_status`, status);
    document.getElementById(PREVIEW_STATUS_ID).textContent = status;
    document.getElementById(PREVIEW_STATUS_ID).className = getStatusClass(status);
}

// ==========================================================
// 5. وظائف إضافية / مساعدة
// ==========================================================

// وظيفة مساعدة لتحديد فئة CSS للحالة
function getStatusClass(status) {
    if (status === 'تم الإرسال') {
        return 'preview-status status-sent';
    } else if (status === 'تم الاختيار') {
        return 'preview-status status-selected';
    } else {
        return 'preview-status status-not-selected';
    }
}

// وظيفة تحديث عدادات الـ Header (اختياري لكن مفيد)
function updateHeaderCounters() {
    let selectedCount = 0;
    let sentCount = 0;
    
    // بما أن هناك 60 نقشة، نمر عليها افتراضياً
    for (let i = 1; i <= 60; i++) {
        const status = localStorage.getItem(`design_${i}_status`);
        if (status === 'تم الاختيار') {
            selectedCount++;
        } else if (status === 'تم الإرسال') {
            sentCount++;
        }
    }

    // يجب إضافة IDs للعناصر في الـ HTML
    // إذا افترضنا أن العناصر هي #ready-count و #completed-count
    const readyElement = document.getElementById('ready-count');
    const completedElement = document.getElementById('completed-count');
    
    // افتراضاً: "جاهزة بدون ألوان" = الإجمالي (60) - (المختارة + المرسلة)
    const totalDesigns = 16; // يجب التأكد من العدد الحقيقي
    const unselectedCount = totalDesigns - selectedCount - sentCount;
    
    if (readyElement) readyElement.textContent = unselectedCount > 0 ? unselectedCount : 0;
    if (completedElement) completedElement.textContent = sentCount;
}

// ==========================================================
// 6. وظائف تفعيل نوافذ معاينة الصور
// ==========================================================

function initializePreviewModals() {
    // إخفاء النوافذ عند التحميل
    document.getElementById('image-preview-modal').style.display = 'none';
    document.getElementById('version-preview-modal').style.display = 'none';

    // أزرار معاينة النقشات الأصلية (preview-btn)
    document.querySelectorAll('.preview-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const container = e.target.closest('.design-container');
            const imgSrc = container.querySelector('.design-image img').src;
            document.getElementById('previewed-image').src = imgSrc;
            document.getElementById('image-preview-modal').style.display = 'flex';
        });
    });

    // أزرار معاينة الإصدارات الملونة (version-view-button2)
    document.querySelectorAll('.version-view-button2').forEach(button => {
        button.addEventListener('click', (e) => {
            const item = e.target.closest('.version-item2');
            const imgSrc = item.querySelector('.version-image2 img').src;
            document.getElementById('version-previewed-image').src = imgSrc;
            updateApproveButtonInModal(imgSrc);
            document.getElementById('version-preview-modal').style.display = 'flex';
        });
    });

    // إغلاق النوافذ عند النقر على زر الإغلاق (close-preview)
    document.querySelectorAll('.close-preview').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            document.getElementById('image-preview-modal').style.display = 'none';
            document.getElementById('version-preview-modal').style.display = 'none';
        });
    });

    // إغلاق النوافذ عند النقر خارج المحتوى (اختياري لتحسين التجربة)
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('image-preview-modal')) {
            document.getElementById('image-preview-modal').style.display = 'none';
        }
        if (e.target === document.getElementById('version-preview-modal')) {
            document.getElementById('version-preview-modal').style.display = 'none';
        }
    });

    // تفعيل زر "الاطلاع على ألوان النقشة"
    document.getElementById('view-colors-btn').addEventListener('click', () => {
        const previewedImageSrc = document.getElementById('previewed-image').src;
        const designId = previewedImageSrc.split('/').pop().split('.jpg')[0]; // استخراج رقم النقشة من src مثل img/2.jpg -> 2
        loadVersionsForDesign(designId);
        document.getElementById('main-design-number').value = designId;
        document.getElementById('image-preview-modal').style.display = 'none';
        document.getElementById('versions').scrollIntoView({ behavior: 'smooth' });
    });

    // تفعيل زر الاعتماد في المودال
    const approveBtn = document.querySelector('.approve-version-btn');
    approveBtn.addEventListener('click', () => {
        const imgSrc = document.getElementById('version-previewed-image').src;
        const parts = imgSrc.split('/').pop().split('.jpg')[0].split('-');
        const designId = parts[0];
        const versionNum = parts[1];
        const approvedKey = `approved_${designId}_${versionNum}`;
        const isApproved = localStorage.getItem(approvedKey) === 'true';
        const newApproved = !isApproved;
        localStorage.setItem(approvedKey, newApproved);
        approveBtn.textContent = newApproved ? 'إلغاء الاعتماد' : 'اعتماد هذا الاصدار';
        approveBtn.classList.toggle('approved', newApproved);
    });
}

// وظيفة تحديث زر الاعتماد في المودال بناءً على الصورة
function updateApproveButtonInModal(imgSrc) {
    const approveBtn = document.querySelector('.approve-version-btn');
    const parts = imgSrc.split('/').pop().split('.jpg')[0].split('-');
    const designId = parts[0];
    const versionNum = parts[1];
    const approvedKey = `approved_${designId}_${versionNum}`;
    const isApproved = localStorage.getItem(approvedKey) === 'true';
    approveBtn.textContent = isApproved ? 'إلغاء الاعتماد' : 'اعتماد هذا الاصدار';
    approveBtn.classList.toggle('approved', isApproved);
}

// وظيفة تحميل الإصدارات ديناميكياً لنقشة محددة
function loadVersionsForDesign(designId) {
    const grid = document.getElementById('designs-grid2');
    grid.innerHTML = ''; // تفريغ المحتوى السابق

    const container = document.createElement('div');
    container.className = 'design-container2';
    container.dataset.designId = designId;

    const rightDiv = document.createElement('div');
    rightDiv.className = 'design-right2';

    const mainImageDiv = document.createElement('div');
    mainImageDiv.className = 'design-main-image2';
    const mainImg = document.createElement('img');
    mainImg.src = `img/${designId}.jpg`;
    mainImg.alt = `${designId}`;
    mainImageDiv.appendChild(mainImg);

    const metaDiv = document.createElement('div');
    metaDiv.className = 'design-meta2';
    const idDiv = document.createElement('div');
    idDiv.className = 'design-id2';
    idDiv.textContent = `النقشة : ${designId}`;
    const colorsNumberDiv = document.createElement('div');
    colorsNumberDiv.className = 'design-colors-number2';
    colorsNumberDiv.textContent = 'عدد النقشات الملونة الجاهزة';
    metaDiv.appendChild(idDiv);
    metaDiv.appendChild(colorsNumberDiv);

    rightDiv.appendChild(mainImageDiv);
    rightDiv.appendChild(metaDiv);

    const leftDiv = document.createElement('div');
    leftDiv.className = 'design-left2';

    const versionsRows = document.createElement('div');
    versionsRows.className = 'versions-rows2';

    const row1 = document.createElement('div');
    row1.className = 'versions-row2';
    const row2 = document.createElement('div');
    row2.className = 'versions-row2';

    for (let i = 1; i <= 10; i++) {
        const versionItem = document.createElement('div');
        versionItem.className = 'version-item2';

        const versionImageDiv = document.createElement('div');
        versionImageDiv.className = 'version-image2';
        const versionImg = document.createElement('img');
        versionImg.src = `ready-versions/${designId}-${i}.jpg`;
        versionImg.alt = `${designId}-${i}`;
        versionImageDiv.appendChild(versionImg);

        const versionNameDiv = document.createElement('div');
        versionNameDiv.className = 'version-name2';
        versionNameDiv.textContent = `${designId}-${i}`;

        const viewButton = document.createElement('button');
        viewButton.className = 'version-view-button2';
        viewButton.title = 'معاينة مكبرة';
        viewButton.textContent = 'معاينة';

        const approveButton = document.createElement('button');
        approveButton.className = 'approve-btn design-button';
        const approvedKey = `approved_${designId}_${i}`;
        const isApproved = localStorage.getItem(approvedKey) === 'true';
        approveButton.textContent = isApproved ? 'إلغاء الاعتماد' : 'اعتماد';
        approveButton.addEventListener('click', () => {
            const newApproved = !isApproved;
            localStorage.setItem(approvedKey, newApproved);
            approveButton.textContent = newApproved ? 'إلغاء الاعتماد' : 'اعتماد';
        });

        versionItem.appendChild(versionImageDiv);
        versionItem.appendChild(versionNameDiv);
        versionItem.appendChild(viewButton);
        versionItem.appendChild(approveButton);

        if (i <= 5) {
            row1.appendChild(versionItem);
        } else {
            row2.appendChild(versionItem);
        }
    }

    versionsRows.appendChild(row1);
    versionsRows.appendChild(row2);
    leftDiv.appendChild(versionsRows);

    container.appendChild(rightDiv);
    container.appendChild(leftDiv);
    grid.appendChild(container);

    // إعادة تفعيل أزرار المعاينة بعد الإنشاء الديناميكي
    document.querySelectorAll('.version-view-button2').forEach(button => {
        button.addEventListener('click', (e) => {
            const item = e.target.closest('.version-item2');
            const imgSrc = item.querySelector('.version-image2 img').src;
            document.getElementById('version-previewed-image').src = imgSrc;
            updateApproveButtonInModal(imgSrc);
            document.getElementById('version-preview-modal').style.display = 'flex';
        });
    });
}
